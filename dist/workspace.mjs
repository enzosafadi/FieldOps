import {APP_VERSION} from './release.mjs';
import {validateWorkflow} from './workflow.mjs';
import {initialState, projects} from './model.mjs';

export const STORAGE_KEY = 'fieldops-v1';
export const MAX_BACKUP_BYTES = 2 * 1024 * 1024;
const fail = message => { throw new Error(message); };
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);

// This release restores scenario decisions, not arbitrary personnel records.
// Rebuild from trusted fixtures so unknown properties cannot reach the UI/model.
export function validateState(input) {
  const clean = initialState();
  if (!object(input) || input.version !== clean.version) fail('Unsupported workspace version.');
  if (!Array.isArray(input.workers) || input.workers.length !== clean.workers.length) fail('Backup must contain all 60 demo workers.');
  const ids = new Set();
  for (const worker of input.workers) {
    if (!object(worker) || ids.has(worker.id)) fail('Duplicate or invalid worker.');
    ids.add(worker.id);
    const base = clean.workers.find(w => w.id === worker.id);
    if (!base) fail('Unknown worker.');
    for (const key of ['name','region','qualified','units','hourly','firstPass']) {
      if (!same(worker[key],base[key])) fail('Demo worker details do not match this release.');
    }
    const unchanged = worker.project === base.project && worker.status === base.status;
    const assignedReserve = base.status === 'Available' && worker.status === 'Collecting' && base.qualified.includes(worker.project);
    if (!unchanged && !assignedReserve) fail('Invalid or unqualified worker assignment.');
    base.project = worker.project; base.status = worker.status;
  }
  if (!object(input.extraQA) || Object.keys(input.extraQA).length !== projects.length) fail('Invalid QA allocation.');
  for (const p of projects) {
    if (![0,6,12].includes(input.extraQA[p.id])) fail('QA allocation must be 0, 6 or 12 units/hour.');
    clean.extraQA[p.id] = input.extraQA[p.id];
  }
  if (typeof input.outage !== 'boolean') fail('Invalid connectivity setting.');
  clean.outage = input.outage;
  if (!Array.isArray(input.incidents) || input.incidents.length !== clean.incidents.length) fail('Incomplete incident register.');
  const incidentIds = new Set();
  for (const incident of input.incidents) {
    if (!object(incident) || incidentIds.has(incident.id)) fail('Duplicate or invalid incident.');
    incidentIds.add(incident.id);
    const base = clean.incidents.find(i => i.id === incident.id);
    if (!base) fail('Unknown incident.');
    for (const key of ['project','title','detail','severity','owner']) {
      if (incident[key] !== base[key]) fail('Demo incident details do not match this release.');
    }
    if (!['Open','Investigating','Resolved'].includes(incident.status)) fail('Invalid incident status.');
    base.status = incident.status;
  }
  if (!Array.isArray(input.audit) || input.audit.length > 5000) fail('Invalid or oversized decision history.');
  clean.audit = input.audit.map(entry => {
    if (!object(entry) || typeof entry.action !== 'string' || !entry.action.trim() || entry.action.length > 1000 || typeof entry.time !== 'string' || entry.time.length > 40 || !Number.isFinite(Date.parse(entry.time))) fail('Invalid decision history entry.');
    return {time:new Date(entry.time).toISOString(), action:entry.action};
  });
  Object.assign(clean,validateWorkflow(input,clean.workers));
  return clean;
}

export function createBackup(state, now = new Date()) {
  return JSON.stringify({format:'fieldops-workspace',schemaVersion:1,applicationVersion:APP_VERSION,exportedAt:now.toISOString(),state:validateState(state)},null,2);
}

export function parseBackup(text) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) fail('Choose a JSON backup smaller than 2 MB.');
  let backup;
  try { backup = JSON.parse(text); } catch { fail('This file is not valid JSON.'); }
  if (!object(backup) || backup.format !== 'fieldops-workspace' || backup.schemaVersion !== 1) fail('Choose a FieldOps workspace backup (format version 1).');
  if (typeof backup.exportedAt !== 'string' || !Number.isFinite(Date.parse(backup.exportedAt))) fail('Backup timestamp is invalid.');
  return {state:validateState(backup.state),exportedAt:backup.exportedAt};
}

export function loadWorkspace(storage) {
  let raw;
  try { raw = storage.getItem(STORAGE_KEY); } catch { return {state:initialState(),problem:'Browser storage is unavailable. Download a backup before closing this session.',raw:null}; }
  if (raw === null) return {state:initialState(),problem:null,raw:null};
  try { return {state:validateState(JSON.parse(raw)),problem:null,raw:null}; }
  catch { return {state:initialState(),problem:'Saved workspace could not be validated. It has been preserved. Download it before replacing it, or restore a valid backup.',raw}; }
}

export function saveWorkspace(storage,state) {
  const clean = validateState(state);
  storage.setItem(STORAGE_KEY,JSON.stringify(clean));
  return clean;
}

export function csvCell(value) {
  let text=String(value);
  if (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text="'"+text;
  return '"'+text.replaceAll('"','""')+'"';
}

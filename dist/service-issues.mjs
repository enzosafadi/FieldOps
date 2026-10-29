import {recordEvent} from './workflow.mjs';
import {validAppointment} from './repairs.mjs';
export const updateTypes=['Visit started','Initial inspection','Diagnosis in progress','Fault identified','Diagnostic test completed','Repair started','Repair completed','Repair unsuccessful','Preventive maintenance','Safety concern identified','Emergency intervention','Urgent replacement required','Replacement recommended','Part ordered','Part unavailable','Temporary repair performed','Equipment taken out of service','Client declined work','Client approval requested','Additional damage discovered','Warranty review','Quality check completed','Return visit required','Waiting for property access','Visit closed'];
export const issueStatuses=['Open','In progress','Waiting for parts','Waiting for client','Monitoring','Resolved'];
export const clientImpacts=['No service impact','Appointment delayed','Service interrupted','Equipment unusable','Return visit required','Additional cost proposed','Replacement recommended','Safety restriction'];
export const authorizations=['Not required','Not requested','Pending','Approved','Declined'];
const fields=['title','updateType','severity','status','workDone','findings','nextAction','parts','impactType','impactNote','downtimeMinutes','extraCostCAD','clientNotified','authorization','followupAt'];
const snapshot=record=>Object.fromEntries(fields.map(k=>[k,record[k]]));
const text=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function validateSnapshot(v){
 if(!v||!text(v.title,160)||!updateTypes.includes(v.updateType)||!['Normal','Urgent','Emergency'].includes(v.severity)||!issueStatuses.includes(v.status)||!text(v.workDone,1000)||!text(v.findings,1000)||!text(v.nextAction,1000)||typeof v.parts!=='string'||v.parts.length>500||!clientImpacts.includes(v.impactType)||!text(v.impactNote,1000)||!Number.isInteger(v.downtimeMinutes)||v.downtimeMinutes<0||v.downtimeMinutes>525600||typeof v.extraCostCAD!=='number'||!Number.isFinite(v.extraCostCAD)||v.extraCostCAD<0||v.extraCostCAD>1000000||typeof v.clientNotified!=='boolean'||!authorizations.includes(v.authorization)||typeof v.followupAt!=='string'||v.followupAt!==''&&!validAppointment(v.followupAt))throw Error('Complete the technician update and client-impact fields with valid values.');
 if(['Urgent','Emergency'].includes(v.severity)&&v.impactType==='No service impact')throw Error('Urgent and emergency issues need an explicit client impact.');
 return snapshot(v);
}
const summary=v=>v===null?null:({updateType:v.updateType,severity:v.severity,status:v.status,clientImpact:v.impactType,estimatedDowntimeMinutes:v.downtimeMinutes,proposedExtraCostCAD:v.extraCostCAD,authorization:v.authorization,clientNotified:v.clientNotified});
export function recordServiceIssue(s,repairId,issueId,data,now=new Date()){
 const repair=s.repairOrders.find(r=>r.id===repairId);if(!repair)throw Error('Repair order not found.');
 const next=validateSnapshot(data),existing=issueId?s.issueCases.find(i=>i.id===issueId&&i.repairId===repairId):null;
 if(issueId&&!existing)throw Error('Issue is not linked to this repair order.');
 if(existing&&next.title!==existing.title)throw Error('Keep the issue title; describe new findings in the update.');
 if(s.issueHistory.length>=3000||s.workflowEvents.length>=5000||!existing&&s.issueCases.length>=500)throw Error('Issue history is full. Export the workspace before continuing.');
 const id=existing?.id||'ISS-'+String(Math.max(0,...s.issueCases.map(i=>Number(i.id.slice(4))))+1).padStart(3,'0');
 const before=existing?snapshot(existing):null,version=(existing?.version||0)+1;
 recordEvent(s,'service_issue',id,null,`${id}: ${next.updateType}`,`${repair.client} · ${next.workDone} · Client impact: ${next.impactNote}`.slice(0,1000),summary(before),summary(next),now);
 const updated={id,repairId,clientId:repair.clientId,version,...next};
 if(existing)Object.assign(existing,updated);else s.issueCases.push(updated);
 s.issueHistory.push({id:(s.issueHistory.at(-1)?.id||0)+1,issueId:id,repairId,clientId:repair.clientId,version,time:now.toISOString(),actor:s.operatorName,before,after:next});return id;
}
export function validateServiceIssues(input,repairs){
 if(input.issueCases===undefined&&input.issueHistory===undefined)return {issueCases:[],issueHistory:[]};
 if(!Array.isArray(input.issueCases)||input.issueCases.length>500||!Array.isArray(input.issueHistory)||input.issueHistory.length>3000)throw Error('Invalid service issue records.');
 const ids=new Set(),issueCases=input.issueCases.map(i=>{
  const repair=repairs.find(r=>r.id===i?.repairId);
  if(!i||!/^ISS-\d{3,6}$/.test(i.id)||ids.has(i.id)||!repair||i.clientId!==repair.clientId||!Number.isSafeInteger(i.version)||i.version<1)throw Error('Invalid issue-to-client link.');
  ids.add(i.id);return {id:i.id,repairId:i.repairId,clientId:i.clientId,version:i.version,...validateSnapshot(i)};
 });
 let previousId=0;const latest=new Map(),versions=new Map();
 const issueHistory=input.issueHistory.map(e=>{
  const current=issueCases.find(i=>i.id===e?.issueId);
  if(!e||!Number.isSafeInteger(e.id)||e.id<=previousId||!current||current.repairId!==e.repairId||current.clientId!==e.clientId||e.version!==(versions.get(e.issueId)||0)+1||!text(e.time,40)||!Number.isFinite(Date.parse(e.time))||!text(e.actor,80))throw Error('Invalid service issue history.');
  const before=e.before===null?null:validateSnapshot(e.before),after=validateSnapshot(e.after);
  if(!same(latest.get(e.issueId)||null,before))throw Error('Broken service issue history.');
  latest.set(e.issueId,after);versions.set(e.issueId,e.version);previousId=e.id;
  return {id:e.id,issueId:e.issueId,repairId:e.repairId,clientId:e.clientId,version:e.version,time:new Date(e.time).toISOString(),actor:e.actor,before,after};
 });
 for(const i of issueCases)if(i.version!==versions.get(i.id)||!same(snapshot(i),latest.get(i.id)))throw Error('Service issue does not match its recorded history.');
 return {issueCases,issueHistory};
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState} from '../dist/model.mjs';
import {recordServiceIssue,updateTypes,validateServiceIssues} from '../dist/service-issues.mjs';
import {createBackup,parseBackup,validateState} from '../dist/workspace.mjs';
const report={title:'Drain pump failure',updateType:'Urgent replacement required',severity:'Urgent',status:'Waiting for client',workDone:'Inspected the pump and documented the failed component. No replacement performed.',findings:'Pump does not operate during the diagnostic test.',nextAction:'Obtain client authorization and confirm part availability.',parts:'Replacement drain pump, reference DP-014',impactType:'Equipment unusable',impactNote:'Client cannot use the washing machine until the repair is authorized and completed.',downtimeMinutes:1440,extraCostCAD:185,clientNotified:true,authorization:'Pending',followupAt:'2026-11-02T12:00'};
test('technician report links work, urgent replacement and ramifications to the exact client',()=>{
 const s=initialState();s.operatorName='Technician Alex';const id=recordServiceIssue(s,'REP-001',null,report);
 assert.equal(id,'ISS-001');assert.equal(s.issueCases[0].clientId,'CLIENT-01');assert.equal(s.issueHistory[0].actor,'Technician Alex');assert.equal(s.issueCases[0].authorization,'Pending');assert.equal(s.workflowEvents.at(-1).entityType,'service_issue');assert.deepEqual(parseBackup(createBackup(s)).state,s);
});
test('each subsequent update preserves earlier work and client-impact estimates',()=>{
 const s=initialState(),id=recordServiceIssue(s,'REP-001',null,report);
 recordServiceIssue(s,'REP-001',id,{...report,updateType:'Part ordered',status:'Waiting for parts',workDone:'Recorded client authorization and parts request.',extraCostCAD:195,authorization:'Approved'});
 assert.equal(s.issueCases[0].version,2);assert.equal(s.issueHistory[0].after.extraCostCAD,185);assert.equal(s.issueHistory[0].after.authorization,'Pending');assert.equal(s.issueHistory[1].before.extraCostCAD,185);assert.equal(s.issueHistory[1].after.extraCostCAD,195);validateState(s);
});
test('expanded issue types cover emergency, replacement, diagnostics and closure',()=>{
 assert.ok(updateTypes.length>=25);for(const type of ['Emergency intervention','Urgent replacement required','Diagnosis in progress','Repair completed','Client declined work','Visit closed'])assert.ok(updateTypes.includes(type));
});
test('emergency cannot be recorded without explicit client impact',()=>{
 const s=initialState(),before=structuredClone(s);assert.throws(()=>recordServiceIssue(s,'REP-001',null,{...report,severity:'Emergency',impactType:'No service impact'}),/explicit client impact/);assert.deepEqual(s,before);
 recordServiceIssue(s,'REP-001',null,{...report,severity:'Emergency',updateType:'Emergency intervention',impactType:'Safety restriction'});assert.equal(s.issueCases[0].severity,'Emergency');
});
test('cross-client changes cannot attach an update to another repair',()=>{
 const s=initialState(),id=recordServiceIssue(s,'REP-001',null,report);assert.throws(()=>recordServiceIssue(s,'REP-002',id,report),/not linked/);
 const changed=structuredClone(s);changed.issueCases[0].clientId='CLIENT-02';assert.throws(()=>validateServiceIssues(changed,changed.repairOrders),/client link/);
});
test('negative costs, invalid types and incomplete work/impact fields are rejected',()=>{
 for(const data of [{extraCostCAD:-1},{downtimeMinutes:-1},{extraCostCAD:Infinity},{workDone:''},{impactNote:''},{findings:''},{nextAction:''},{updateType:'Invented'},{clientNotified:'yes'},{followupAt:'2027-03-14T02:30'}]){const s=initialState();assert.throws(()=>recordServiceIssue(s,'REP-001',null,{...report,...data}));assert.equal(s.issueCases.length,0);}
});
test('history discontinuity and mismatched latest state are detected on restore',()=>{
 const s=initialState(),id=recordServiceIssue(s,'REP-001',null,report);recordServiceIssue(s,'REP-001',id,{...report,status:'In progress',workDone:'Performed the authorized follow-up inspection.'});
 const broken=structuredClone(s);broken.issueHistory[1].before.status='Resolved';assert.throws(()=>validateState(broken),/Broken/);
 const changed=structuredClone(s);changed.issueCases[0].impactNote='Changed without an update';assert.throws(()=>validateState(changed),/does not match/);
});
test('recording an emergency has no automatic appointment or financial side effect',()=>{
 const s=initialState(),appointments=structuredClone(s.repairOrders);recordServiceIssue(s,'REP-001',null,{...report,severity:'Emergency',impactType:'Safety restriction'});assert.deepEqual(s.repairOrders,appointments);assert.equal(s.repairHistory.length,0);assert.equal(s.extraQA.P01,0);
});

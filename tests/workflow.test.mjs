import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,assign,addQA} from '../dist/model.mjs';
import {advanceWork,createWork,trackOperationalChanges} from '../dist/workflow.mjs';
import {createBackup,parseBackup,validateState} from '../dist/workspace.mjs';

test('full work lifecycle preserves each execution and rework step with its operator',()=>{
 const s=initialState();s.operatorName='Enzo';
 advanceWork(s,'WORK-001','In progress','Started capture and equipment checks.','');
 assert.throws(()=>advanceWork(s,'WORK-001','Accepted','Skip review',''),/not allowed/);
 assert.throws(()=>advanceWork(s,'WORK-001','Submitted','Completed capture',''),/output reference/);
 advanceWork(s,'WORK-001','Submitted','Uploaded recording batch.','BATCH-014-v1');
 s.operatorName='Demo reviewer';advanceWork(s,'WORK-001','Rework','Audio on item 4 is incomplete.','BATCH-014-v1');
 s.operatorName='Enzo';advanceWork(s,'WORK-001','In progress','Recapturing item 4.','BATCH-014-v1');
 advanceWork(s,'WORK-001','Submitted','Replaced item 4 and resubmitted.','BATCH-014-v2');
 s.operatorName='Demo reviewer';advanceWork(s,'WORK-001','Accepted','All items passed QA.','BATCH-014-v2');
 const history=s.workflowEvents.filter(e=>e.entityId==='WORK-001');
 assert.equal(history.length,7);assert.equal(history[2].after.output,'BATCH-014-v1');assert.equal(history[3].actor,'Demo reviewer');assert.equal(history.at(-1).before.status,'Submitted');
 assert.throws(()=>advanceWork(s,'WORK-001','In progress','Reopen accepted work',''),/not allowed/);
 assert.deepEqual(parseBackup(createBackup(s)).state,s);
});
test('every operational mutation records linked actor and before/after values',()=>{
 const s=initialState(),before=structuredClone(s);s.operatorName='Enzo';
 assign(s,'FO-049','P01');addQA(s,'P02');s.incidents[0].status='Investigating';s.outage=true;trackOperationalChanges(s,before);
 const events=s.workflowEvents.filter(e=>e.source==='user');assert.equal(events.length,4);assert.ok(events.every(e=>e.actor==='Enzo'));
 assert.deepEqual(events.find(e=>e.entityType==='worker').before,{project:null,status:'Available'});
 assert.equal(events.find(e=>e.entityType==='quality').after.unitsPerHour,6);validateState(s);
});
test('creating work begins a per-record history and enforces worker qualification',()=>{
 const s=initialState();assert.throws(()=>createWork(s,{title:'Invalid',project:'P99',owner:'FO-001'},'Assignment'),/qualified/);
 const id=createWork(s,{title:'New recording deliverable',project:'P01',owner:'FO-001'},'Capture the assigned sequence.');
 assert.equal(id,'WORK-004');assert.equal(s.workflowEvents.at(-1).before,null);assert.equal(s.workflowEvents.at(-1).entityId,id);validateState(s);
});
test('broken history and mismatched current work are rejected during restore',()=>{
 const s=initialState();advanceWork(s,'WORK-001','In progress','Started work.','');
 const broken=structuredClone(s);broken.workflowEvents.at(-1).before.status='Accepted';assert.throws(()=>validateState(broken),/broken step/);
 const changed=structuredClone(s);changed.workItems[0].status='Accepted';assert.throws(()=>validateState(changed),/does not match/);
});
test('older saves receive explicitly simulated starting records without fabricated prior user activity',()=>{
 const old=initialState();delete old.workItems;delete old.workflowEvents;delete old.operatorName;
 const migrated=validateState(old);assert.equal(migrated.workflowEvents.length,3);assert.ok(migrated.workflowEvents.every(e=>e.source==='seed'&&e.note.includes('No earlier work history')));
});

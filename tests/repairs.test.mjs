import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState} from '../dist/model.mjs';
import {rescheduleRepair,validAppointment,validateRepairs,appointmentEpoch} from '../dist/repairs.mjs';
import {createBackup,parseBackup,validateState} from '../dist/workspace.mjs';
const clock=new Date('2026-10-29T13:00:00Z');
const request={scheduledAt:'2026-11-02T10:00',technician:'TECH-01',reason:'Client unavailable',requestedBy:'Client',note:'Client has a work appointment; requested Monday morning.',confirmed:true};

test('reschedule retains original slot, client reason, recorder and confirmation',()=>{
 const s=initialState();s.operatorName='Enzo';rescheduleRepair(s,'REP-001',request,clock);
 const record=s.repairHistory[0];assert.equal(record.before.scheduledAt,'2026-10-30T09:00');assert.equal(record.after.scheduledAt,request.scheduledAt);assert.equal(record.actor,'Enzo');assert.equal(record.requestedBy,'Client');assert.equal(record.reason,'Client unavailable');assert.equal(s.repairOrders[0].confirmation,'Confirmed');assert.equal(s.workflowEvents.at(-1).entityType,'repair');
 assert.deepEqual(parseBackup(createBackup(s)).state,s);
});
test('successive client changes preserve a continuous history including pending confirmation',()=>{
 const s=initialState();rescheduleRepair(s,'REP-001',request,clock);
 rescheduleRepair(s,'REP-001',{...request,scheduledAt:'2026-11-03T14:00',reason:'Parts or materials delayed',requestedBy:'Dispatcher',confirmed:false},clock);
 assert.equal(s.repairHistory.length,2);assert.deepEqual(s.repairHistory[1].before,s.repairHistory[0].after);assert.equal(s.repairOrders[0].confirmation,'Pending');validateState(s);
});
test('invalid, unchanged, past and unreasoned requests never change the order',()=>{
 for(const override of [{scheduledAt:'2026-02-30T09:00'},{scheduledAt:'2026-10-28T09:00'},{scheduledAt:'2026-10-30T09:00'},{reason:''},{note:' '},{technician:'unknown'},{requestedBy:'Unknown'},{confirmed:'yes'}]){
  const s=initialState(),before=structuredClone(s);assert.throws(()=>rescheduleRepair(s,'REP-001',{...request,...override},clock));assert.deepEqual(s,before);
 }
});
test('conflicting technician windows are blocked while adjacent visits are allowed',()=>{
 const s=initialState();assert.throws(()=>rescheduleRepair(s,'REP-001',{...request,scheduledAt:'2026-10-30T14:00'},clock),/already has/);
 rescheduleRepair(s,'REP-001',{...request,scheduledAt:'2026-10-30T15:00'},clock);validateState(s);
});
test('history tampering and appointments without matching history are rejected',()=>{
 const s=initialState();rescheduleRepair(s,'REP-001',request,clock);
 const broken=structuredClone(s);broken.repairHistory[0].before.scheduledAt='2026-10-30T08:00';assert.throws(()=>validateRepairs(broken),/broken/);
 const changed=structuredClone(s);changed.repairOrders[0].scheduledAt='2026-11-04T09:00';assert.throws(()=>validateRepairs(changed),/does not match/);
});
test('legacy v1.1 saves migrate with clearly simulated original bookings',()=>{
 const s=initialState();delete s.repairOrders;delete s.repairHistory;const clean=validateState(s);assert.equal(clean.repairOrders.length,3);assert.equal(clean.repairHistory.length,0);
});
test('Toronto daylight-saving gaps and ambiguous times are rejected',()=>{
 assert.equal(validAppointment('2027-03-14T02:30'),false);assert.equal(validAppointment('2026-11-01T01:30'),false);assert.equal(validAppointment('2026-11-02T10:00'),true);assert.equal(new Date(appointmentEpoch('2026-11-02T10:00')).toISOString(),'2026-11-02T15:00:00.000Z');
});
test('long request notes remain fully retained while global event text stays valid',()=>{
 const s=initialState();rescheduleRepair(s,'REP-001',{...request,note:'x'.repeat(1000)},clock);assert.equal(s.repairHistory[0].note.length,1000);validateState(s);
});

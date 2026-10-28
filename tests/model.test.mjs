import assert from 'node:assert/strict';
import {initialState,metrics,assign,addQA,projects} from '../dist/model.mjs';
const s=initialState();assert.equal(s.workers.length,60);assert.ok(s.workers.filter(w=>w.project).every(w=>w.qualified.includes(w.project)),'All initial assignments must be qualified');assert.equal(new Set(s.workers.map(w=>w.id)).size,60);
const baseline=metrics(s,'P02');assert.equal(baseline.limited,'QA capacity');assert.ok(baseline.shortfall>0);
const candidate=s.workers.find(w=>w.status==='Available'&&w.qualified.includes('P02'));
assign(s,candidate.id,'P02');assert.equal(metrics(s,'P02').forecast,baseline.forecast,'Extra collection must not bypass a QA bottleneck');assert.throws(()=>assign(s,candidate.id,'P01'),/unavailable/);
assert.throws(()=>assign(s,'FO-005','P01'),/unavailable/);
const unqualified=s.workers.find(w=>w.status==='Available'&&!w.qualified.includes('P01'));assert.ok(unqualified);assert.throws(()=>assign(s,unqualified.id,'P01'),/qualification/);
addQA(s,'P02');assert.ok(metrics(s,'P02').forecast>baseline.forecast);assert.equal(metrics(s,'P02').firstPass,baseline.firstPass);assert.equal(metrics(s,'P02').accepted,baseline.accepted);addQA(s,'P02');assert.throws(()=>addQA(s,'P02'),/already/);
assert.equal(s.audit.length,3);assert.throws(()=>addQA(s,'BAD'),/Unknown/);
const stress=initialState(),pre=metrics(stress,'P01');stress.outage=true;assert.ok(metrics(stress,'P01').forecast<pre.forecast);
const empty=initialState();empty.workers.forEach(w=>{w.project=null;w.status='Absent'});for(const p of projects){const m=metrics(empty,p.id);assert.ok(Number.isFinite(m.forecast));assert.ok(m.forecast<=m.accepted+m.backlog);}
console.log('PASS: unique workforce, double-booking, eligibility, offline exclusion, QA bottleneck, reserve limits, frozen history, audit, outage and empty-capacity behavior.');

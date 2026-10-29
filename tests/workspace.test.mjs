import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,assign,addQA,totals} from '../dist/model.mjs';
import {validateState,createBackup,parseBackup,loadWorkspace,saveWorkspace,STORAGE_KEY,MAX_BACKUP_BYTES,csvCell} from '../dist/workspace.mjs';

test('backup round trip preserves real interventions and calculated output',()=>{
  const s=initialState();assign(s,'FO-049','P01');addQA(s,'P02');s.outage=true;s.incidents[0].status='Resolved';
  const restored=parseBackup(createBackup(s)).state;
  assert.deepEqual(restored,s);assert.deepEqual(totals(restored),totals(s));
  assert.throws(()=>assign(restored,'FO-049','P02'),/unavailable/);
});
test('legacy valid browser save survives upgrade',()=>{
  const s=initialState();addQA(s,'P03');const storage={getItem:()=>JSON.stringify(s)};
  assert.deepEqual(loadWorkspace(storage),{state:s,problem:null,raw:null});
});
test('damaged state remains available and is never overwritten while loading',()=>{
  let writes=0;for(const raw of ['{broken',JSON.stringify({...initialState(),workers:[]})]){
    const result=loadWorkspace({getItem:()=>raw,setItem:()=>writes++});
    assert.equal(result.raw,raw);assert.ok(result.problem);assert.deepEqual(result.state,initialState());
  }assert.equal(writes,0);
});
test('validation rejects dangerous and infeasible imports',()=>{
  const mutations=[
    s=>s.workers[0].name='<img src=x onerror=alert(1)>',
    s=>s.workers[0].units=Infinity,
    s=>s.workers[49].qualified.push('P99'),
    s=>{s.workers[49].project='P99';s.workers[49].status='Collecting'},
    s=>s.workers[1].id=s.workers[0].id,
    s=>{s.workers[4].status='Collecting'},
    s=>s.extraQA.P01=18,
    s=>s.extraQA.P01='6',
    s=>s.outage='true',
    s=>s.incidents[0].project='P99',
    s=>s.incidents[1].id=s.incidents[0].id,
    s=>s.audit.push({time:'bad date',action:'Test'}),
    s=>s.audit.push({time:new Date().toISOString(),action:'x'.repeat(1001)})
  ];
  for(const mutate of mutations){const s=initialState();mutate(s);assert.throws(()=>validateState(s));}
});
test('bad formats, incomplete files and oversized input fail without mutating live state',()=>{
  const current=initialState(),before=structuredClone(current);
  for(const text of ['{}','{','null',JSON.stringify({format:'fieldops-workspace',schemaVersion:9}), ' '.repeat(MAX_BACKUP_BYTES+1)])assert.throws(()=>parseBackup(text));
  assert.deepEqual(current,before);
});
test('only trusted shape is retained and validation cannot mutate its input',()=>{
  const s=initialState();s.untrusted='anything';s.workers[0].html='<script>';
  const result=validateState(s);assert.equal(result.untrusted,undefined);assert.equal(result.workers[0].html,undefined);assert.equal(s.workers[0].html,'<script>');
});
test('unavailable and full storage have explicit failure behavior',()=>{
  const storage={getItem(){throw Error('blocked')},setItem(){throw Error('full')}};
  assert.ok(loadWorkspace(storage).problem);assert.throws(()=>saveWorkspace(storage,initialState()),/full/);
  let saved;saveWorkspace({setItem:(key,value)=>{assert.equal(key,STORAGE_KEY);saved=value}},initialState());
  assert.deepEqual(JSON.parse(saved),initialState());
});
test('CSV exports quote text and neutralize spreadsheet formulas from restored history',()=>{
  assert.equal(csvCell('a,"b"'),'"a,""b"""');
  for(const value of ['=HYPERLINK("https://example.test")','+1+1','-1+1','@SUM(1)','  =1','\tSUM(1)'])assert.ok(csvCell(value).startsWith('"\''));
  assert.equal(csvCell(123),'"123"');
});

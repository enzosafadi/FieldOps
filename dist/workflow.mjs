export const stages=['Assigned','In progress','Submitted','Rework','Accepted','Rejected'];
export const transitions={'Assigned':['In progress'],'In progress':['Submitted'],'Submitted':['Accepted','Rework','Rejected'],'Rework':['In progress'],'Accepted':[],'Rejected':[]};
export function initialWorkflow(){
  const workItems=[
    {id:'WORK-001',project:'P01',title:'Home routines · recording batch 014',owner:'FO-001',status:'Assigned',output:''},
    {id:'WORK-002',project:'P02',title:'Retail interactions · recording batch 021',owner:'FO-017',status:'Assigned',output:''},
    {id:'WORK-003',project:'P03',title:'Workshop assembly · recording batch 008',owner:'FO-035',status:'Assigned',output:''}
  ];
  return {operatorName:'Demo operations manager',workItems,workflowEvents:workItems.map((item,i)=>({id:i+1,time:'2026-10-28T14:00:00.000Z',actor:'Demo setup',entityType:'work',entityId:item.id,project:item.project,action:'Work assigned',note:'Simulated starting record. No earlier work history is claimed.',before:null,after:{...item},source:'seed'}))};
}
const text=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
const snapshot=v=>v===null||v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length<=12&&Object.entries(v).every(([k,value])=>!['__proto__','constructor','prototype'].includes(k)&&k.length<=40&&(value===null||typeof value==='boolean'||typeof value==='number'&&Number.isFinite(value)||typeof value==='string'&&value.length<=1000));
export function validateWorkflow(input,workers){
  // Previous v2 browser saves predate structured tracking and migrate explicitly.
  if(input.workItems===undefined&&input.workflowEvents===undefined)return initialWorkflow();
  if(!text(input.operatorName,80)||!Array.isArray(input.workItems)||input.workItems.length>1000||!Array.isArray(input.workflowEvents)||input.workflowEvents.length>5000)throw Error('Invalid workflow workspace.');
  const ids=new Set(),workItems=input.workItems.map(w=>{
    if(!w||!/^WORK-\d{3,6}$/.test(w.id)||ids.has(w.id)||!['P01','P02','P03'].includes(w.project)||!text(w.title,160)||!workers.some(worker=>worker.id===w.owner&&worker.qualified.includes(w.project))||!stages.includes(w.status)||typeof w.output!=='string'||w.output.length>500)throw Error('Invalid work item.');
    ids.add(w.id);return {id:w.id,project:w.project,title:w.title,owner:w.owner,status:w.status,output:w.output};
  });
  let previousId=0;const latest=new Map();
  const workflowEvents=input.workflowEvents.map(e=>{
    if(!e||!Number.isSafeInteger(e.id)||e.id<=previousId||!text(e.time,40)||!Number.isFinite(Date.parse(e.time))||!text(e.actor,80)||!['work','worker','quality','incident','scenario','workspace'].includes(e.entityType)||!text(e.entityId,80)||!['P01','P02','P03',null].includes(e.project)||!text(e.action,160)||!text(e.note,1000)||!['seed','user','migration'].includes(e.source)||!snapshot(e.before)||!snapshot(e.after))throw Error('Invalid workflow event.');
    const key=e.entityType+':'+e.entityId;
    if(latest.has(key)&&JSON.stringify(latest.get(key))!==JSON.stringify(e.before))throw Error('Workflow history contains a broken step sequence.');
    if(e.entityType==='work'&&!ids.has(e.entityId))throw Error('Workflow event refers to a missing work item.');
    previousId=e.id;latest.set(key,e.after);
    return {id:e.id,time:new Date(e.time).toISOString(),actor:e.actor,entityType:e.entityType,entityId:e.entityId,project:e.project,action:e.action,note:e.note,before:e.before===null?null:{...e.before},after:e.after===null?null:{...e.after},source:e.source};
  });
  for(const w of workItems)if(JSON.stringify(latest.get('work:'+w.id))!==JSON.stringify(w))throw Error('Work item does not match its workflow history.');
  return {operatorName:input.operatorName.trim(),workItems,workflowEvents};
}
function event(s,type,id,project,action,note,before,after){
  if(s.workflowEvents.length>=5000)throw Error('Workspace history is full. Export your workspace before beginning a new scenario.');
  s.workflowEvents.push({id:(s.workflowEvents.at(-1)?.id||0)+1,time:new Date().toISOString(),actor:s.operatorName,entityType:type,entityId:id,project,action,note:note||'Manager action in the simulated workspace.',before,after,source:'user'});
}
export function advanceWork(s,id,next,note,output){
  const w=s.workItems.find(w=>w.id===id);if(!w||!transitions[w.status].includes(next))throw Error('This workflow step is not allowed.');
  if(!text(note,1000))throw Error('Describe the work performed or the review decision.');
  if(typeof output!=='string'||output.length>500)throw Error('Output reference must be 500 characters or less.');
  if(next==='Submitted'&&!output.trim())throw Error('Add an output reference before submitting work.');
  const before={...w};w.status=next;w.output=output.trim();
  event(s,'work',w.id,w.project,`${before.status} → ${next}`,note.trim(),before,{...w});
}
export function createWork(s,{title,project,owner},note){
  if(s.workItems.length>=1000||!text(title,160))throw Error('Enter a work title of 1–160 characters.');
  const worker=s.workers.find(w=>w.id===owner);
  if(!['P01','P02','P03'].includes(project)||!worker||!worker.qualified.includes(project))throw Error('Choose a qualified worker for the project.');
  if(!text(note,1000))throw Error('Describe the assignment or expected deliverable.');
  const next=Math.max(0,...s.workItems.map(w=>Number(w.id.slice(5))))+1;
  const w={id:'WORK-'+String(next).padStart(3,'0'),project,title:title.trim(),owner,status:'Assigned',output:''};
  event(s,'work',w.id,w.project,'Work assigned',note.trim(),null,{...w});s.workItems.push(w);return w.id;
}
export function trackOperationalChanges(s,before){
  for(const w of s.workers){const old=before.workers.find(b=>b.id===w.id);if(w.project!==old.project||w.status!==old.status)event(s,'worker',w.id,w.project,'Worker assignment changed','Qualified reserve assigned to the shared four-hour window.',{project:old.project,status:old.status},{project:w.project,status:w.status});}
  for(const p of ['P01','P02','P03'])if(s.extraQA[p]!==before.extraQA[p])event(s,'quality',p,p,'QA reserve changed','Reserve allocation changes review capacity and the modeled direct cost.',{unitsPerHour:before.extraQA[p]},{unitsPerHour:s.extraQA[p]});
  for(const i of s.incidents){const old=before.incidents.find(b=>b.id===i.id);if(i.status!==old.status)event(s,'incident',i.id,i.project,'Incident status changed',i.title,{status:old.status,owner:old.owner},{status:i.status,owner:i.owner});}
  if(s.outage!==before.outage)event(s,'scenario','connectivity','P01','Connectivity stress changed','35% collection-capacity stress; this does not change historical accepted work.',{outage:before.outage},{outage:s.outage});
}

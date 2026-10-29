import {recordEvent} from './workflow.mjs';
export const repairReasons=['Client unavailable','Client requested another time','No access to property','Parts or materials delayed','Technician unavailable','Previous job overran','Unsafe conditions or weather','Repair scope changed','Other'];
export const technicians=[{id:'TECH-01',name:'Alex Morgan'},{id:'TECH-02',name:'Sam Rivera'},{id:'TECH-03',name:'Jordan Lee'}];
export const REPAIR_TIMEZONE='America/Toronto';
export function initialRepairs(){return {repairOrders:[
 {id:'REP-001',clientId:'CLIENT-01',client:'Avery Laurent',product:'Washing machine',issue:'Drain pump diagnosis and repair',technician:'TECH-01',scheduledAt:'2026-10-30T09:00',durationMinutes:90,status:'Scheduled',confirmation:'Confirmed'},
 {id:'REP-002',clientId:'CLIENT-02',client:'Morgan Chen',product:'Electric oven',issue:'Heating element inspection',technician:'TECH-02',scheduledAt:'2026-10-30T11:00',durationMinutes:60,status:'Scheduled',confirmation:'Confirmed'},
 {id:'REP-003',clientId:'CLIENT-03',client:'Taylor Roy',product:'Dishwasher',issue:'Water inlet and leak diagnosis',technician:'TECH-01',scheduledAt:'2026-10-30T13:30',durationMinutes:90,status:'Scheduled',confirmation:'Pending'}
 ],repairHistory:[],issueCases:[],issueHistory:[]};}
export function validAppointment(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))return false;
 const d=new Date(value+'Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,16)===value&&Number.isFinite(appointmentEpoch(value));
}
function torontoNow(date){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:REPAIR_TIMEZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);const get=k=>parts.find(p=>p.type===k).value;return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;}
export function appointmentEpoch(value){
 const nominal=Date.parse(value+'Z');if(!Number.isFinite(nominal))return NaN;
 const candidates=[4,5].map(offset=>nominal+offset*3600000).filter(t=>torontoNow(new Date(t))===value);
 return candidates.length===1?candidates[0]:NaN;
}
export function scheduleSnapshot(r){return {scheduledAt:r.scheduledAt,durationMinutes:r.durationMinutes,technician:r.technician,status:r.status,confirmation:r.confirmation};}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const text=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
export function rescheduleRepair(s,id,{scheduledAt,technician,reason,requestedBy,note,confirmed},now=new Date()){
 const order=s.repairOrders.find(r=>r.id===id);if(!order)throw Error('Repair order not found.');
 if(!validAppointment(scheduledAt))throw Error('Enter a valid appointment date and time.');
 if(scheduledAt<=torontoNow(now))throw Error('The revised appointment must be in the future (Toronto time).');
 if(!technicians.some(t=>t.id===technician))throw Error('Choose a valid technician.');
 if(scheduledAt===order.scheduledAt&&technician===order.technician)throw Error('Choose a different appointment or technician.');
 if(!repairReasons.includes(reason)||!['Client','Technician','Dispatcher'].includes(requestedBy))throw Error('Select a reason and who requested the change.');
 if(!text(note,1000))throw Error('Add notes describing the request and any follow-up.');
 if(typeof confirmed!=='boolean')throw Error('Invalid confirmation status.');
 if(s.repairHistory.length>=3000||s.workflowEvents.length>=5000)throw Error('History is full. Export the workspace before continuing.');
 const start=appointmentEpoch(scheduledAt),end=start+order.durationMinutes*60000;
 for(const other of s.repairOrders){if(other.id===id||other.technician!==technician)continue;const a=appointmentEpoch(other.scheduledAt),b=a+other.durationMinutes*60000;if(start<b&&end>a)throw Error('This technician already has a repair appointment in that time window.');}
 const before=scheduleSnapshot(order),after={...before,scheduledAt,technician,confirmation:confirmed?'Confirmed':'Pending'};
 const record={id:(s.repairHistory.at(-1)?.id||0)+1,repairId:id,time:now.toISOString(),actor:s.operatorName,requestedBy,reason,note:note.trim(),before,after};
 recordEvent(s,'repair',id,null,'Repair appointment rescheduled',`${requestedBy} request · ${reason} · ${note.trim()}`.slice(0,1000),before,after,now);
 Object.assign(order,after);s.repairHistory.push(record);
}
export function validateRepairs(input){
 const clean=initialRepairs();
 if(input.repairOrders===undefined&&input.repairHistory===undefined)return clean;
 if(!Array.isArray(input.repairOrders)||input.repairOrders.length!==clean.repairOrders.length||!Array.isArray(input.repairHistory)||input.repairHistory.length>3000)throw Error('Invalid repair records.');
 const ids=new Set();
 const validSnapshot=v=>v&&validAppointment(v.scheduledAt)&&Number.isInteger(v.durationMinutes)&&v.durationMinutes>=30&&v.durationMinutes<=480&&technicians.some(t=>t.id===v.technician)&&v.status==='Scheduled'&&['Confirmed','Pending'].includes(v.confirmation)&&Object.keys(v).length===5;
 for(const order of input.repairOrders){const base=clean.repairOrders.find(r=>r.id===order?.id);if(!base||ids.has(order.id)||(order.clientId!==undefined&&order.clientId!==base.clientId)||['client','product','issue','durationMinutes'].some(k=>order[k]!==base[k])||!validSnapshot(scheduleSnapshot(order)))throw Error('Invalid repair order.');ids.add(order.id);Object.assign(base,scheduleSnapshot(order));}
 let previousId=0;const replay=new Map(initialRepairs().repairOrders.map(r=>[r.id,scheduleSnapshot(r)]));
 clean.repairHistory=input.repairHistory.map(e=>{
  if(!e||!Number.isSafeInteger(e.id)||e.id<=previousId||!ids.has(e.repairId)||!text(e.time,40)||!Number.isFinite(Date.parse(e.time))||!text(e.actor,80)||!['Client','Technician','Dispatcher'].includes(e.requestedBy)||!repairReasons.includes(e.reason)||!text(e.note,1000)||!validSnapshot(e.before)||!validSnapshot(e.after)||!same(replay.get(e.repairId),e.before))throw Error('Invalid or broken repair appointment history.');
  previousId=e.id;replay.set(e.repairId,e.after);return {id:e.id,repairId:e.repairId,time:new Date(e.time).toISOString(),actor:e.actor,requestedBy:e.requestedBy,reason:e.reason,note:e.note,before:{...e.before},after:{...e.after}};
 });
 for(const r of clean.repairOrders)if(!same(replay.get(r.id),scheduleSnapshot(r)))throw Error('Repair appointment does not match its history.');
 return clean;
}

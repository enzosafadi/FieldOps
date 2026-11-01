import test from 'node:test';
import assert from 'node:assert/strict';
import {bindSpeechReporting} from '../dist/speech-reporting.mjs';

function fixture(supported=true){
 const ids=['speech-start','speech-stop','speech-language','speech-draft','speech-status','speech-insert','speech-clear','speech-target','issue-work','issue-findings','issue-parts','issue-next','issue-impact-note'];
 const nodes=Object.fromEntries(ids.map(id=>[id,{value:'',maxLength:id==='speech-draft'?5000:1000,dispatchEvent(){},focus(){this.focused=true;}}]));
 nodes['speech-language'].value='fr-CA';nodes['speech-target'].value='issue-work';
 const env={isSecureContext:true,Event:class{},addEventListener(){},removeEventListener(){}};
 if(supported)env.SpeechRecognition=class{constructor(){env.session=this;}start(){this.onstart?.();}stop(){this.onend?.();}abort(){this.aborted=true;}};
 const root={querySelector:s=>nodes[s.slice(1)],addEventListener(){},removeEventListener(){}};
 const dispose=bindSpeechReporting(root,env);
 const result=(text,index=0)=>{const results=Array(index+1);results[index]=Object.assign([{transcript:text}],{isFinal:true});env.session.onresult?.({resultIndex:index,results});};
 return {nodes,env,dispose,result};
}
test('dictation is staged for review, deduplicated, and appended without replacing existing work',()=>{
 const {nodes:n,env,result}=fixture();n['issue-work'].value='Inspected appliance.';n['speech-start'].onclick();assert.equal(env.session.lang,'fr-CA');
 result('Pompe remplacée.');result('Pompe remplacée.');assert.equal(n['speech-draft'].value,'Pompe remplacée.');assert.equal(n['issue-work'].value,'Inspected appliance.');
 n['speech-stop'].onclick();n['speech-insert'].onclick();assert.equal(n['issue-work'].value,'Inspected appliance.\nPompe remplacée.');assert.equal(n['speech-draft'].value,'');
});
test('overflow does not truncate or insert the transcript',()=>{
 const {nodes:n}=fixture();n['speech-draft'].value='x'.repeat(1001);n['speech-insert'].onclick();assert.equal(n['issue-work'].value,'');assert.equal(n['speech-draft'].value.length,1001);assert.match(n['speech-status'].textContent,/limit/);
});
test('permission failure restores controls and retains received transcript',()=>{
 const {nodes:n,env,result}=fixture();n['speech-start'].onclick();result('Keep these notes');env.session.onerror({error:'not-allowed'});assert.equal(n['speech-start'].disabled,false);assert.equal(n['speech-stop'].disabled,true);assert.equal(n['speech-draft'].value,'Keep these notes');assert.match(n['speech-status'].textContent,/denied/);assert.ok(env.session.aborted);
});
test('disposing aborts microphone and ignores delayed results',()=>{
 const {nodes:n,env,dispose}=fixture();n['speech-start'].onclick();const late=env.session.onresult;dispose();assert.ok(env.session.aborted);late({resultIndex:0,results:[Object.assign([{transcript:'Late'}],{isFinal:true})]});assert.equal(n['speech-draft'].value,'');
});
test('unsupported browsers keep manual preview insertion available',()=>{
 const {nodes:n}=fixture(false);assert.equal(n['speech-start'].disabled,true);n['speech-draft'].value='Typed notes';n['speech-insert'].onclick();assert.equal(n['issue-work'].value,'Typed notes');
});
test('new dictation session can continue the existing preview',()=>{
 const {nodes:n,result}=fixture();n['speech-start'].onclick();result('First');n['speech-stop'].onclick();n['speech-start'].onclick();result('Second');n['speech-stop'].onclick();assert.equal(n['speech-draft'].value,'First Second');
});

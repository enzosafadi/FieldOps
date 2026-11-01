export function speechReportingView(){
 return `<section class="callout speech-reporting" aria-label="Voice-assisted reporting"><h3>Dictate technician notes</h3><p>Speak, review the transcript, then insert it into a report field. Check names, measurements and technical terms before saving.</p><p class="definition">Your browser's speech provider may process audio online. FieldOps does not store audio. Use fictional data in this demo.</p><label for="speech-language">Dictation language</label><select id="speech-language"><option value="en-CA">English · Canada</option><option value="fr-CA">Français · Canada</option></select><div class="actions"><button type="button" class="btn" id="speech-start">Start dictation</button><button type="button" class="btn" id="speech-stop" disabled>Stop dictation</button></div><p id="speech-status" role="status" aria-live="polite">Checking speech availability…</p><label for="speech-draft">Transcript preview · editable</label><textarea id="speech-draft" maxlength="5000" placeholder="Your dictated notes appear here for review."></textarea><label for="speech-target">Insert into</label><select id="speech-target"><option value="issue-work">Work performed</option><option value="issue-findings">Findings / diagnosis</option><option value="issue-parts">Parts required</option><option value="issue-next">Next action</option><option value="issue-impact-note">Client-impact details</option></select><div class="actions"><button type="button" class="btn" id="speech-insert">Insert reviewed text</button><button type="button" class="btn" id="speech-clear">Clear preview</button></div></section>`;
}

export function bindSpeechReporting(root,env=globalThis){
 const get=id=>root.querySelector('#'+id),start=get('speech-start');
 if(!start)return ()=>{};
 const stop=get('speech-stop'),language=get('speech-language'),draft=get('speech-draft'),status=get('speech-status'),insert=get('speech-insert'),clear=get('speech-clear');
 const Recognition=env.SpeechRecognition||env.webkitSpeechRecognition;
 let recognition=null,disposed=false,active=false;
 const say=text=>{status.textContent=text;};
 const controls=busy=>{active=busy;start.disabled=busy||!Recognition||env.isSecureContext===false;stop.disabled=!busy;language.disabled=busy;insert.disabled=busy;clear.disabled=busy;};
 controls(false);
 say(!Recognition?'Speech recognition is unavailable in this browser. Type your report instead.':env.isSecureContext===false?'Dictation requires HTTPS or localhost. You can still type your report.':'Ready. Choose a language and start dictation.');
 start.onclick=()=>{
  if(active||disposed||!Recognition||env.isSecureContext===false)return;
  let session;
  try{session=new Recognition();}catch{say('Speech recognition could not initialize. Type your report or try another browser.');return;}
  recognition=session;session.lang=language.value;session.continuous=true;session.interimResults=false;
  const seen=new Set();let failed=false;
  controls(true);say('Starting microphone…');
  session.onstart=()=>{if(!disposed&&recognition===session)say('Listening. Stop when finished, then review your transcript.');};
  session.onresult=event=>{
   if(disposed||recognition!==session)return;
   let overflow=false;
   for(let i=event.resultIndex;i<event.results.length;i++){
    const result=event.results[i];if(!result.isFinal||seen.has(i))continue;seen.add(i);
    const text=String(result[0]?.transcript||'').trim();if(!text)continue;
    const combined=[draft.value.trim(),text].filter(Boolean).join(' ');
    if(combined.length>draft.maxLength){overflow=true;break;}draft.value=combined;
   }
   if(overflow){failed=true;say('Preview limit reached. Review and insert your notes before continuing.');session.stop();}
  };
  session.onerror=event=>{
   if(disposed||recognition!==session)return;failed=true;
   const messages={'not-allowed':'Microphone permission denied. Allow access in browser settings or type your report.','service-not-allowed':'Speech service is blocked. Type your report or try another browser.','audio-capture':'No microphone is available. Check your device or type your report.','no-speech':'No speech detected. Try again or type your report.','network':'Speech service connection failed. Check your connection or type your report.','language-not-supported':'This speech provider does not support the selected language. Try another language or type.'};
   say(messages[event.error]||'Dictation stopped unexpectedly. Your received text is retained; review it or type your report.');
   recognition=null;session.onresult=null;session.onend=null;try{session.abort();}catch{}controls(false);
  };
  session.onend=()=>{if(disposed||recognition!==session)return;recognition=null;controls(false);if(!failed)say('Dictation stopped. Review and edit the preview before inserting it.');};
  try{session.start();}catch{recognition=null;session.onresult=null;session.onend=null;session.onerror=null;try{session.abort();}catch{}controls(false);say('Could not start dictation. Try again or type your report.');}
 };
 stop.onclick=()=>{if(!recognition)return;stop.disabled=true;say('Finishing dictation…');try{recognition.stop();}catch{recognition.onresult=null;try{recognition.abort();}catch{}recognition=null;controls(false);say('Dictation stopped. Review the received text.');}};
 insert.onclick=()=>{
  if(active)return;
  const allowed=['issue-work','issue-findings','issue-parts','issue-next','issue-impact-note'];
  const target=allowed.includes(get('speech-target').value)?get(get('speech-target').value):null,text=draft.value.trim();
  if(!target||!text){say('Enter or dictate some text in the preview first.');return;}
  const combined=[target.value.trim(),text].filter(Boolean).join('\n');
  if(combined.length>target.maxLength){say('This field would exceed its character limit. Shorten the preview; no text was inserted.');return;}
  target.value=combined;target.dispatchEvent(new env.Event('input',{bubbles:true}));draft.value='';target.focus();say('Text inserted. Review the report and save it using the technician update button.');
 };
 clear.onclick=()=>{if(!active){draft.value='';say('Preview cleared. Existing report fields are unchanged.');}};
 const leave=()=>{if(recognition){recognition.onresult=null;recognition.onend=null;recognition.onerror=null;recognition.onstart=null;try{recognition.abort();}catch{}recognition=null;}};
 const visibility=()=>{if(root.visibilityState==='hidden'){leave();controls(false);say('Dictation stopped because the page was hidden. Review your received text.');}};
 env.addEventListener?.('pagehide',leave);root.addEventListener?.('visibilitychange',visibility);
 return ()=>{disposed=true;leave();env.removeEventListener?.('pagehide',leave);root.removeEventListener?.('visibilitychange',visibility);};
}

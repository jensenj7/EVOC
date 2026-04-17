function checkPin(){
  if(!skidTime){skidTime=format(seconds);skidBtn.innerText=skidTime;}
  else openModal('Edit Skid Exit Time',skidTime,(v)=>{if(v){skidTime=v;skidBtn.innerText=v;}});
 }
 if(type==='north'){
  if(!northTime){northTime=format(seconds);northBtn.innerText=northTime;}
  else openModal('Edit North Intersection',northTime,(v)=>{if(v){northTime=v;northBtn.innerText=v;}});
 }
 if(type==='finish'){
  if(finishTimeValue.innerText==='--:--'){pauseTimer();finishTimeValue.innerText=format(seconds);}
  else openModal('Edit Finish Time',finishTimeValue.innerText,(v)=>{if(v){finishTimeValue.innerText=v;}});
 }
 evaluate();
}

let dnf=false;
function toggleDNF(){dnf=!dnf;dnfBtn.classList.toggle('dnf-active');evaluate();}

function evaluate(){
 if(dnf){status.innerText='NON-QUALIFYING';status.className='status-display nonqual';return;}
 let anyChecked=[...document.querySelectorAll('input[type=checkbox]')].some(c=>c.checked);
 let finish=(finishTimeValue.innerText==='--:--') ? seconds : (()=>{let [m,s]=finishTimeValue.innerText.split(':').map(Number);return m*60+s;})();
 if(anyChecked||finish>145){status.innerText='NON-QUALIFYING';status.className='status-display nonqual';}
 else{status.innerText='QUALIFYING';status.className='status-display qual';}
}

const coneList=[
'Diminishing Lane','Entry Skid Pan','Skid Pan Turn 1 Entry','Skid Pan Turn 1','Skid Pan Turn 2','Skid Pan Turn 3','Exit Skid Pan','Middle Intersection','South Intersection','Slalom','Northeast Straight','Northeast Turn','North Straight','Northwest Turn','North Intersection','360 Turn','West Straight','Southwest Turn','Serpentine','Lane Change'
];
coneList.forEach(name=>{
 let row=document.createElement('div');
 row.className='table-row';
 row.innerHTML=`<div>${name}</div><input type='checkbox' onchange='evaluate()'><input type='checkbox' onchange='evaluate()'><input type='text'>`;
 conesContainer.appendChild(row);
});

function submitRun(){
 const cadet=cadetSelect.value;
 const runTypeEl=[...document.querySelectorAll('[name="runType"]')].find(c=>c.checked);
 const runType=runTypeEl?runTypeEl.parentElement.innerText:'';
 const finish=finishTimeValue.innerText;
 if(!cadet||!runType||(finish==='--:--'&&!dnf)){alert('Missing required fields');return;}
 fetch('https://script.google.com/macros/s/AKfycbyl-NSENy93Qt6uIBSlDC6R3J7w6QCaKRq3sUnLNhM3SiJ9EeGuXR7ONxg9R4qUUMqx/exec',{
 method:'POST',mode:'no-cors',body:JSON.stringify({cadet,runType,finish:dnf?'DNF':finish,status:status.innerText})});
 clearAll();alert('Submitted');
}

function clearAll(){
 seconds=0;updateDisplay();pauseTimer();
 skidTime=null;northTime=null;
 skidBtn.innerText='Skid Exit';northBtn.innerText='North Intersection';
 finishTimeValue.innerText='--:--';
 dnf=false;dnfBtn.classList.remove('dnf-active');
 document.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false);
 document.querySelectorAll('input[type=text]').forEach(t=>t.value='');
 comments.value='';cadetSelect.selectedIndex=0;
 status.innerText='Status';status.className='status-display';
 closeModal();
}

async function loadRoster(){
 const url='https://opensheet.elk.sh/14_VNcxzwP7niT9nJcG1vYVlmR4-_gETqimt-yx0JvfM/Roster';
 let res=await fetch(url); let data=await res.json();
 cadetSelect.innerHTML='<option>Select Cadet</option>';
 data.forEach(r=>{let opt=document.createElement('option');opt.text=r.Name||Object.values(r)[0];cadetSelect.add(opt);});
}

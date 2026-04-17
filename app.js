let dnf=false;

// PIN
function checkPin(){
  if(pinInput.value==="1776"){
    pinScreen.classList.remove("active");
    appScreen.classList.add("active");
    loadRoster();
  }
}

// TIMER
let seconds=0, timer=null, running=false;

function startTimer(){
  if(!running){
    running=true;
    timer=setInterval(()=>{
      seconds++;
      updateDisplay();
      evaluate();
    },1000);
  }
}

function pauseTimer(){ clearInterval(timer); running=false; }

function endTimer(){
  pauseTimer();
  finishTimeValue.innerText=format(seconds);
  evaluate();
}

function updateDisplay(){
  let m=String(Math.floor(seconds/60)).padStart(2,'0');
  let s=String(seconds%60).padStart(2,'0');
  timerDisplay.innerText=`${m}:${s}`;
}

// SPLITS
let skidTime=null, northTime=null;

function handleSplit(type){

  if(type==="finish"){
    if(finishTimeValue.innerText==="--:--"){
      pauseTimer();
      finishTimeValue.innerText=format(seconds);
    } else {
      let val=prompt("Edit Time", finishTimeValue.innerText);
      if(val) finishTimeValue.innerText=val;
    }
  }

  if(type==="skid"){
    if(!skidTime){
      skidTime=format(seconds);
      skidBtn.innerText=skidTime;
    }
  }

  if(type==="north"){
    if(!northTime){
      northTime=format(seconds);
      northBtn.innerText=northTime;
    }
  }

  evaluate();
}

// DNF
function toggleDNF(){
  dnf=!dnf;
  dnfBtn.classList.toggle("active");
  evaluate();
}

// STATUS
function evaluate(){

  if(dnf){
    status.innerText="NON-QUALIFYING";
    status.className="nonqual";
    return;
  }

  let anyChecked=[...document.querySelectorAll("input[type=checkbox]")]
    .some(c=>c.checked);

  let finish=finishTimeValue.innerText;

  if(finish==="--:--"){
    status.innerText="Status";
    return;
  }

  let [m,s]=finish.split(":").map(Number);
  let total=m*60+s;

  if(anyChecked || total>145){
    status.innerText="NON-QUALIFYING";
    status.className="nonqual";
  } else {
    status.innerText="QUALIFYING";
    status.className="qual";
  }
}

// FORMAT
function format(sec){
  let m=Math.floor(sec/60).toString().padStart(2,'0');
  let s=(sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

// TABLE
const coneList=[/* same list */];

coneList.forEach(name=>{
  let row=document.createElement("div");
  row.className="table-row";
  row.innerHTML=`
    <div>${name}</div>
    <input type="checkbox">
    <input type="checkbox">
    <input type="text">
  `;
  conesContainer.appendChild(row);
});

// SUBMIT (WITH VALIDATION + OFFLINE)
function submitRun(){

  const cadet = cadetSelect.value;
  const runType = [...document.querySelectorAll('[name="runType"]')]
    .find(c => c.checked)?.parentElement.innerText;

  const finish = finishTimeValue.innerText;

  if(!cadet || !runType || (finish==="--:--" && !dnf)){
    alert("Missing required fields");
    return;
  }

  const payload = {
    cadet,
    runType,
    finish: dnf ? "DNF" : finish,
    status: status.innerText
  };

  if(!navigator.onLine){
    let stored = JSON.parse(localStorage.getItem("offlineRuns") || "[]");
    stored.push(payload);
    localStorage.setItem("offlineRuns", JSON.stringify(stored));
    alert("Saved offline");
    clearAll();
    return;
  }

  sendToSheets(payload);
}

// SEND
function sendToSheets(data){
  fetch("YOUR_SCRIPT_URL", {
    method:"POST",
    mode:"no-cors",
    body:JSON.stringify(data)
  });

  clearAll();
}

// AUTO RETRY OFFLINE
window.addEventListener("online", ()=>{
  let stored = JSON.parse(localStorage.getItem("offlineRuns") || "[]");
  stored.forEach(sendToSheets);
  localStorage.removeItem("offlineRuns");
});

// CLEAR
function clearAll(){
  seconds=0;
  updateDisplay();
  finishTimeValue.innerText="--:--";
  dnf=false;
  dnfBtn.classList.remove("active");
  status.innerText="Status";
}

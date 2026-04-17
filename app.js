// PIN
function checkPin(){
  const pin = document.getElementById("pinInput").value;

  if(pin === "1776"){
    pinScreen.classList.remove("active");
    appScreen.classList.add("active");
    loadRoster();
  } else {
    alert("Incorrect PIN");
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

function pauseTimer(){
  clearInterval(timer);
  running=false;
}

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

// SPLITS (UPDATED — NO TIMER INTERRUPTION)
let skidTime=null, northTime=null;

function handleSplit(type){

  // SKID
  if(type==="skid"){
    if(!skidTime){
      skidTime=format(seconds);
      skidBtn.innerText=skidTime;
    } else {
      let val=prompt("Edit Skid Exit Time", skidTime);
      if(val){
        skidTime=val;
        skidBtn.innerText=val;
      }
    }
  }

  // NORTH
  if(type==="north"){
    if(!northTime){
      northTime=format(seconds);
      northBtn.innerText=northTime;
    } else {
      let val=prompt("Edit North Intersection Time", northTime);
      if(val){
        northTime=val;
        northBtn.innerText=val;
      }
    }
  }

  // FINISH (ONLY place timer can stop)
  if(type==="finish"){
    if(finishTimeValue.innerText==="--:--"){
      pauseTimer(); // ✅ ONLY intentional stop
      finishTimeValue.innerText=format(seconds);
    } else {
      let val=prompt("Edit Finish Time", finishTimeValue.innerText);
      if(val){
        finishTimeValue.innerText=val;
      }
    }
  }

  evaluate();
}

// DNF
let dnf=false;

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
    status.className="";
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
  return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;
}

// CONES
const coneList=[
"Diminishing Lane","Entry Skid Pan","Skid Pan Turn 1 Entry","Skid Pan Turn 1",
"Skid Pan Turn 2","Skid Pan Turn 3","Exit Skid Pan","Middle Intersection",
"South Intersection","Slalom","Northeast Straight","Northeast Turn",
"North Straight","Northwest Turn","North Intersection","360 Turn",
"West Straight","Southwest Turn","Serpentine","Lane Change"
];

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

// SUBMIT
function submitRun(){

  const cadet = cadetSelect.value;

  const runTypeEl = [...document.querySelectorAll('[name="runType"]')]
    .find(c => c.checked);

  const runType = runTypeEl ? runTypeEl.parentElement.innerText : "";

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

  fetch("https://script.google.com/macros/s/AKfycbyl-NSENy93Qt6uIBSlDC6R3J7w6QCaKRq3sUnLNhM3SiJ9EeGuXR7ONxg9R4qUUMqx/exec", {
    method:"POST",
    mode:"no-cors",
    body:JSON.stringify(payload)
  });

  clearAll();
  alert("Submitted");
}

// CLEAR
function clearAll(){

  seconds=0;
  updateDisplay();
  pauseTimer();

  skidTime=null;
  northTime=null;

  skidBtn.innerText="Skid Exit";
  northBtn.innerText="North Intersection";
  finishTimeValue.innerText="--:--";

  dnf=false;
  dnfBtn.classList.remove("active");

  document.querySelectorAll("input[type=checkbox]").forEach(c=>c.checked=false);
  document.querySelectorAll("input[type=text]").forEach(t=>t.value="");

  document.getElementById("comments").value="";

  cadetSelect.selectedIndex=0;

  status.innerText="Status";
  status.className="";
}

// ROSTER
async function loadRoster(){
  const url="https://opensheet.elk.sh/14_VNcxzwP7niT9nJcG1vYVlmR4-_gETqimt-yx0JvfM/Roster";
  let res=await fetch(url);
  let data=await res.json();

  cadetSelect.innerHTML="<option>Select Cadet</option>";

  data.forEach(r=>{
    let name=r.Name || Object.values(r)[0];
    let opt=document.createElement("option");
    opt.text=name;
    cadetSelect.add(opt);
  });
}

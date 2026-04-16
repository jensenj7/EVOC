function checkPin(){
  if(pinInput.value==="1776"){
    pinScreen.classList.remove("active");
    appScreen.classList.add("active");
    loadRoster();
  }
}

// TIMER
let seconds=0, timer=null, running=false;

function updateDisplay(){
  let m=String(Math.floor(seconds/60)).padStart(2,'0');
  let s=String(seconds%60).padStart(2,'0');
  timerDisplay.innerText=`${m}:${s}`;
}

function startTimer(){
  if(!running){
    running=true;
    timer=setInterval(()=>{
      seconds++;
      updateDisplay();
      updateSplits();
      evaluate();
    },1000);
  }
}

function pauseTimer(){ clearInterval(timer); running=false; }

function endTimer(){
  pauseTimer();
  finishTime.innerText=format(seconds);
  evaluate();
}

function clearAll(){
  seconds=0; updateDisplay(); pauseTimer();

  skidTime=null; northTime=null;

  skidBtn.innerText="Skid Exit";
  northBtn.innerText="North Intersection";
  finishTime.innerText="--:--";

  document.querySelectorAll("input").forEach(i=>{
    if(i.type==="checkbox") i.checked=false;
    if(i.type==="text") i.value="";
  });

  status.innerText="Status";
}

// SPLITS
let skidTime=null, northTime=null;

function updateSplits(){
  if(skidTime===null) skidBtn.dataset.time=format(seconds);
  if(northTime===null) northBtn.dataset.time=format(seconds);
}

function editSplit(type){
  if(type==="skid"){
    if(!skidTime) skidTime=format(seconds);
    let val=prompt("Enter Skid Exit Time", skidTime);
    if(val) skidTime=val;
    skidBtn.innerText=skidTime;
  }

  if(type==="north"){
    if(!northTime) northTime=format(seconds);
    let val=prompt("Enter North Intersection Time", northTime);
    if(val) northTime=val;
    northBtn.innerText=northTime;
  }

  if(type==="finish"){
    let val=prompt("Enter Finish Time", finishTime.innerText);
    if(val) finishTime.innerText=val;
  }

  evaluate();
}

// FORMAT
function format(sec){
  let m=String(Math.floor(sec/60)).padStart(2,'0');
  let s=String(sec%60).padStart(2,'0');
  return `${m}:${s}`;
}

// TABLE
const coneList=[ "Diminishing Lane","Entry Skid Pan","Skid Pan Turn 1 Entry","Skid Pan Turn 1",
"Skid Pan Turn 2","Skid Pan Turn 3","Exit Skid Pan","Middle Intersection",
"South Intersection","Slalom","Northeast Straight","Northeast Turn",
"North Straight","Northwest Turn","North Intersection","360 Turn",
"West Straight","Southwest Turn","Serpentine","Lane Change"];

coneList.forEach(name=>{
  let row=document.createElement("div");
  row.className="table-row";

  row.innerHTML=`
    <div>${name}</div>
    <input type="checkbox" onchange="evaluate()">
    <input type="checkbox" onchange="evaluate()">
    <input type="text">
  `;
  conesContainer.appendChild(row);
});

// EVALUATE (LIVE)
function evaluate(){
  let anyChecked=[...document.querySelectorAll("input[type=checkbox]")].some(c=>c.checked);

  let finish=finishTime.innerText;
  if(finish==="--:--") return;

  let [m,s]=finish.split(":").map(Number);
  let total=m*60+s;

  if(anyChecked || total>146){
    status.innerText="NON-QUALIFYING";
    status.className="nonqual";
  } else {
    status.innerText="QUALIFYING";
    status.className="qual";
  }
}

// ROSTER
async function loadRoster(){
  const url="https://opensheet.elk.sh/14_VNcxzwP7niT9nJcG1vYVlmR4-_gETqimt-yx0JvfM/Roster";
  let res=await fetch(url);
  let data=await res.json();

  data.forEach(r=>{
    let opt=document.createElement("option");
    opt.text=r.Name || Object.values(r)[0];
    cadetSelect.add(opt);
  });
}

// RUN TYPE SINGLE SELECT
document.addEventListener("change",e=>{
  if(e.target.name==="runType"){
    document.querySelectorAll('[name="runType"]').forEach(c=>c.checked=false);
    e.target.checked=true;
  }
});

function submitRun(){
  alert("Next step: connect Google Sheets");
}

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
    },1000);
  }
}

function pauseTimer(){
  clearInterval(timer);
  running=false;
}

function endTimer(){
  pauseTimer();
  finishTime.innerText=format(seconds);
  evaluate();
}

// 🔥 NEW UNIFIED SPLIT HANDLER
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

  // FINISH (NEW BEHAVIOR)
  if(type==="finish"){
    if(finishTime.innerText==="--:--"){
      pauseTimer();
      finishTime.innerText=format(seconds);
    } else {
      let val=prompt("Edit Finish Time", finishTime.innerText);
      if(val){
        finishTime.innerText=val;
      }
    }
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
    <input type="checkbox" onchange="evaluate()">
    <input type="checkbox" onchange="evaluate()">
    <input type="text">
  `;

  conesContainer.appendChild(row);
});

// 🔥 FIXED STATUS LOGIC
function evaluate(){

  let anyChecked=[...document.querySelectorAll("input[type=checkbox]")]
    .some(c=>c.checked);

  let finish=finishTime.innerText;

  let isQualified=true;

  if(anyChecked) isQualified=false;

  if(finish!=="--:--"){
    let [m,s]=finish.split(":").map(Number);
    let total=m*60+s;
    if(total>146) isQualified=false;
  }

  if(finish==="--:--" && !anyChecked){
    status.innerText="Status";
    status.className="";
    return;
  }

  if(isQualified){
    status.innerText="QUALIFYING";
    status.className="qual";
  } else {
    status.innerText="NON-QUALIFYING";
    status.className="nonqual";
  }
}

// WATCH EVERYTHING
document.addEventListener("input", evaluate);
document.addEventListener("change", function(e){
  if(e.target.name==="runType"){
    document.querySelectorAll('[name="runType"]').forEach(c=>c.checked=false);
    e.target.checked=true;
  }
  evaluate();
});

// ROSTER
async function loadRoster(){
  try{
    const url="https://opensheet.elk.sh/14_VNcxzwP7niT9nJcG1vYVlmR4-_gETqimt-yx0JvfM/Roster";
    let res=await fetch(url);
    let data=await res.json();

    cadetSelect.innerHTML="<option value=''>Select Cadet</option>";

    data.forEach(r=>{
      let name=r.Name || r.Cadet || Object.values(r)[0];
      let opt=document.createElement("option");
      opt.value=name;
      opt.text=name;
      cadetSelect.appendChild(opt);
    });

  } catch(err){
    alert("Roster failed to load");
  }
}

// SUBMIT (unchanged)
function submitRun(){
  alert("Already connected to Sheets");
}

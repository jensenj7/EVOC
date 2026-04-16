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
  finishTime.innerText=format(seconds);
  evaluate();
}

function clearAll(){
  seconds=0;
  updateDisplay();
  pauseTimer();

  skidTime=null;
  northTime=null;

  skidBtn.innerText="Skid Exit";
  northBtn.innerText="North Intersection";
  finishTime.innerText="--:--";

  document.querySelectorAll("input").forEach(i=>{
    if(i.type==="checkbox") i.checked=false;
    if(i.type==="text") i.value="";
  });

  status.innerText="Status";
  status.className="";
}

// SPLITS
let skidTime=null;
let northTime=null;

function editSplit(type){

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

  if(type==="finish"){
    let val=prompt("Edit Finish Time", finishTime.innerText);
    if(val){
      finishTime.innerText=val;
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
    <input type="checkbox">
    <input type="checkbox">
    <input type="text">
  `;

  conesContainer.appendChild(row);
});

// LIVE STATUS
function evaluate(){

  let anyChecked=[...document.querySelectorAll("input[type=checkbox]")]
    .some(c=>c.checked);

  let finish=finishTime.innerText;

  if(finish==="--:--"){
    if(anyChecked){
      status.innerText="NON-QUALIFYING";
      status.className="nonqual";
    } else {
      status.innerText="Status";
      status.className="";
    }
    return;
  }

  let parts=finish.split(":");
  if(parts.length!==2) return;

  let m=parseInt(parts[0]);
  let s=parseInt(parts[1]);

  if(isNaN(m)||isNaN(s)) return;

  let total=m*60+s;

  if(anyChecked || total>146){
    status.innerText="NON-QUALIFYING";
    status.className="nonqual";
  } else {
    status.innerText="QUALIFYING";
    status.className="qual";
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

// ROSTER (FIXED)
async function loadRoster(){
  try {
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
    console.error(err);
    alert("Roster failed to load");
  }
}

// SUBMIT (WORKING)
function submitRun(){

  const cadet = cadetSelect.value;

  const runType = [...document.querySelectorAll('[name="runType"]')]
    .find(c => c.checked)?.parentElement.innerText || "";

  const skid = skidTime || "";
  const north = northTime || "";
  const finish = finishTime.innerText;
  const statusVal = status.innerText;
  const comments = document.getElementById("comments").value;

  let coneCount = [...document.querySelectorAll("input[type=checkbox]")]
    .filter(c => c.checked).length;

  const payload = {
    cadet,
    runType,
    skid,
    north,
    finish,
    cones: coneCount,
    status: statusVal,
    comments
  };

  fetch("https://script.google.com/macros/s/AKfycbyl-NSENy93Qt6uIBSlDC6R3J7w6QCaKRq3sUnLNhM3SiJ9EeGuXR7ONxg9R4qUUMqx/exec", {
    method:"POST",
    mode:"no-cors",
    body:JSON.stringify(payload),
    headers:{
      "Content-Type":"application/json"
    }
  });

  alert("Submitted");
}

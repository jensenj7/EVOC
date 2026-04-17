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
  finishTimeValue.innerText=format(seconds);
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
  finishTimeValue.innerText="--:--";

  document.querySelectorAll("input").forEach(i=>{
    if(i.type==="checkbox") i.checked=false;
    if(i.type==="text") i.value="";
  });

  status.innerText="Status";
  status.className="";
}

// SPLITS
let skidTime=null, northTime=null;

function handleSplit(type){

  if(type==="skid"){
    if(!skidTime){
      skidTime=format(seconds);
      skidBtn.innerText=skidTime;
    } else {
      let val=prompt("Edit Skid Time", skidTime);
      if(val){ skidTime=val; skidBtn.innerText=val; }
    }
  }

  if(type==="north"){
    if(!northTime){
      northTime=format(seconds);
      northBtn.innerText=northTime;
    } else {
      let val=prompt("Edit North Time", northTime);
      if(val){ northTime=val; northBtn.innerText=val; }
    }
  }

  if(type==="finish"){
    if(finishTimeValue.innerText==="--:--"){
      pauseTimer();
      finishTimeValue.innerText=format(seconds);
    } else {
      let val=prompt("Edit Finish Time", finishTimeValue.innerText);
      if(val) finishTimeValue.innerText=val;
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

// 🔥 FIXED STATUS (THIS WILL WORK)
function evaluate(){

  let anyChecked=[...document.querySelectorAll("input[type=checkbox]")]
    .some(c=>c.checked);

  let finish = finishTimeValue.innerText.trim();

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

  let parts = finish.split(":");
  if(parts.length !== 2) return;

  let m = parseInt(parts[0]);
  let s = parseInt(parts[1]);

  if(isNaN(m) || isNaN(s)) return;

  let total = m*60 + s;

  if(anyChecked || total > 145){
    status.innerText="NON-QUALIFYING";
    status.className="nonqual";
  } else {
    status.innerText="QUALIFYING";
    status.className="qual";
  }
}

// WATCH
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

    cadetSelect.innerHTML="<option>Select Cadet</option>";

    data.forEach(r=>{
      let name=r.Name || Object.values(r)[0];
      let opt=document.createElement("option");
      opt.value=name;
      opt.text=name;
      cadetSelect.appendChild(opt);
    });

  } catch{
    alert("Roster failed");
  }
}

// ✅ RESTORED SUBMIT
function submitRun(){

  const payload = {
    cadet: cadetSelect.value,
    runType: [...document.querySelectorAll('[name="runType"]')]
      .find(c => c.checked)?.parentElement.innerText || "",
    skid: skidTime || "",
    north: northTime || "",
    finish: finishTimeValue.innerText,
    cones: [...document.querySelectorAll("input[type=checkbox]")]
      .filter(c => c.checked).length,
    status: status.innerText,
    comments: document.getElementById("comments").value
  };

  fetch("https://script.google.com/macros/s/AKfycbyl-NSENy93Qt6uIBSlDC6R3J7w6QCaKRq3sUnLNhM3SiJ9EeGuXR7ONxg9R4qUUMqx/exec", {
    method:"POST",
    mode:"no-cors",
    body:JSON.stringify(payload),
    headers:{ "Content-Type":"application/json" }
  });

  alert("Submitted");
}

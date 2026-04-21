// PIN
const APP_PIN = "1776";
const RUN_QUEUE_KEY = "evocRunQueue";

function checkPin(){
  const pin = document.getElementById("pinInput").value.trim();

  if(pin===APP_PIN){
    pinScreen.classList.remove("active");
    appScreen.classList.add("active");
    evaluate();
    loadRoster();
  }else{
    alert("Incorrect PIN");
  }
}

// TIMER
let seconds=0;
let timer=null;
let running=false;

function handleRunTypeSelection(selected){
 document
 .querySelectorAll('input[name="runType"]')
 .forEach(option=>{
   if(option!==selected){
     option.checked=false;
   }
 });
}

function startTimer(){
 if(!running){
   running=true;
   pauseBtn.innerText="Pause";

   timer=setInterval(()=>{
      seconds++;
      updateDisplay();
      evaluate(); // live qualification evaluation
   },1000);
 }
}

function pauseTimer(){
 clearInterval(timer);
 running=false;
}

function togglePauseResume(){
 if(running){
   pauseTimer();
   pauseBtn.innerText="Resume";
 }else{
   startTimer();
 }
}

function endTimer(){
 pauseTimer();
 pauseBtn.innerText="Resume";
 finishTimeValue.innerText=format(seconds);
 evaluate();
}

function updateDisplay(){
 let m=String(Math.floor(seconds/60)).padStart(2,'0');
 let s=String(seconds%60).padStart(2,'0');

 timerDisplay.innerText=`${m}:${s}`;
}

// SPLITS
let skidTime=null;
let northTime=null;

/* NON-BLOCKING EDITOR */
function editSplit(currentValue,title,callback){

 let value=window.open(
   "",
   "editBox",
   "width=320,height=220"
 );

 value.document.write(`
   <html>
   <body style="font-family:Arial;padding:20px;">
   <h3>${title}</h3>

   <input
      id='newVal'
      value='${currentValue}'
      style='font-size:24px;width:120px;'>

   <br><br>

   <button onclick="
      window.opener.receiveSplitEdit(
        document.getElementById('newVal').value
      );
      window.close();
   ">
   Save
   </button>

   </body>
   </html>
 `);

 window.receiveSplitEdit=function(newVal){
    if(callback) callback(newVal);
 };
}

function handleSplit(type){

 if(type==="skid"){

   if(!skidTime){
      skidTime=format(seconds);
      skidBtn.innerText=skidTime;
   }else{

      editSplit(
        skidTime,
        "Edit Skid Exit Time",
        function(val){
          if(val){
            skidTime=val;
            skidBtn.innerText=val;
            evaluate();
          }
        }
      );
   }
 }

 if(type==="north"){

   if(!northTime){
      northTime=format(seconds);
      northBtn.innerText=northTime;
   }else{

      editSplit(
        northTime,
        "Edit North Intersection",
        function(val){
          if(val){
            northTime=val;
            northBtn.innerText=val;
            evaluate();
          }
        }
      );
   }
 }

 if(type==="finish"){

   if(finishTimeValue.innerText==="--:--"){
      pauseTimer();
      finishTimeValue.innerText=format(seconds);

   }else{

      editSplit(
        finishTimeValue.innerText,
        "Edit Finish Time",
        function(val){
          if(val){
            finishTimeValue.innerText=val;
            evaluate();
          }
        }
      );
   }
 }

 evaluate();
}

// DNF
let dnf=false;

function toggleDNF(){

 dnf=!dnf;

 dnfBtn.classList.toggle("dnf-active");

 evaluate();
}

// STATUS
function evaluate(){
 const statusEl=document.getElementById("status");

 if(dnf){
   statusEl.innerText="Non-Qualifying";
   statusEl.className="status-display nonqual";
   return;
 }

 const coneChecks=[
 ...document.querySelectorAll(".cone-checkbox"),
 ...document.querySelectorAll('#conesContainer input[type="checkbox"]')
 ];

 let anyChecked=
 coneChecks.some(c=>c.checked);

 let finish;

 if(finishTimeValue.innerText==="--:--"){
    finish=seconds; // use live running timer
 }else{
    let [m,s]=finishTimeValue.innerText.split(":").map(Number);
    finish=m*60+s;
 }

 if(anyChecked || finish>145){

    statusEl.innerText="Non-Qualifying";
    statusEl.className="status-display nonqual";

 }else{

    statusEl.innerText="Qualifying";
    statusEl.className="status-display qual";
 }
}

// FORMAT
function format(sec){

 return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;

}

// CONES
const coneList=[
"Diminishing Lane","Entry Skid Pan","Skid Pan Turn 1 Entry",
"Skid Pan Turn 1","Skid Pan Turn 2","Skid Pan Turn 3",
"Exit Skid Pan","Middle Intersection","South Intersection",
"Slalom","Northeast Straight","Northeast Turn",
"North Straight","Northwest Turn","North Intersection",
"360 Turn","West Straight","Southwest Turn",
"Serpentine","Lane Change"
];

coneList.forEach(name=>{

 let row=document.createElement("div");

 row.className="table-row";

 row.innerHTML=`
 <div>${name}</div>
 <input type="checkbox" class="cone-checkbox" onchange="evaluate()">
 <input type="checkbox" class="cone-checkbox" onchange="evaluate()">
 <input type="text">
 `;

 conesContainer.appendChild(row);

});

conesContainer.addEventListener("change",function(e){
 if(e.target.matches('input[type="checkbox"]')){
   evaluate();
 }
});

// SUBMIT
function submitRun(){

 const cadet=cadetSelect.value;

 const selectedRunTypes=
 [...document.querySelectorAll('input[name="runType"]:checked')];

 const runType=
 selectedRunTypes.length===1
 ? selectedRunTypes[0].parentElement.innerText
 : "";

 const finish=finishTimeValue.innerText;

 if(!cadet || selectedRunTypes.length!==1 || !runType || (finish==="--:--" && !dnf)){
    alert("Missing required fields");
    return;
 }

 const payload={
   cadet,
   runType,
   finish: dnf ? "DNF" : finish,
   status: document.getElementById("status").innerText
 };

 queueRun(payload);
 flushQueuedRuns();

 clearAll();

 alert("Run saved. It will sync automatically.");
}

// CLEAR
function clearAll(){

 seconds=0;

 updateDisplay();

 pauseTimer();
 pauseBtn.innerText="Pause";

 skidTime=null;
 northTime=null;

 skidBtn.innerText="Skid Exit";
 northBtn.innerText="North Intersection";

 finishTimeValue.innerText="--:--";

 dnf=false;

 dnfBtn.classList.remove("dnf-active");

 document.querySelectorAll(
 "input[type=checkbox]"
 ).forEach(c=>c.checked=false);

 document.querySelectorAll(
 "input[type=text]"
 ).forEach(t=>t.value="");

 document.getElementById(
 "comments"
 ).value="";

 cadetSelect.selectedIndex=0;

 evaluate();
}

evaluate();

function getQueuedRuns(){
 try{
   return JSON.parse(localStorage.getItem(RUN_QUEUE_KEY) || "[]");
 }catch{
   return [];
 }
}

function setQueuedRuns(queue){
 localStorage.setItem(RUN_QUEUE_KEY,JSON.stringify(queue));
 updateSyncStatus();
}

function updateSyncStatus(){
 const syncStatus=document.getElementById("syncStatus");
 if(!syncStatus) return;

 const queued=getQueuedRuns().length;

 if(queued===0){
   syncStatus.innerText="All runs synced";
   return;
 }

 if(navigator.onLine){
   syncStatus.innerText=`${queued} run(s) pending sync`;
 }else{
   syncStatus.innerText=`Offline: ${queued} run(s) pending sync`;
 }
}

function queueRun(payload){
 const queue=getQueuedRuns();
 queue.push({
   payload,
   queuedAt:new Date().toISOString()
 });
 setQueuedRuns(queue);
}

async function postRun(payload){
 return fetch(
 "https://script.google.com/macros/s/AKfycbyl-NSENy93Qt6uIBSlDC6R3J7w6QCaKRq3sUnLNhM3SiJ9EeGuXR7ONxg9R4qUUMqx/exec",
 {
   method:"POST",
   mode:"no-cors",
   body:JSON.stringify(payload)
 });
}

let syncing=false;

async function flushQueuedRuns(){
 if(syncing) return;
 if(!navigator.onLine){
   updateSyncStatus();
   return;
 }

 syncing=true;

 try{
   let queue=getQueuedRuns();

   while(queue.length){
     const run=queue[0];

     try{
       await postRun(run.payload);
       queue.shift();
       setQueuedRuns(queue);
     }catch{
       break;
     }
   }
 }finally{
   syncing=false;
   updateSyncStatus();
 }
}

// ROSTER
async function loadRoster(){

 const url=
 "https://opensheet.elk.sh/14_VNcxzwP7niT9nJcG1vYVlmR4-_gETqimt-yx0JvfM/Roster";

 let res=await fetch(url);

 let data=await res.json();

 cadetSelect.innerHTML=
 "<option>Select Cadet</option>";

 data.forEach(r=>{

   let name=
   r.Name || Object.values(r)[0];

   let opt=
   document.createElement("option");

   opt.text=name;

   cadetSelect.add(opt);

 });

}

window.addEventListener("online",flushQueuedRuns);
window.addEventListener("offline",updateSyncStatus);
setInterval(flushQueuedRuns,15000);
updateSyncStatus();

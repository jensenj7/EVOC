// PIN
const APP_PIN = "1776";
const RUN_QUEUE_KEY = "evocRunQueue";
const ROAD_COURSE_PAGE = "road-course";
const AA_PAGE = "aa";

function switchPage(page){
  const roadCoursePage=document.getElementById("roadCoursePage");
  const aaPage=document.getElementById("aaPage");

  if(page===AA_PAGE){
    roadCoursePage.classList.remove("active-page");
    aaPage.classList.add("active-page");
  }else{
    aaPage.classList.remove("active-page");
    roadCoursePage.classList.add("active-page");
  }
}

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

function handleAAResultSelection(selected){
 document
 .querySelectorAll('input[name="aaResult"]')
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

const aaConeLocations=[
"Entry","Lane Change","Exit"
];

const aaObservationOptions=[
"Entry speed too slow",
"Did not maintain speed throughout course",
"Exit speed too slow",
"Applied brakes",
"Did not shuffle steer",
"Did not get to the outside",
"Went the wrong direction",
"Missed exit gate"
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

aaConeLocations.forEach(name=>{
 let row=document.createElement("div");
 row.className="aa-table-row";

 row.innerHTML=`
 <div>${name}</div>
 <input type="checkbox" class="aa-cone-checkbox" data-location="${name}" data-side="inside">
 <input type="checkbox" class="aa-cone-checkbox" data-location="${name}" data-side="outside">
 `;

 aaConesContainer.appendChild(row);
});

aaObservationOptions.forEach(text=>{
 const option=document.createElement("label");

 option.innerHTML=`
 <input type="checkbox" class="aa-observation-checkbox" value="${text}">
 ${text}
 `;

 observationsGrid.appendChild(option);
});

conesContainer.addEventListener("change",function(e){
 if(e.target.matches('input[type="checkbox"]')){
   evaluate();
 }
});

function buildConeHitSummary(){
 const hits=[];
 const rows=[...document.querySelectorAll("#conesContainer .table-row")];

 rows.forEach(row=>{
   const name=row.querySelector("div").innerText.trim();
   const inside=row.children[1];
   const outside=row.children[2];
   const gate=(row.children[3].value || "").trim();

   if(inside.checked){
     hits.push(`${name}${gate ? ` ${gate}` : ""} inside`);
   }

   if(outside.checked){
     hits.push(`${name}${gate ? ` ${gate}` : ""} outside`);
   }
 });

 return hits.join(", ");
}

function splitOrBlank(value,defaultLabel){
 return value===defaultLabel ? "" : value;
}

function cleanText(value){
 return String(value || "")
 .replace(/\s+/g," ")
 .trim();
}

function buildAAConeHitSummary(){
 const hits=[];

 document.querySelectorAll(".aa-cone-checkbox").forEach(input=>{
   if(!input.checked) return;
   const location=input.dataset.location || "";
   const side=input.dataset.side || "";
   hits.push(`${location} ${side}`);
 });

 return hits.join(", ");
}

function buildAAObservationsSummary(){
 const selections=
 [...document.querySelectorAll(".aa-observation-checkbox:checked")]
 .map(input=>input.value.trim())
 .filter(Boolean);

 return selections.join(", ");
}

// SUBMIT
function submitRun(){

 const cadet=cleanText(cadetSelect.value);

 const selectedRunTypes=
 [...document.querySelectorAll('input[name="runType"]:checked')];

 const runType=
 selectedRunTypes.length===1
 ? cleanText(selectedRunTypes[0].parentElement.textContent)
 : "";

 const finish=finishTimeValue.innerText;

 if(!cadet || selectedRunTypes.length!==1 || !runType || (finish==="--:--" && !dnf)){
    alert("Missing required fields");
    return;
 }

 const payload={
   cadet: cleanText(cadet),
   runType: cleanText(runType),
   skidExitTime: cleanText(splitOrBlank(skidBtn.innerText,"Skid Exit")),
   northIntersectionTime: cleanText(splitOrBlank(northBtn.innerText,"North Intersection")),
   finalTime: cleanText(dnf ? "DNF" : finish),
   coneHitLocations: cleanText(buildConeHitSummary()),
   result: cleanText(document.getElementById("status").innerText),
   instructorComments: cleanText(document.getElementById("comments").value)
 };

 queueRun(payload);
 flushQueuedRuns();

 clearAll();
}

function submitAARun(){
 const cadet=cleanText(document.getElementById("aaCadetSelect").value);
 const speedIn=cleanText(document.getElementById("speedIn").value);
 const direction=cleanText(document.getElementById("directionSelect").value);
 const speedOut=cleanText(document.getElementById("speedOut").value);
 const conesHit=cleanText(buildAAConeHitSummary());
 const instructorObservations=cleanText(buildAAObservationsSummary());
 const selectedResults=
 [...document.querySelectorAll('input[name="aaResult"]:checked')];
 const result=
 selectedResults.length===1
 ? cleanText(selectedResults[0].parentElement.textContent)
 : "";

 if(!cadet || !speedIn || !direction || !speedOut || !result){
   alert("Missing required AA fields");
   return;
 }

 const payload={
   sheet:"AA",
   timestamp:new Date().toISOString(),
   cadet,
   speedIn,
   direction,
   speedOut,
   conesHit,
   instructorObservations,
   results:result
 };

 queueRun(payload);
 flushQueuedRuns();
 clearAAForm();
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
 '#roadCoursePage input[type=checkbox]'
 ).forEach(c=>c.checked=false);

 document.querySelectorAll(
 '#roadCoursePage input[type=text]'
 ).forEach(t=>t.value="");

 document.getElementById(
 "comments"
 ).value="";

 cadetSelect.selectedIndex=0;

evaluate();
}

function clearAAForm(){
 document.getElementById("aaCadetSelect").selectedIndex=0;
 document.getElementById("speedIn").value="";
 document.getElementById("directionSelect").selectedIndex=0;
 document.getElementById("speedOut").value="";

 document.querySelectorAll(".aa-cone-checkbox").forEach(c=>c.checked=false);
 document.querySelectorAll(".aa-observation-checkbox").forEach(c=>c.checked=false);
 document.querySelectorAll('input[name="aaResult"]').forEach(c=>c.checked=false);
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
 const aaSyncStatus=document.getElementById("aaSyncStatus");
 if(!syncStatus) return;

 const queued=getQueuedRuns().length;

 if(queued===0){
   syncStatus.innerText="All runs synced";
   if(aaSyncStatus) aaSyncStatus.innerText="All runs synced";
   return;
 }

 if(navigator.onLine){
   syncStatus.innerText=`${queued} run(s) pending sync`;
   if(aaSyncStatus) aaSyncStatus.innerText=`${queued} run(s) pending sync`;
 }else{
   syncStatus.innerText=`Offline: ${queued} run(s) pending sync`;
   if(aaSyncStatus) aaSyncStatus.innerText=`Offline: ${queued} run(s) pending sync`;
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
 aaCadetSelect.innerHTML=
 "<option>Select Cadet</option>";

 data.forEach(r=>{

   let name=
   r.Name || Object.values(r)[0];

   let opt=
   document.createElement("option");

   opt.text=name;

   cadetSelect.add(opt);
   aaCadetSelect.add(opt.cloneNode(true));

 });

}

window.addEventListener("online",flushQueuedRuns);
window.addEventListener("offline",updateSyncStatus);
setInterval(flushQueuedRuns,15000);
updateSyncStatus();

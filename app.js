// PIN
const APP_PIN = "1776";
const RUN_QUEUE_KEY = "evocRunQueue";
const ROAD_COURSE_PAGE = "road-course";
const AA_PAGE = "aa";
const BACKING_PAGE = "backing";
const BRAKE_TURN_PAGE = "brake-turn";
const LOLLIPOP_PAGE = "lollipop";
const SLALOM_PAGE = "slalom";

function switchPage(page){
  const pages={
    [ROAD_COURSE_PAGE]:document.getElementById("roadCoursePage"),
    [AA_PAGE]:document.getElementById("aaPage"),
    [BACKING_PAGE]:document.getElementById("backingPage"),
    [BRAKE_TURN_PAGE]:document.getElementById("brakeTurnPage"),
    [LOLLIPOP_PAGE]:document.getElementById("lollipopPage"),
    [SLALOM_PAGE]:document.getElementById("slalomPage")
  };

  Object.values(pages).forEach(el=>{
    if(el) el.classList.remove("active-page");
  });

  const target=pages[page] || pages[ROAD_COURSE_PAGE];
  if(target) target.classList.add("active-page");
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
let backingSeconds=0;
let backingTimer=null;
let backingRunning=false;
let lollipopSeconds=0;
let lollipopTimer=null;
let lollipopRunning=false;

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

function handleBackingObservationSelection(selected){
 document
 .querySelectorAll('input[name="backingObservationMethod"]')
 .forEach(option=>{
   if(option!==selected){
     option.checked=false;
   }
 });
}

function handleBackingResultSelection(selected){
 document
 .querySelectorAll('input[name="backingResult"]')
 .forEach(option=>{
   if(option!==selected){
     option.checked=false;
   }
 });
}

function handleBrakeTurnBrakingSelection(selected){
 document
 .querySelectorAll('input[name="brakeTurnBraking"]')
 .forEach(option=>{
   if(option!==selected){
     option.checked=false;
   }
 });
}

function handleBrakeTurnApexSelection(selected){
 document
 .querySelectorAll('input[name="brakeTurnApex"]')
 .forEach(option=>{
   if(option!==selected){
     option.checked=false;
   }
 });
}

function handleBrakeTurnResultSelection(selected){
 document
 .querySelectorAll('input[name="brakeTurnResult"]')
 .forEach(option=>{
   if(option!==selected){
     option.checked=false;
   }
 });
}

function handleLollipopDirectionSelection(selected){
 document
 .querySelectorAll('input[name="lollipopDirection"]')
 .forEach(option=>{
   if(option!==selected){
     option.checked=false;
   }
 });
}

function handleLollipopResultSelection(selected){
 document
 .querySelectorAll('input[name="lollipopResult"]')
 .forEach(option=>{
   if(option!==selected){
     option.checked=false;
   }
 });
}

function handleSlalomResultSelection(selected){
 document
 .querySelectorAll('input[name="slalomResult"]')
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

function updateBackingDisplay(){
 const display=document.getElementById("backingTimerDisplay");
 if(!display) return;
 let m=String(Math.floor(backingSeconds/60)).padStart(2,'0');
 let s=String(backingSeconds%60).padStart(2,'0');
 display.innerText=`${m}:${s}`;
}

function startBackingTimer(){
 const pauseBtn=document.getElementById("backingPauseBtn");
 if(!pauseBtn) return;

 if(!backingRunning){
   backingRunning=true;
   pauseBtn.innerText="Pause";

   backingTimer=setInterval(()=>{
     backingSeconds++;
     updateBackingDisplay();
   },1000);
 }
}

function pauseBackingTimer(){
 clearInterval(backingTimer);
 backingRunning=false;
}

function toggleBackingPauseResume(){
 const pauseBtn=document.getElementById("backingPauseBtn");
 if(!pauseBtn) return;

 if(backingRunning){
   pauseBackingTimer();
   pauseBtn.innerText="Resume";
 }else{
   startBackingTimer();
 }
}

function endBackingTimer(){
 const pauseBtn=document.getElementById("backingPauseBtn");
 if(!pauseBtn) return;

 pauseBackingTimer();
 pauseBtn.innerText="Resume";
 updateBackingDisplay();
}

function updateLollipopDisplay(){
 const display=document.getElementById("lollipopTimerDisplay");
 if(!display) return;
 let m=String(Math.floor(lollipopSeconds/60)).padStart(2,'0');
 let s=String(lollipopSeconds%60).padStart(2,'0');
 display.innerText=`${m}:${s}`;
}

function startLollipopTimer(){
 const pauseBtn=document.getElementById("lollipopPauseBtn");
 if(!pauseBtn) return;

 if(!lollipopRunning){
   lollipopRunning=true;
   pauseBtn.innerText="Pause";

   lollipopTimer=setInterval(()=>{
     lollipopSeconds++;
     updateLollipopDisplay();
   },1000);
 }
}

function pauseLollipopTimer(){
 clearInterval(lollipopTimer);
 lollipopRunning=false;
}

function toggleLollipopPauseResume(){
 const pauseBtn=document.getElementById("lollipopPauseBtn");
 if(!pauseBtn) return;

 if(lollipopRunning){
   pauseLollipopTimer();
   pauseBtn.innerText="Resume";
 }else{
   startLollipopTimer();
 }
}

function endLollipopTimer(){
 const pauseBtn=document.getElementById("lollipopPauseBtn");
 if(!pauseBtn) return;

 pauseLollipopTimer();
 pauseBtn.innerText="Resume";
 updateLollipopDisplay();
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

function buildBackingConeHitSummary(){
 const hits=
 [...document.querySelectorAll(".backing-cone-checkbox:checked")]
 .map(input=>input.value.trim())
 .filter(Boolean);

 return hits.join(", ");
}

function buildBrakeTurnConeHitSummary(){
 const hits=[];
 const rows=[...document.querySelectorAll(".brake-turn-cone-row")];

 rows.forEach(row=>{
   const location=row.children[0].innerText.trim();
   const inside=row.children[1];
   const outside=row.children[2];
   const count=(row.children[3].value || "").trim();

   if(inside.checked){
     hits.push(`${location}${count ? ` ${count}` : ""} inside`);
   }

   if(outside.checked){
     hits.push(`${location}${count ? ` ${count}` : ""} outside`);
   }
 });

 const offCourse=document.getElementById("brakeTurnOffCourse");
 if(offCourse && offCourse.checked){
   hits.push("Off Course");
 }

 return hits.join(", ");
}

function buildLollipopConeHitSummary(){
 const hits=[];
 const circle=document.querySelector('.lollipop-cone-checkbox[data-location="Circle"]');
 const slalom=document.querySelector('.lollipop-cone-checkbox[data-location="Slalom"]');
 const circleCountInput=document.getElementById("lollipopCircleCount");
 const slalomCountInput=document.getElementById("lollipopSlalomCount");
 const circleCount=cleanText(circleCountInput ? circleCountInput.value : "");
 const slalomCount=cleanText(slalomCountInput ? slalomCountInput.value : "");

 if(circle && circle.checked){
   hits.push(`Circle${circleCount ? ` ${circleCount}` : ""}`);
 }

 if(slalom && slalom.checked){
   hits.push(`Slalom${slalomCount ? ` ${slalomCount}` : ""}`);
 }

 return hits.join(", ");
}

function buildLollipopObservationSummary(){
 const selections=
 [...document.querySelectorAll(".lollipop-observation-checkbox:checked")]
 .map(input=>input.value.trim())
 .filter(Boolean);

 return selections.join(", ");
}

function buildSlalomObservationSummary(){
 const selections=
 [...document.querySelectorAll(".slalom-observation-checkbox:checked")]
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
   sheet:"Road Course",
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
   result
 };

 queueRun(payload);
 flushQueuedRuns();
 clearAAForm();
}

function submitBackingRun(){
 const cadet=cleanText(document.getElementById("backingCadetSelect").value);
 const observationSelections=
 [...document.querySelectorAll('input[name="backingObservationMethod"]:checked')];
 const observationMethod=
 observationSelections.length===1
 ? cleanText(observationSelections[0].parentElement.textContent)
 : "";
 const conesHit=cleanText(buildBackingConeHitSummary());
 const selectedResults=
 [...document.querySelectorAll('input[name="backingResult"]:checked')];
 const result=
 selectedResults.length===1
 ? cleanText(selectedResults[0].parentElement.textContent)
 : "";
 const comments=cleanText(document.getElementById("backingComments").value);
 const finalTime=cleanText(format(backingSeconds));

 if(!cadet || !observationMethod || !result){
   alert("Missing required Backing fields");
   return;
 }

 const payload={
   sheet:"Backing",
   timestamp:new Date().toISOString(),
   cadet,
   observationMethod,
   conesHit,
   totalTime:finalTime,
   result,
   instructorComments:comments
 };

 queueRun(payload);
 flushQueuedRuns();
 clearBackingForm();
}

function submitBrakeTurnRun(){
 const cadet=cleanText(document.getElementById("brakeTurnCadetSelect").value);
 const entrySpeed=cleanText(document.getElementById("brakeTurnEntrySpeed").value);
 const brakingSelections=
 [...document.querySelectorAll('input[name="brakeTurnBraking"]:checked')];
 const braking=
 brakingSelections.length===1
 ? cleanText(brakingSelections[0].parentElement.textContent)
 : "";
 const apexSelections=
 [...document.querySelectorAll('input[name="brakeTurnApex"]:checked')];
 const apex=
 apexSelections.length===1
 ? cleanText(apexSelections[0].parentElement.textContent)
 : "";
 const conesHit=cleanText(buildBrakeTurnConeHitSummary());
 const resultSelections=
 [...document.querySelectorAll('input[name="brakeTurnResult"]:checked')];
 const result=
 resultSelections.length===1
 ? cleanText(resultSelections[0].parentElement.textContent)
 : "";
 const comments=cleanText(document.getElementById("brakeTurnComments").value);

 if(!cadet || !entrySpeed || !braking || !apex || !result){
   alert("Missing required Brake/Turn fields");
   return;
 }

 const payload={
   sheet:"B&T",
   timestamp:new Date().toISOString(),
   cadet,
   entrySpeed,
   braking,
   apex,
   conesHit,
   result,
   instructorComments:comments
 };

 queueRun(payload);
 flushQueuedRuns();
 clearBrakeTurnForm();
}

function submitLollipopRun(){
 const cadet=cleanText(document.getElementById("lollipopCadetSelect").value);
 const directionSelections=
 [...document.querySelectorAll('input[name="lollipopDirection"]:checked')];
 const direction=
 directionSelections.length===1
 ? cleanText(directionSelections[0].parentElement.textContent)
 : "";
 const conesHit=cleanText(buildLollipopConeHitSummary());
 const instructorObservations=cleanText(buildLollipopObservationSummary());
 const resultSelections=
 [...document.querySelectorAll('input[name="lollipopResult"]:checked')];
 const result=
 resultSelections.length===1
 ? cleanText(resultSelections[0].parentElement.textContent)
 : "";
 const totalTime=cleanText(format(lollipopSeconds));

 if(!cadet || !direction || !result){
   alert("Missing required Lollipop fields");
   return;
 }

 const payload={
   sheet:"Lollipop",
   timestamp:new Date().toISOString(),
   cadet,
   direction,
   conesHit,
   instructorObservations,
   totalTime,
   result
 };

 queueRun(payload);
 flushQueuedRuns();
 clearLollipopForm();
}

function submitSlalomRun(){
 const cadet=cleanText(document.getElementById("slalomCadetSelect").value);
 const speedIn=cleanText(document.getElementById("slalomSpeedIn").value);
 const speedOut=cleanText(document.getElementById("slalomSpeedOut").value);
 const instructorObservations=cleanText(buildSlalomObservationSummary());
 const totalConesHit=cleanText(document.getElementById("slalomTotalConesHit").value);
 const resultSelections=
 [...document.querySelectorAll('input[name="slalomResult"]:checked')];
 const result=
 resultSelections.length===1
 ? cleanText(resultSelections[0].parentElement.textContent)
 : "";

 if(!cadet || !speedIn || !speedOut || !result){
   alert("Missing required Slalom fields");
   return;
 }

 const payload={
   sheet:"Slalom",
   timestamp:new Date().toISOString(),
   cadet,
   speedIn,
   speedOut,
   instructorObservations,
   totalConesHit,
   result
 };

 queueRun(payload);
 flushQueuedRuns();
 clearSlalomForm();
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

function clearBackingForm(){
 const backingCadetSelect=document.getElementById("backingCadetSelect");
 const backingComments=document.getElementById("backingComments");
 const backingPauseBtn=document.getElementById("backingPauseBtn");

 if(backingCadetSelect) backingCadetSelect.selectedIndex=0;
 document.querySelectorAll('input[name="backingObservationMethod"]').forEach(c=>c.checked=false);
 document.querySelectorAll('input[name="backingResult"]').forEach(c=>c.checked=false);
 document.querySelectorAll(".backing-cone-checkbox").forEach(c=>c.checked=false);
 if(backingComments) backingComments.value="";

 backingSeconds=0;
 pauseBackingTimer();
 if(backingPauseBtn) backingPauseBtn.innerText="Pause";
 updateBackingDisplay();
}

function clearBrakeTurnForm(){
 document.getElementById("brakeTurnCadetSelect").selectedIndex=0;
 document.getElementById("brakeTurnEntrySpeed").value="";
 document.querySelectorAll('input[name="brakeTurnBraking"]').forEach(c=>c.checked=false);
 document.querySelectorAll('input[name="brakeTurnApex"]').forEach(c=>c.checked=false);
 document.querySelectorAll('input[name="brakeTurnResult"]').forEach(c=>c.checked=false);
 document.querySelectorAll(".brake-turn-cone-checkbox").forEach(c=>c.checked=false);
 document.querySelectorAll(".brake-turn-cone-count").forEach(c=>c.value="");
 document.getElementById("brakeTurnOffCourse").checked=false;
 document.getElementById("brakeTurnComments").value="";
}

function clearLollipopForm(){
 const lollipopCadetSelect=document.getElementById("lollipopCadetSelect");
 const lollipopPauseBtn=document.getElementById("lollipopPauseBtn");
 const circleCount=document.getElementById("lollipopCircleCount");
 const slalomCount=document.getElementById("lollipopSlalomCount");
 if(lollipopCadetSelect) lollipopCadetSelect.selectedIndex=0;

 document.querySelectorAll('input[name="lollipopDirection"]').forEach(c=>c.checked=false);
 document.querySelectorAll('input[name="lollipopResult"]').forEach(c=>c.checked=false);
 document.querySelectorAll(".lollipop-cone-checkbox").forEach(c=>c.checked=false);
 document.querySelectorAll(".lollipop-observation-checkbox").forEach(c=>c.checked=false);
 if(circleCount) circleCount.value="";
 if(slalomCount) slalomCount.value="";

 lollipopSeconds=0;
 pauseLollipopTimer();
 if(lollipopPauseBtn) lollipopPauseBtn.innerText="Pause";
 updateLollipopDisplay();
}

function clearSlalomForm(){
 const slalomCadetSelect=document.getElementById("slalomCadetSelect");
 const slalomSpeedIn=document.getElementById("slalomSpeedIn");
 const slalomSpeedOut=document.getElementById("slalomSpeedOut");
 const slalomTotalConesHit=document.getElementById("slalomTotalConesHit");

 if(slalomCadetSelect) slalomCadetSelect.selectedIndex=0;
 if(slalomSpeedIn) slalomSpeedIn.value="";
 if(slalomSpeedOut) slalomSpeedOut.value="";
 if(slalomTotalConesHit) slalomTotalConesHit.value="";

 document.querySelectorAll(".slalom-observation-checkbox").forEach(c=>c.checked=false);
 document.querySelectorAll('input[name="slalomResult"]').forEach(c=>c.checked=false);
}

evaluate();
updateBackingDisplay();
updateLollipopDisplay();

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
 const backingSyncStatus=document.getElementById("backingSyncStatus");
 const brakeTurnSyncStatus=document.getElementById("brakeTurnSyncStatus");
 const lollipopSyncStatus=document.getElementById("lollipopSyncStatus");
 const slalomSyncStatus=document.getElementById("slalomSyncStatus");
 if(!syncStatus) return;

 const queued=getQueuedRuns().length;

 if(queued===0){
   syncStatus.innerText="All runs synced";
   if(aaSyncStatus) aaSyncStatus.innerText="All runs synced";
   if(backingSyncStatus) backingSyncStatus.innerText="All runs synced";
   if(brakeTurnSyncStatus) brakeTurnSyncStatus.innerText="All runs synced";
   if(lollipopSyncStatus) lollipopSyncStatus.innerText="All runs synced";
   if(slalomSyncStatus) slalomSyncStatus.innerText="All runs synced";
   return;
 }

 if(navigator.onLine){
   syncStatus.innerText=`${queued} run(s) pending sync`;
   if(aaSyncStatus) aaSyncStatus.innerText=`${queued} run(s) pending sync`;
   if(backingSyncStatus) backingSyncStatus.innerText=`${queued} run(s) pending sync`;
   if(brakeTurnSyncStatus) brakeTurnSyncStatus.innerText=`${queued} run(s) pending sync`;
   if(lollipopSyncStatus) lollipopSyncStatus.innerText=`${queued} run(s) pending sync`;
   if(slalomSyncStatus) slalomSyncStatus.innerText=`${queued} run(s) pending sync`;
 }else{
   syncStatus.innerText=`Offline: ${queued} run(s) pending sync`;
   if(aaSyncStatus) aaSyncStatus.innerText=`Offline: ${queued} run(s) pending sync`;
   if(backingSyncStatus) backingSyncStatus.innerText=`Offline: ${queued} run(s) pending sync`;
   if(brakeTurnSyncStatus) brakeTurnSyncStatus.innerText=`Offline: ${queued} run(s) pending sync`;
   if(lollipopSyncStatus) lollipopSyncStatus.innerText=`Offline: ${queued} run(s) pending sync`;
   if(slalomSyncStatus) slalomSyncStatus.innerText=`Offline: ${queued} run(s) pending sync`;
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

 const cadetSelectEl=document.getElementById("cadetSelect");
 const aaCadetSelectEl=document.getElementById("aaCadetSelect");
 const backingCadetSelectEl=document.getElementById("backingCadetSelect");
 const brakeTurnCadetSelectEl=document.getElementById("brakeTurnCadetSelect");
 const lollipopCadetSelectEl=document.getElementById("lollipopCadetSelect");
 const slalomCadetSelectEl=document.getElementById("slalomCadetSelect");

 [cadetSelectEl,aaCadetSelectEl,backingCadetSelectEl,brakeTurnCadetSelectEl,lollipopCadetSelectEl,slalomCadetSelectEl]
 .forEach(select=>{
   if(select) select.innerHTML="<option>Select Cadet</option>";
 });

 data.forEach(r=>{

   let name=
   r.Name || Object.values(r)[0];

   let opt=
   document.createElement("option");

   opt.text=name;

   if(cadetSelectEl) cadetSelectEl.add(opt);
   if(aaCadetSelectEl) aaCadetSelectEl.add(opt.cloneNode(true));
   if(backingCadetSelectEl) backingCadetSelectEl.add(opt.cloneNode(true));
   if(brakeTurnCadetSelectEl) brakeTurnCadetSelectEl.add(opt.cloneNode(true));
   if(lollipopCadetSelectEl) lollipopCadetSelectEl.add(opt.cloneNode(true));
   if(slalomCadetSelectEl) slalomCadetSelectEl.add(opt.cloneNode(true));

 });

}

window.addEventListener("online",flushQueuedRuns);
window.addEventListener("offline",updateSyncStatus);
setInterval(flushQueuedRuns,15000);
updateSyncStatus();

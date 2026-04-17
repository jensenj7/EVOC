function checkPin(){
  <input type="checkbox">
  <input type="checkbox">
  <input type="text">
 `;

 conesContainer.appendChild(row);
});

function submitRun(){

 const cadet=cadetSelect.value;

 const runTypeEl=[...document.querySelectorAll('[name="runType"]')]
 .find(c=>c.checked);

 const runType=runTypeEl ? runTypeEl.parentElement.innerText : "";

 const finish=finishTimeValue.innerText;

 if(!cadet || !runType || (finish==="--:--" && !dnf)){
   alert("Missing required fields");
   return;
 }

 const payload={
   cadet,
   runType,
   finish: dnf ? "DNF" : finish,
   status: status.innerText
 };

 fetch("https://script.google.com/macros/s/AKfycbyl-NSENy93Qt6uIBSlDC6R3J7w6QCaKRq3sUnLNhM3SiJ9EeGuXR7ONxg9R4qUUMqx/exec",{
   method:"POST",
   mode:"no-cors",
   body:JSON.stringify(payload)
 });

 clearAll();
 alert("Submitted");
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

 dnf=false;
 dnfBtn.classList.remove("active");

 document.querySelectorAll('input[type="checkbox"]').forEach(c=>c.checked=false);
 document.querySelectorAll('input[type="text"]').forEach(t=>t.value="");

 comments.value="";

 cadetSelect.selectedIndex=0;

 status.innerText="Status";
 status.className="";
}

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

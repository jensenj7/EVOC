// 🔐 PIN
function checkPin() {
  if (document.getElementById("pinInput").value === "1776") {
    document.getElementById("pinScreen").classList.remove("active");
    document.getElementById("appScreen").classList.add("active");
    loadRoster();
  }
}

// ⏱️ TIMER
let seconds = 0;
let timer = null;
let running = false;

function updateDisplay() {
  let m = String(Math.floor(seconds / 60)).padStart(2,'0');
  let s = String(seconds % 60).padStart(2,'0');
  document.getElementById("timerDisplay").innerText = `${m}:${s}`;
}

function startTimer() {
  if (!running) {
    running = true;
    timer = setInterval(() => {
      seconds++;
      updateDisplay();
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  running = false;
}

function endTimer() {
  pauseTimer();
  document.getElementById("finishTime").innerText = formatTime(seconds);
  evaluate();
}

function clearAll() {
  seconds = 0;
  updateDisplay();
  pauseTimer();

  document.getElementById("finishTime").innerText = "--:--";
  document.getElementById("skidBtn").innerText = "Skid Exit";
  document.getElementById("northBtn").innerText = "North Intersection";

  document.querySelectorAll("input[type=checkbox]").forEach(c=>c.checked=false);
  document.getElementById("status").innerText = "STATUS: --";
}

// ⏱️ SPLITS
let skidTime = null;
let northTime = null;

function setSplit(type) {
  let time = formatTime(seconds);

  if (type === "skid" && !skidTime) {
    skidTime = time;
    document.getElementById("skidBtn").innerText = time;
  }

  if (type === "north" && !northTime) {
    northTime = time;
    document.getElementById("northBtn").innerText = time;
  }
}

// ✏️ EDIT TIMES
function editTime(field) {
  let val = prompt("Enter time MM:SS");
  if (!val) return;

  if (field === "finish") document.getElementById("finishTime").innerText = val;
}

// ⏱️ FORMAT
function formatTime(sec) {
  let m = String(Math.floor(sec/60)).padStart(2,'0');
  let s = String(sec%60).padStart(2,'0');
  return `${m}:${s}`;
}

// 🚨 CONES
const coneList = [
  "Diminishing Lane","Entry Skid Pan","Turn 1 Entry","Turn 1","Turn 2",
  "Turn 3","Exit Skid Pan","Middle Intersection","South Intersection",
  "Slalom","NE Straight","NE Turn","North Straight","NW Turn",
  "North Intersection","360 Turn","West Straight","SW Turn",
  "Serpentine","Lane Change"
];

const container = document.getElementById("conesContainer");

coneList.forEach(name=>{
  let row = document.createElement("div");
  row.className="row";
  row.innerHTML = `${name}
    <input type="checkbox">
    <input type="checkbox">`;
  container.appendChild(row);
});

// 🧮 EVALUATION
function evaluate() {
  let cones = [...document.querySelectorAll("input[type=checkbox]")].some(c=>c.checked);
  let finish = document.getElementById("finishTime").innerText;

  let [m,s] = finish.split(":").map(Number);
  let total = m*60+s;

  let status = document.getElementById("status");

  if (cones || total > 146) {
    status.innerText = "STATUS: NON-QUALIFYING";
    status.className="status nonqual";
  } else {
    status.innerText = "STATUS: QUALIFYING";
    status.className="status qual";
  }
}

// 📥 ROSTER (Google Sheets)
async function loadRoster() {
  const url = "https://opensheet.elk.sh/14_VNcxzwP7niT9nJcG1vYVlmR4-_gETqimt-yx0JvfM/Roster";
  let res = await fetch(url);
  let data = await res.json();

  let select = document.getElementById("cadetSelect");

  data.forEach(r=>{
    let opt = document.createElement("option");
    opt.text = r.Name || Object.values(r)[0];
    select.add(opt);
  });
}

// 📤 SUBMIT (you will connect Apps Script later)
function submitRun() {
  alert("Submission ready (connect Google Apps Script next)");
}

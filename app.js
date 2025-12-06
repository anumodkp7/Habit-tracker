/*******************************
  LifeOS — JavaScript Core
*******************************/

/* --------- SIMPLE HELPERS --------- */
const $ = (id) => document.getElementById(id);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const today = new Date();
const dateKey = (d) => {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};
const prettyDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

/* --------- LOCAL STORAGE HELPERS --------- */
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const load = (key, fallback) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

/* --------- KEYS --------- */
const KEYS = {
  personalTasks: "lifeos_personalTasks_v1",
  workTasks: "lifeos_workTasks_v1",
  personalFocus: "lifeos_personalFocus_v1",
  workFocus: "lifeos_workFocus_v1",
  personalJournal: "lifeos_personalJournal_v1",
  workJournal: "lifeos_workJournal_v1",
  personalGoals: "lifeos_personalGoals_v1",
  workGoals: "lifeos_workGoals_v1",
  personalTimeTasks: "lifeos_personalTimeTasks_v1",
  workTimeTasks: "lifeos_workTimeTasks_v1",
  habits: "lifeos_habits_v1"
};


/* --------- PAGE SWITCHING --------- */
const navButtons = $$(".nav-btn");
const pages = $$(".page");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.dataset.target;
    pages.forEach((p) => p.classList.remove("active"));
    $(target).classList.add("active");
  });
});

/* --------- HOME HEADER DATE --------- */
const homeDateLabel = $("homeDateLabel");
if (homeDateLabel) homeDateLabel.textContent = prettyDate(today);

/* --------- SCHEDULE (HOME PAGE) --------- */
const scheduleBlocks = [
  // Morning
  { time: "6:00 – 6:30 am", label: "Brush & Washroom", start: "06:00", end: "06:30" },
  { time: "6:30 – 7:15 am", label: "Workout", start: "06:30", end: "07:15" },
  { time: "7:15 – 7:30 am", label: "Walk outside", start: "07:15", end: "07:30" },
  { time: "7:30 – 8:00 am", label: "Brain challenge", start: "07:30", end: "08:00" },
  { time: "8:00 – 8:30 am", label: "Bath & Breakfast", start: "08:00", end: "08:30" },
  { time: "8:30 – 9:00 am", label: "Start office", start: "08:30", end: "09:00" },
  { time: "9:00 am – 7:00 pm", label: "Office", start: "09:00", end: "19:00" },

  // Evening / Night
  { time: "7:00 – 7:30 pm", label: "Skill development", start: "19:00", end: "19:30" },
  { time: "7:30 – 7:55 pm", label: "Excel", start: "19:30", end: "19:55" },
  { time: "7:55 – 8:05 pm", label: "Forex", start: "19:55", end: "20:05" },
  { time: "8:00 – 8:30 pm", label: "NISM certification", start: "20:00", end: "20:30" },
  { time: "8:30 – 9:00 pm", label: "Dinner", start: "20:30", end: "21:00" },
  { time: "9:00 – 9:20 pm", label: "Read", start: "21:00", end: "21:20" },
  { time: "9:30 – 10:00 pm", label: "YouTube / Idea panel", start: "21:30", end: "22:00" },
  { time: "10:00 – 10:20 pm", label: "Pray", start: "22:00", end: "22:20" },
  { time: "10:20 – 11:00 pm", label: "Meditation / Scripting", start: "22:20", end: "23:00" },
  { time: "11:00 pm – 6:00 am", label: "Sleep", start: "23:00", end: "06:00" },
];

const scheduleDisplay = $("scheduleDisplay");

function parseTimeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isNowInBlock(block, now = new Date()) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startM = parseTimeToMinutes(block.start);
  const endM = parseTimeToMinutes(block.end);
  if (block.start === "23:00" && block.end === "06:00") {
    // Sleep wraps midnight
    return nowMinutes >= startM || nowMinutes < endM;
  }
  return nowMinutes >= startM && nowMinutes < endM;
}

function renderSchedule() {
  if (!scheduleDisplay) return;
  scheduleDisplay.innerHTML = "";
  const now = new Date();
  scheduleBlocks.forEach((block) => {
    const row = document.createElement("div");
    row.className = "schedule-row";
    if (isNowInBlock(block, now)) row.classList.add("active-now");

    const t = document.createElement("div");
    t.className = "schedule-time";
    t.textContent = block.time;

    const task = document.createElement("div");
    task.className = "schedule-task";
    task.textContent = block.label;

    row.appendChild(t);
    row.appendChild(task);
    scheduleDisplay.appendChild(row);
  });
}
renderSchedule();
setInterval(renderSchedule, 60_000);

/* --------- MOTIVATION QUOTES --------- */
const motivationList = [
  "Small consistent actions beat rare heroic effort.",
  "Done is better than perfect. Just start.",
  "Your job today: be 1% better than yesterday.",
  "Systems > motivation. You’re building the system now.",
  "Missing one day is normal. Don’t miss two.",
  "You don’t rise to your goals. You fall to your systems.",
];
/* --------- HABIT TRACKER (HOME) --------- */

const HABITS = [
  { id: "wake6", label: "Wake up 6 am" },
  { id: "water3l", label: "Drink 3L water" },
  { id: "pushups100", label: "100 pushups" },
  { id: "skill1_5h", label: "Skill development 1.5 hrs" },
  { id: "makebed", label: "Make bed" },
  { id: "chia", label: "Chia water" },
  { id: "meditate", label: "Meditate" },
  { id: "pray", label: "Pray" },
  { id: "youtube", label: "YouTube" },
  { id: "read20", label: "Read 20 min" },
  { id: "journal", label: "Journaling" },
  { id: "brain", label: "Brain challenge" }
];

let habitData = load(KEYS.habits, {}); // {dateKey: {habitId: true/false}}
const habitListEl = $("habitList");

function renderHabits() {
  if (!habitListEl) return;
  const key = dateKey(new Date());
  if (!habitData[key]) habitData[key] = {};
  const dayHabits = habitData[key];

  habitListEl.innerHTML = "";

  HABITS.forEach(h => {
    const row = document.createElement("div");
    row.className = "habit-item";

    const label = document.createElement("label");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "habit-check";
    check.checked = !!dayHabits[h.id];

    check.addEventListener("change", () => {
      dayHabits[h.id] = check.checked;
      save(KEYS.habits, habitData);
    });

    const span = document.createElement("span");
    span.textContent = h.label;

    label.appendChild(check);
    label.appendChild(span);
    row.appendChild(label);

    habitListEl.appendChild(row);
  });
}

const motivationText = $("motivationText");
if (motivationText) {
  const q = motivationList[Math.floor(Math.random() * motivationList.length)];
  motivationText.textContent = q;
}

/* --------- TASK MODELS --------- */
function createTask(text) {
  return {
    id: Date.now().toString() + "_" + Math.random().toString(16).slice(2),
    text,
    done: false,
    order: Date.now(),
  };
}

/* --------- PERSONAL & WORK STATE --------- */
let personalTasks = load(KEYS.personalTasks, {}); // {dateKey: [tasks]}
let workTasks = load(KEYS.workTasks, {});
let personalFocus = load(KEYS.personalFocus, {});
let workFocus = load(KEYS.workFocus, {});
let personalJournal = load(KEYS.personalJournal, {});
let workJournal = load(KEYS.workJournal, {});
let personalGoals = load(KEYS.personalGoals, {
  daily: "",
  weekly: "",
  monthly: "",
  long: "",
});
let workGoals = load(KEYS.workGoals, {
  daily: "",
  weekly: "",
  monthly: "",
  long: "",
});
let personalTimeTasks = load(KEYS.personalTimeTasks, {
  daily: [],
  weekly: [],
  monthly: [],
  long: [],
});

let workTimeTasks = load(KEYS.workTimeTasks, {
  daily: [],
  weekly: [],
  monthly: [],
  long: [],
});

let personalCurrentDate = dateKey(today);
let workCurrentDate = dateKey(today);

/* --------- COMMON PROGRESS CALC --------- */
function calcProgress(taskList) {
  const total = taskList.length;
  const done = taskList.filter((t) => t.done).length;
  const pending = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, pending, percent };
}

function updateProgressRing(circleEl, textEl, data, headlineEl, detailEl, countTotalEl, countDoneEl, countPendingEl) {
  if (!circleEl || !textEl) return;
  const { total, done, pending, percent } = data;
  const circumference = 2 * Math.PI * 36; // radius 36

  circleEl.style.strokeDasharray = circumference.toString();
  circleEl.style.strokeDashoffset = (circumference - (percent / 100) * circumference).toString();
  textEl.textContent = `${percent}%`;

  if (headlineEl && detailEl) {
    if (total === 0) {
      headlineEl.textContent = "No tasks yet.";
      detailEl.textContent = "Add tasks to start tracking.";
    } else if (percent === 0) {
      headlineEl.textContent = "Let’s get started.";
      detailEl.textContent = "Even one small action counts.";
    } else if (percent < 100) {
      headlineEl.textContent = "Good progress.";
      detailEl.textContent = `You’ve completed ${done} of ${total} tasks.`;
    } else {
      headlineEl.textContent = "Perfect day!";
      detailEl.textContent = "All tasks completed for this day.";
    }
  }

  if (countTotalEl) countTotalEl.textContent = `${total} items`;
  if (countDoneEl) countDoneEl.textContent = `${done} done`;
  if (countPendingEl) countPendingEl.textContent = `${pending} pending`;
}

/* --------- PERSONAL PAGE LOGIC --------- */
const personalDatePicker = $("personalDatePicker");
const personalTaskForm = $("personalTaskForm");
const personalTaskInput = $("personalTaskInput");
const personalTaskList = $("personalTaskList");
const personalFocusInput = $("personalFocusInput");
const personalJournalInput = $("personalJournalInput");

const personalGoalDaily = $("personalGoalDaily");
const personalGoalWeekly = $("personalGoalWeekly");
const personalGoalMonthly = $("personalGoalMonthly");
const personalGoalLong = $("personalGoalLong");

const personalCircle = $("personalProgressCircle");
const personalPercent = $("personalProgressPercent");
const personalHeadline = $("personalProgressHeadline");
const personalDetail = $("personalProgressDetail");
const personalCountTotal = $("personalCountTotal");
const personalCountDone = $("personalCountDone");
const personalCountPending = $("personalCountPending");

if (personalDatePicker) {
  personalDatePicker.value = personalCurrentDate;
}

function getPersonalTasksForDate(key) {
  if (!personalTasks[key]) personalTasks[key] = [];
  return personalTasks[key];
}

function renderPersonalTasks() {
  if (!personalTaskList) return;
  const list = getPersonalTasksForDate(personalCurrentDate);

  // sort: not done first, then by order
  list.sort((a, b) => {
    if (a.done === b.done) return a.order - b.order;
    return a.done ? 1 : -1;
  });

  personalTaskList.innerHTML = "";
  list.forEach((task, index) => {
    const row = document.createElement("div");
    row.className = "task-row";
    row.draggable = true;
    row.dataset.id = task.id;

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "8px";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "task-check";
    check.checked = task.done;

    const text = document.createElement("div");
    text.className = "task-text" + (task.done ? " done" : "");
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "task-delete";
    del.textContent = "✕";

    check.addEventListener("change", () => {
      task.done = check.checked;
      // move to bottom if done
      task.order = Date.now();
      save(KEYS.personalTasks, personalTasks);
      renderPersonalTasks();
      updateAllProgress();
    });

    del.addEventListener("click", () => {
      const idx = list.findIndex((t) => t.id === task.id);
      if (idx !== -1) list.splice(idx, 1);
      save(KEYS.personalTasks, personalTasks);
      renderPersonalTasks();
      updateAllProgress();
    });

    // drag-and-drop
    row.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.id);
    });
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      row.style.opacity = "0.7";
    });
    row.addEventListener("dragleave", () => {
      row.style.opacity = "1";
    });
    row.addEventListener("drop", (e) => {
      e.preventDefault();
      row.style.opacity = "1";
      const draggedId = e.dataTransfer.getData("text/plain");
      if (!draggedId || draggedId === task.id) return;
      const fromIndex = list.findIndex((t) => t.id === draggedId);
      const toIndex = index;
      if (fromIndex === -1) return;
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      // update order
      list.forEach((t, i) => (t.order = i));
      save(KEYS.personalTasks, personalTasks);
      renderPersonalTasks();
      updateAllProgress();
    });

    left.appendChild(check);
    left.appendChild(text);
    row.appendChild(left);
    row.appendChild(del);
    personalTaskList.appendChild(row);
  });

  const progress = calcProgress(list);
  updateProgressRing(
    personalCircle,
    personalPercent,
    progress,
    personalHeadline,
    personalDetail,
    personalCountTotal,
    personalCountDone,
    personalCountPending
  );
}

if (personalTaskForm) {
  personalTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = (personalTaskInput.value || "").trim();
    if (!text) return;
    const list = getPersonalTasksForDate(personalCurrentDate);
    list.push(createTask(text));
    personalTaskInput.value = "";
    save(KEYS.personalTasks, personalTasks);
    renderPersonalTasks();
    updateAllProgress();
  });
}

if (personalDatePicker) {
  personalDatePicker.addEventListener("change", () => {
    personalCurrentDate = personalDatePicker.value || dateKey(new Date());
    renderPersonalTasks();
    renderPersonalFocusAndJournal();
    updateAllProgress();
  });
}

function renderPersonalFocusAndJournal() {
  if (personalFocusInput) {
    personalFocusInput.value = personalFocus[personalCurrentDate] || "";
  }
  if (personalJournalInput) {
    personalJournalInput.value = personalJournal[personalCurrentDate] || "";
  }
}

if (personalFocusInput) {
  personalFocusInput.addEventListener("input", () => {
    personalFocus[personalCurrentDate] = personalFocusInput.value;
    save(KEYS.personalFocus, personalFocus);
  });
}
if (personalJournalInput) {
  personalJournalInput.addEventListener("input", () => {
    personalJournal[personalCurrentDate] = personalJournalInput.value;
    save(KEYS.personalJournal, personalJournal);
  });
}

if (personalGoalDaily) personalGoalDaily.value = personalGoals.daily || "";
if (personalGoalWeekly) personalGoalWeekly.value = personalGoals.weekly || "";
if (personalGoalMonthly) personalGoalMonthly.value = personalGoals.monthly || "";
if (personalGoalLong) personalGoalLong.value = personalGoals.long || "";

if (personalGoalDaily)
  personalGoalDaily.addEventListener("input", () => {
    personalGoals.daily = personalGoalDaily.value;
    save(KEYS.personalGoals, personalGoals);
  });
if (personalGoalWeekly)
  personalGoalWeekly.addEventListener("input", () => {
    personalGoals.weekly = personalGoalWeekly.value;
    save(KEYS.personalGoals, personalGoals);
  });
if (personalGoalMonthly)
  personalGoalMonthly.addEventListener("input", () => {
    personalGoals.monthly = personalGoalMonthly.value;
    save(KEYS.personalGoals, personalGoals);
  });
if (personalGoalLong)
  personalGoalLong.addEventListener("input", () => {
    personalGoals.long = personalGoalLong.value;
    save(KEYS.personalGoals, personalGoals);
  });
/* --------- PERSONAL TIMEFRAME TASKS --------- */

const personalTimeTabs = $("personalTimeTabs");
const personalTimeTaskForm = $("personalTimeTaskForm");
const personalTimeTaskInput = $("personalTimeTaskInput");
const personalTimeTaskList = $("personalTimeTaskList");

let personalCurrentScope = "daily";

function getPersonalTimeList(scope) {
  if (!personalTimeTasks[scope]) personalTimeTasks[scope] = [];
  return personalTimeTasks[scope];
}

function renderPersonalTimeTasks() {
  if (!personalTimeTaskList) return;
  const list = getPersonalTimeList(personalCurrentScope);

  // sort: undone first, then by order
  list.sort((a, b) => {
    if (a.done === b.done) return a.order - b.order;
    return a.done ? 1 : -1;
  });

  personalTimeTaskList.innerHTML = "";

  list.forEach((task, index) => {
    const row = document.createElement("div");
    row.className = "task-row";
    row.draggable = true;

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "8px";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "task-check";
    check.checked = task.done;

    const text = document.createElement("div");
    text.className = "task-text" + (task.done ? " done" : "");
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "task-delete";
    del.textContent = "✕";

    check.addEventListener("change", () => {
      task.done = check.checked;
      // move to bottom when done
      task.order = Date.now();
      save(KEYS.personalTimeTasks, personalTimeTasks);
      renderPersonalTimeTasks();
    });

    del.addEventListener("click", () => {
      const idx = list.indexOf(task);
      if (idx !== -1) list.splice(idx, 1);
      save(KEYS.personalTimeTasks, personalTimeTasks);
      renderPersonalTimeTasks();
    });

    // drag and drop reordering
    row.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", String(index));
    });
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      row.style.opacity = "0.7";
    });
    row.addEventListener("dragleave", () => {
      row.style.opacity = "1";
    });
    row.addEventListener("drop", (e) => {
      e.preventDefault();
      row.style.opacity = "1";
      const fromIndex = Number(e.dataTransfer.getData("text/plain"));
      const toIndex = index;
      if (Number.isNaN(fromIndex)) return;
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      list.forEach((t, i) => (t.order = i));
      save(KEYS.personalTimeTasks, personalTimeTasks);
      renderPersonalTimeTasks();
    });

    left.appendChild(check);
    left.appendChild(text);
    row.appendChild(left);
    row.appendChild(del);
    personalTimeTaskList.appendChild(row);
  });
}

if (personalTimeTabs) {
  personalTimeTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".time-tab");
    if (!btn) return;
    const scope = btn.dataset.scope;
    if (!scope) return;
    personalCurrentScope = scope;

    Array.from(personalTimeTabs.querySelectorAll(".time-tab")).forEach((b) =>
      b.classList.toggle("active", b === btn)
    );

    renderPersonalTimeTasks();
  });
}

if (personalTimeTaskForm) {
  personalTimeTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = (personalTimeTaskInput.value || "").trim();
    if (!text) return;
    const list = getPersonalTimeList(personalCurrentScope);
    list.push({
      id: Date.now().toString(),
      text,
      done: false,
      order: Date.now(),
    });
    personalTimeTaskInput.value = "";
    save(KEYS.personalTimeTasks, personalTimeTasks);
    renderPersonalTimeTasks();
  });
}

/* --------- WORK PAGE LOGIC --------- */
const workDatePicker = $("workDatePicker");
const workTaskForm = $("workTaskForm");
const workTaskInput = $("workTaskInput");
const workTaskList = $("workTaskList");
const workFocusInput = $("workFocusInput");
const workJournalInput = $("workJournalInput");

const workGoalDaily = $("workGoalDaily");
const workGoalWeekly = $("workGoalWeekly");
const workGoalMonthly = $("workGoalMonthly");
const workGoalLong = $("workGoalLong");

const workCircle = $("workProgressCircle");
const workPercent = $("workProgressPercent");
const workHeadline = $("workProgressHeadline");
const workDetail = $("workProgressDetail");
const workCountTotal = $("workCountTotal");
const workCountDone = $("workCountDone");
const workCountPending = $("workCountPending");

if (workDatePicker) {
  workDatePicker.value = workCurrentDate;
}

function getWorkTasksForDate(key) {
  if (!workTasks[key]) workTasks[key] = [];
  return workTasks[key];
}

function renderWorkTasks() {
  if (!workTaskList) return;
  const list = getWorkTasksForDate(workCurrentDate);

  list.sort((a, b) => {
    if (a.done === b.done) return a.order - b.order;
    return a.done ? 1 : -1;
  });

  workTaskList.innerHTML = "";
  list.forEach((task, index) => {
    const row = document.createElement("div");
    row.className = "task-row";
    row.draggable = true;
    row.dataset.id = task.id;

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "8px";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "task-check";
    check.checked = task.done;

    const text = document.createElement("div");
    text.className = "task-text" + (task.done ? " done" : "");
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "task-delete";
    del.textContent = "✕";

    check.addEventListener("change", () => {
      task.done = check.checked;
      task.order = Date.now();
      save(KEYS.workTasks, workTasks);
      renderWorkTasks();
      updateAllProgress();
    });

    del.addEventListener("click", () => {
      const idx = list.findIndex((t) => t.id === task.id);
      if (idx !== -1) list.splice(idx, 1);
      save(KEYS.workTasks, workTasks);
      renderWorkTasks();
      updateAllProgress();
    });

    row.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.id);
    });
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      row.style.opacity = "0.7";
    });
    row.addEventListener("dragleave", () => {
      row.style.opacity = "1";
    });
    row.addEventListener("drop", (e) => {
      e.preventDefault();
      row.style.opacity = "1";
      const draggedId = e.dataTransfer.getData("text/plain");
      if (!draggedId || draggedId === task.id) return;
      const fromIndex = list.findIndex((t) => t.id === draggedId);
      const toIndex = index;
      if (fromIndex === -1) return;
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      list.forEach((t, i) => (t.order = i));
      save(KEYS.workTasks, workTasks);
      renderWorkTasks();
      updateAllProgress();
    });

    left.appendChild(check);
    left.appendChild(text);
    row.appendChild(left);
    row.appendChild(del);
    workTaskList.appendChild(row);
  });

  const progress = calcProgress(list);
  updateProgressRing(
    workCircle,
    workPercent,
    progress,
    workHeadline,
    workDetail,
    workCountTotal,
    workCountDone,
    workCountPending
  );
}

if (workTaskForm) {
  workTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = (workTaskInput.value || "").trim();
    if (!text) return;
    const list = getWorkTasksForDate(workCurrentDate);
    list.push(createTask(text));
    workTaskInput.value = "";
    save(KEYS.workTasks, workTasks);
    renderWorkTasks();
    updateAllProgress();
  });
}

if (workDatePicker) {
  workDatePicker.addEventListener("change", () => {
    workCurrentDate = workDatePicker.value || dateKey(new Date());
    renderWorkTasks();
    renderWorkFocusAndJournal();
    updateAllProgress();
  });
}

function renderWorkFocusAndJournal() {
  if (workFocusInput) {
    workFocusInput.value = workFocus[workCurrentDate] || "";
  }
  if (workJournalInput) {
    workJournalInput.value = workJournal[workCurrentDate] || "";
  }
}

if (workFocusInput) {
  workFocusInput.addEventListener("input", () => {
    workFocus[workCurrentDate] = workFocusInput.value;
    save(KEYS.workFocus, workFocus);
  });
}
if (workJournalInput) {
  workJournalInput.addEventListener("input", () => {
    workJournal[workCurrentDate] = workJournalInput.value;
    save(KEYS.workJournal, workJournal);
  });
}

if (workGoalDaily) workGoalDaily.value = workGoals.daily || "";
if (workGoalWeekly) workGoalWeekly.value = workGoals.weekly || "";
if (workGoalMonthly) workGoalMonthly.value = workGoals.monthly || "";
if (workGoalLong) workGoalLong.value = workGoals.long || "";

if (workGoalDaily)
  workGoalDaily.addEventListener("input", () => {
    workGoals.daily = workGoalDaily.value;
    save(KEYS.workGoals, workGoals);
  });
if (workGoalWeekly)
  workGoalWeekly.addEventListener("input", () => {
    workGoals.weekly = workGoalWeekly.value;
    save(KEYS.workGoals, workGoals);
  });
if (workGoalMonthly)
  workGoalMonthly.addEventListener("input", () => {
    workGoals.monthly = workGoalMonthly.value;
    save(KEYS.workGoals, workGoals);
  });
if (workGoalLong)
  workGoalLong.addEventListener("input", () => {
    workGoals.long = workGoalLong.value;
    save(KEYS.workGoals, workGoals);
  });
/* --------- WORK TIMEFRAME TASKS --------- */

const workTimeTabs = $("workTimeTabs");
const workTimeTaskForm = $("workTimeTaskForm");
const workTimeTaskInput = $("workTimeTaskInput");
const workTimeTaskList = $("workTimeTaskList");

let workCurrentScope = "daily";

function getWorkTimeList(scope) {
  if (!workTimeTasks[scope]) workTimeTasks[scope] = [];
  return workTimeTasks[scope];
}

function renderWorkTimeTasks() {
  if (!workTimeTaskList) return;
  const list = getWorkTimeList(workCurrentScope);

  list.sort((a, b) => {
    if (a.done === b.done) return a.order - b.order;
    return a.done ? 1 : -1;
  });

  workTimeTaskList.innerHTML = "";

  list.forEach((task, index) => {
    const row = document.createElement("div");
    row.className = "task-row";
    row.draggable = true;

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "8px";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "task-check";
    check.checked = task.done;

    const text = document.createElement("div");
    text.className = "task-text" + (task.done ? " done" : "");
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "task-delete";
    del.textContent = "✕";

    check.addEventListener("change", () => {
      task.done = check.checked;
      task.order = Date.now();
      save(KEYS.workTimeTasks, workTimeTasks);
      renderWorkTimeTasks();
    });

    del.addEventListener("click", () => {
      const idx = list.indexOf(task);
      if (idx !== -1) list.splice(idx, 1);
      save(KEYS.workTimeTasks, workTimeTasks);
      renderWorkTimeTasks();
    });

    row.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", String(index));
    });
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      row.style.opacity = "0.7";
    });
    row.addEventListener("dragleave", () => {
      row.style.opacity = "1";
    });
    row.addEventListener("drop", (e) => {
      e.preventDefault();
      row.style.opacity = "1";
      const fromIndex = Number(e.dataTransfer.getData("text/plain"));
      const toIndex = index;
      if (Number.isNaN(fromIndex)) return;
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      list.forEach((t, i) => (t.order = i));
      save(KEYS.workTimeTasks, workTimeTasks);
      renderWorkTimeTasks();
    });

    left.appendChild(check);
    left.appendChild(text);
    row.appendChild(left);
    row.appendChild(del);
    workTimeTaskList.appendChild(row);
  });
}

if (workTimeTabs) {
  workTimeTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".time-tab");
    if (!btn) return;
    const scope = btn.dataset.scope;
    if (!scope) return;
    workCurrentScope = scope;

    Array.from(workTimeTabs.querySelectorAll(".time-tab")).forEach((b) =>
      b.classList.toggle("active", b === btn)
    );

    renderWorkTimeTasks();
  });
}

if (workTimeTaskForm) {
  workTimeTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = (workTimeTaskInput.value || "").trim();
    if (!text) return;
    const list = getWorkTimeList(workCurrentScope);
    list.push({
      id: Date.now().toString(),
      text,
      done: false,
      order: Date.now(),
    });
    workTimeTaskInput.value = "";
    save(KEYS.workTimeTasks, workTimeTasks);
    renderWorkTimeTasks();
  });
}

/* --------- STREAK + HOME PROGRESS + HISTORY --------- */
const homeCircle = $("homeProgressCircle");
const homePercent = $("homeProgressPercent");
const homeHeadline = $("homeProgressHeadline");
const homeDetail = $("homeProgressDetail");
const homeCountTotal = $("homeCountTotal");
const homeCountDone = $("homeCountDone");
const homeCountPending = $("homeCountPending");

const homeStreakCount = $("homeStreakCount");
const homeBestStreak = $("homeBestStreak");
const homeHistoryList = $("homeHistoryList");

function getCombinedTasksForDate(key) {
  const p = personalTasks[key] || [];
  const w = workTasks[key] || [];
  return [...p, ...w];
}

function computeDayPercent(key) {
  const dayHabits = habitData[key] || {};
  const total = HABITS.length;
  const done = HABITS.filter(h => dayHabits[h.id]).length;
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}


function computeStreak() {
  // streak = consecutive days (including today) with 100% completion
  let streak = 0;
  let best = 0;

  // build list of all dates that have any tasks
  const keysSet = new Set([
    ...Object.keys(personalTasks),
    ...Object.keys(workTasks),
  ]);
  const keys = Array.from(keysSet).sort(); // ascending

  if (keys.length === 0) {
    return { streak: 0, best: 0 };
  }

  // best streak across full history
  let current = 0;
  let prevDate = null;
  keys.forEach((key) => {
    const pct = computeDayPercent(key);
    if (pct === 100) {
      if (!prevDate) {
        current = 1;
      } else {
        const prev = new Date(prevDate);
        const curr = new Date(key);
        const diff =
          (curr - prev) / (1000 * 60 * 60 * 24); // days difference
        if (diff === 1) {
          current += 1;
        } else {
          current = 1;
        }
      }
      if (current > best) best = current;
      prevDate = key;
    } else {
      current = 0;
    }
  });

  // current streak from today backwards
  let currentStreak = 0;
  let d = new Date();
  while (true) {
    const key = dateKey(d);
    const pct = computeDayPercent(key);
    if (pct === 100 && (personalTasks[key] || workTasks[key])) {
      currentStreak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  return { streak: currentStreak, best };
}

function renderHomeHistory() {
  if (!homeHistoryList) return;
  homeHistoryList.innerHTML = "";

  const keysSet = new Set([
    ...Object.keys(personalTasks),
    ...Object.keys(workTasks),
  ]);
  const keys = Array.from(keysSet).sort().reverse(); // latest first
  const recent = keys.slice(0, 7);

  if (recent.length === 0) {
    const empty = document.createElement("div");
    empty.className = "history-item";
    empty.textContent = "No history yet. As you track tasks, days will show up here.";
    homeHistoryList.appendChild(empty);
    return;
  }

  recent.forEach((k) => {
    const pct = computeDayPercent(k);
    const item = document.createElement("div");
    item.className = "history-item";
    item.textContent = `${prettyDate(k)} — ${pct}% completed`;
    homeHistoryList.appendChild(item);
  });
}

function updateAllProgress() {
  // personal
  renderPersonalTasks();
  // work
  renderWorkTasks();

     // home progress = today's HABITS only
 const todayKey = dateKey(new Date());
const dayHabits = habitData[todayKey] || {};
const totalHabits = HABITS.length;
const doneHabits = HABITS.filter(h => dayHabits[h.id]).length;
const pendingHabits = totalHabits - doneHabits;

const habitProgress = {
  total: totalHabits,
  done: doneHabits,
  pending: pendingHabits,
  percent: totalHabits === 0 ? 0 : Math.round((doneHabits / totalHabits) * 100),
};

updateProgressRing(
  homeCircle,
  homePercent,
  habitProgress,
  homeHeadline,
  homeDetail,
  homeCountTotal,
  homeCountDone,
  homeCountPending
);


  updateProgressRing(
    homeCircle,
    homePercent,
    habitProgress,
    homeHeadline,
    homeDetail,
    homeCountTotal,
    homeCountDone,
    homeCountPending
  );



  // streak
  const { streak, best } = computeStreak();
  if (homeStreakCount) homeStreakCount.textContent = streak;
  if (homeBestStreak) homeBestStreak.textContent = best;

  // history
  renderHomeHistory();
}

/* --------- EXPORT TO "EXCEL" (CSV) --------- */
function exportToExcel() {
  // We'll generate a CSV that Excel can open.
  const lines = [];
  lines.push("Type,Date,Area,Task,Done");

  const addTasks = (map, areaLabel) => {
    Object.entries(map).forEach(([date, tasks]) => {
      tasks.forEach((t) => {
        lines.push(
          [
            "Task",
            date,
            areaLabel,
            `"${(t.text || "").replace(/"/g, '""')}"`,
            t.done ? "Yes" : "No",
          ].join(",")
        );
      });
    });
  };

  addTasks(personalTasks, "Personal");
  addTasks(workTasks, "Work");

  // focus / journal not included for now (can be added later)

  const csvContent = lines.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `LifeOS_export_${dateKey(new Date())}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const exportBtn = $("exportExcelBtn");
if (exportBtn) {
  exportBtn.addEventListener("click", exportToExcel);
}

/* --------- RESET ALL DATA --------- */
const resetBtn = $("resetAllBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    const ok = confirm(
      "This will DELETE all tasks, notes, focus, and goals stored in this browser. Are you sure?"
    );
    if (!ok) return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    location.reload();
  });
}

/* --------- INITIAL RENDER --------- */
function init() {
  // set default dates
  if (personalDatePicker && !personalDatePicker.value)
    personalDatePicker.value = personalCurrentDate;
  if (workDatePicker && !workDatePicker.value)
    workDatePicker.value = workCurrentDate;

  renderPersonalTasks();
  renderPersonalFocusAndJournal();
  renderWorkTasks();
  renderWorkFocusAndJournal();
  renderHabits();
  renderPersonalTimeTasks();
  renderWorkTimeTasks();
  updateAllProgress();
}



document.addEventListener("DOMContentLoaded", init);

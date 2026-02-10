// ==================== DATA MANAGEMENT ====================
// ==================== DATA MANAGEMENT ====================
function createStudyPlanner() {
  let subjects = [];
  let schedule = [];
  let tasks = [];
  let settings = {
    darkMode: false,
    notifications: true,
    weekStartDay: 1,
  };

  function loadData() {
    const saved = localStorage.getItem("studyPlanner");
    if (saved) {
      const data = JSON.parse(saved);
      subjects = data.subjects || [];
      schedule = data.schedule || [];
      tasks = data.tasks || [];
      settings = { ...settings, ...data.settings };
    }
  }

  function saveData() {
    const data = { subjects, schedule, tasks, settings };
    localStorage.setItem("studyPlanner", JSON.stringify(data));
  }

  function exportData() {
    return JSON.stringify(
      {
        subjects,
        schedule,
        tasks,
        settings,
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
  }

  function importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      subjects = data.subjects || [];
      schedule = data.schedule || [];
      tasks = data.tasks || [];
      settings = { ...settings, ...data.settings };
      saveData();
      return true;
    } catch (e) {
      console.error("Import error:", e);
      return false;
    }
  }

  function resetData() {
    subjects = [];
    schedule = [];
    tasks = [];
    settings = {
      darkMode: false,
      notifications: true,
      weekStartDay: 1,
    };
    saveData();
  }

  loadData();

  return {
    get subjects() {
      return subjects;
    },
    set subjects(val) {
      subjects = val;
    },

    get schedule() {
      return schedule;
    },
    set schedule(val) {
      schedule = val;
    },

    get tasks() {
      return tasks;
    },
    set tasks(val) {
      tasks = val;
    },

    get settings() {
      return settings;
    },
    set settings(val) {
      settings = val;
    },

    loadData,
    saveData,
    exportData,
    importData,
    resetData,
  };
}


// ==================== INITIALIZATION ====================
const planner = createStudyPlanner();

let currentEditingId = null;
let currentEditingType = null;

// ==================== UI UTILITIES ====================
function showModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

function switchSection(sectionId) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");

  document
    .querySelectorAll(".nav-item")
    .forEach((item) => item.classList.remove("active"));
  document
    .querySelector(`[data-section="${sectionId}"]`)
    .classList.add("active");

  const titles = {
    dashboard: "Dashboard",
    subjects: "Subject Management",
    schedule: "Schedule Planner",
    tasks: "Task Manager",
    analytics: "Progress Analytics",
    settings: "Settings",
  };
  document.getElementById("pageTitle").textContent =
    titles[sectionId] || "Dashboard";
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function getDaysUntil(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);
  const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  return diff;
}

// ==================== DASHBOARD ====================
function updateDashboard() {
  document.getElementById("totalSubjects").textContent =
    planner.subjects.length;

  const completedCount = planner.tasks.filter((t) => t.completed).length;
  const pendingCount = planner.tasks.filter((t) => !t.completed).length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingCount = planner.tasks.filter((t) => {
    const taskDate = new Date(t.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate >= today && !t.completed;
  }).length;

  document.getElementById("completedTasks").textContent = completedCount;
  document.getElementById("pendingTasks").textContent = pendingCount;
  document.getElementById("upcomingDeadlines").textContent = upcomingCount;

  // Update upcoming deadlines
  const upcomingList = document.getElementById("upcomingList");
  const upcoming = planner.tasks
    .filter((t) => !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  if (upcoming.length === 0) {
    upcomingList.innerHTML =
      '<li class="upcoming-item"><div><div style="font-weight: 600;">No upcoming deadlines</div><div style="font-size: 12px; color: var(--text-secondary);">Add tasks to get started</div></div></li>';
  } else {
    upcomingList.innerHTML = upcoming
      .map((task) => {
        const daysLeft = getDaysUntil(task.dueDate);
        let badgeClass = "";
        if (daysLeft <= 1) badgeClass = "urgent";
        else if (daysLeft <= 3) badgeClass = "soon";

        const subject = planner.subjects.find((s) => s.id === task.subjectId);
        return `
                        <li class="upcoming-item ${daysLeft <= 3 ? "urgent" : ""}">
                            <div>
                                <div style="font-weight: 600;">${task.title}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">${subject?.name || "Unknown"}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">${formatDate(task.dueDate)}</div>
                            </div>
                            <span class="deadline-badge ${badgeClass}">${daysLeft <= 0 ? "Overdue" : daysLeft + "d"}</span>
                        </li>
                    `;
      })
      .join("");
  }

  // Update today's schedule
  updateTodaySchedule();
}

function updateTodaySchedule() {
  const today = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = days[today.getDay()];

  const todayClasses = planner.schedule
    .filter((s) => s.day === todayName)
    .sort((a, b) => a.time.localeCompare(b.time));

  const container = document.getElementById("todaySchedule");
  if (todayClasses.length === 0) {
    container.innerHTML =
      '<div style="text-align: center; color: var(--text-secondary); padding: 40px 20px; width: 100%;">No classes scheduled for today</div>';
  } else {
    container.innerHTML = todayClasses
      .map((schedule) => {
        const subject = planner.subjects.find(
          (s) => s.id === schedule.subjectId,
        );
        return `
                        <div class="time-slot">
                            <div class="time">${schedule.time}</div>
                            <div class="subject">${subject?.name || "Unknown Subject"}</div>
                            <div class="duration">${schedule.duration} mins</div>
                        </div>
                    `;
      })
      .join("");
  }
}

// ==================== SUBJECT MANAGEMENT ====================
function updateSubjectsTable() {
  const table = document.getElementById("subjectsTable");
  if (planner.subjects.length === 0) {
    table.innerHTML =
      '<tr><td colspan="5" style="text-align: center; padding: 30px;"><div class="text-secondary">No subjects added yet</div></td></tr>';
  } else {
    table.innerHTML = planner.subjects
      .map(
        (subject) => `
                    <tr>
                        <td><strong>${subject.name}</strong></td>
                        <td><span class="priority-badge priority-${subject.priority}">${subject.priority.toUpperCase()}</span></td>
                        <td>
                            <button class="btn btn-secondary btn-small" onclick="editSubject('${subject.id}')">Edit</button>
                            <button class="btn btn-danger btn-small" onclick="deleteSubject('${subject.id}')">Delete</button>
                        </td>
                    </tr>
                `,
      )
      .join("");
  }

  updateScheduleFormOptions();
  updateTaskFormOptions();
}

function addOrUpdateSubject(e) {
  e.preventDefault();
  const subject = {
    id: currentEditingId || Date.now().toString(),
    name: document.getElementById("subjectName").value,
    priority: document.getElementById("subjectPriority").value,
    description: document.getElementById("subjectDescription").value,
  };

  if (currentEditingId) {
    const index = planner.subjects.findIndex((s) => s.id === currentEditingId);
    planner.subjects[index] = subject;
  } else {
    planner.subjects.push(subject);
  }

  planner.saveData();
  closeModal("subjectModal");
  updateSubjectsTable();
  updateDashboard();
  resetSubjectForm();
}

function editSubject(id) {
  const subject = planner.subjects.find((s) => s.id === id);
  currentEditingId = id;
  document.getElementById("subjectModalTitle").textContent = "Edit Subject";
  document.getElementById("subjectName").value = subject.name;
  document.getElementById("subjectPriority").value = subject.priority;
  document.getElementById("subjectDescription").value = subject.description;
  showModal("subjectModal");
}

function deleteSubject(id) {
  if (confirm("Are you sure you want to delete this subject?")) {
    planner.subjects = planner.subjects.filter((s) => s.id !== id);
    planner.schedule = planner.schedule.filter((s) => s.subjectId !== id);
    planner.tasks = planner.tasks.filter((t) => t.subjectId !== id);
    planner.saveData();
    updateSubjectsTable();
    updateScheduleTable();
    updateTasksTables();
    updateDashboard();
  }
}

function resetSubjectForm() {
  document.getElementById("subjectForm").reset();
  currentEditingId = null;
  document.getElementById("subjectModalTitle").textContent = "Add Subject";
}

// ==================== SCHEDULE PLANNER ====================
function updateScheduleFormOptions() {
  const select = document.getElementById("scheduleSubject");
  const taskSelect = document.getElementById("taskSubject");
  select.innerHTML = '<option value="">Select a subject</option>';
  taskSelect.innerHTML = '<option value="">Select a subject</option>';
  planner.subjects.forEach((subject) => {
    const option = document.createElement("option");
    option.value = subject.id;
    option.textContent = subject.name;
    select.appendChild(option);
    const taskOption = document.createElement("option");
    taskOption.value = subject.id;
    taskOption.textContent = subject.name;
    taskSelect.appendChild(taskOption);
  });
}

function addOrUpdateSchedule(e) {
  e.preventDefault();
  const schedule = {
    id: currentEditingId || Date.now().toString(),
    subjectId: document.getElementById("scheduleSubject").value,
    day: document.getElementById("scheduleDay").value,
    time: document.getElementById("scheduleTime").value,
    duration: parseInt(document.getElementById("scheduleDuration").value),
  };

  if (currentEditingId) {
    const index = planner.schedule.findIndex((s) => s.id === currentEditingId);
    planner.schedule[index] = schedule;
  } else {
    planner.schedule.push(schedule);
  }

  planner.saveData();
  closeModal("scheduleModal");
  updateScheduleTable();
  updateDashboard();
  resetScheduleForm();
}

function updateScheduleTable() {
  const weeklyTable = document.getElementById("weeklyScheduleTable");
  if (planner.schedule.length === 0) {
    weeklyTable.innerHTML =
      '<tr><td colspan="6" style="text-align: center; padding: 30px;"><div class="text-secondary">No classes scheduled</div></td></tr>';
  } else {
    weeklyTable.innerHTML = planner.schedule
      .map((schedule) => {
        const subject = planner.subjects.find(
          (s) => s.id === schedule.subjectId,
        );
        return `
                        <tr>
                            <td><strong>${subject?.name || "Unknown"}</strong></td>
                            <td>${schedule.day}</td>
                            <td>${schedule.time}</td>
                            <td>${schedule.duration} mins</td>
                            <td>
                                <button class="btn btn-secondary btn-small" onclick="editSchedule('${schedule.id}')">Edit</button>
                                <button class="btn btn-danger btn-small" onclick="deleteSchedule('${schedule.id}')">Delete</button>
                            </td>
                        </tr>
                    `;
      })
      .join("");
  }

  updateDailyScheduleView();
}

function updateDailyScheduleView() {
  const dateInput = document.getElementById("scheduleDate");
  if (!dateInput.value) {
    const today = new Date();
    dateInput.value = today.toISOString().split("T")[0];
  }

  const selectedDate = new Date(dateInput.value);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const selectedDay = days[selectedDate.getDay()];

  const dayClasses = planner.schedule
    .filter((s) => s.day === selectedDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  const container = document.getElementById("dailySchedule");
  if (dayClasses.length === 0) {
    container.innerHTML =
      '<div style="text-align: center; color: var(--text-secondary); padding: 40px 20px; width: 100%;">No classes scheduled</div>';
  } else {
    container.innerHTML = dayClasses
      .map((schedule) => {
        const subject = planner.subjects.find(
          (s) => s.id === schedule.subjectId,
        );
        return `
                        <div class="time-slot">
                            <div class="time">${schedule.time}</div>
                            <div class="subject">${subject?.name || "Unknown"}</div>
                            <div class="duration">${schedule.duration} mins</div>
                        </div>
                    `;
      })
      .join("");
  }
}

function editSchedule(id) {
  const schedule = planner.schedule.find((s) => s.id === id);
  currentEditingId = id;
  document.getElementById("scheduleModalTitle").textContent = "Edit Session";
  document.getElementById("scheduleSubject").value = schedule.subjectId;
  document.getElementById("scheduleDay").value = schedule.day;
  document.getElementById("scheduleTime").value = schedule.time;
  document.getElementById("scheduleDuration").value = schedule.duration;
  showModal("scheduleModal");
}

function deleteSchedule(id) {
  if (confirm("Delete this class?")) {
    planner.schedule = planner.schedule.filter((s) => s.id !== id);
    planner.saveData();
    updateScheduleTable();
    updateDashboard();
  }
}

function resetScheduleForm() {
  document.getElementById("scheduleForm").reset();
  currentEditingId = null;
  document.getElementById("scheduleModalTitle").textContent = "Add Session";
}

// ==================== TASK MANAGER ====================
function addOrUpdateTask(e) {
  e.preventDefault();
  const task = {
    id: currentEditingId || Date.now().toString(),
    title: document.getElementById("taskTitle").value,
    type: document.getElementById("taskType").value,
    subjectId: document.getElementById("taskSubject").value,
    dueDate: document.getElementById("taskDueDate").value,
    dueTime: document.getElementById("taskDueTime").value,
    description: document.getElementById("taskDescription").value,
    priority: document.getElementById("taskPriority").value,
    completed: currentEditingId
      ? planner.tasks.find((t) => t.id === currentEditingId).completed
      : false,
  };

  if (currentEditingId) {
    const index = planner.tasks.findIndex((t) => t.id === currentEditingId);
    planner.tasks[index] = task;
  } else {
    planner.tasks.push(task);
  }

  planner.saveData();
  closeModal("taskModal");
  updateTasksTables();
  updateDashboard();
  resetTaskForm();
}

function updateTasksTables() {
  const assignments = planner.tasks.filter((t) => t.type === "assignment");
  const exams = planner.tasks.filter((t) => t.type === "exam");

  updateTaskTable("assignmentsTable", assignments);
  updateTaskTable("examsTable", exams);
  updateTaskTable("allTasksTable", planner.tasks);
}

function updateTaskTable(tableId, tasks) {
  const table = document.getElementById(tableId);
  if (tasks.length === 0) {
    const cols = tableId === "examsTable" ? 6 : 5;
    table.innerHTML = `<tr><td colspan="${cols}" style="text-align: center; padding: 30px;"><div class="text-secondary">No tasks</div></td></tr>`;
  } else {
    table.innerHTML = tasks
      .map((task) => {
        const subject = planner.subjects.find((s) => s.id === task.subjectId);
        let html = "";
        if (tableId === "assignmentsTable") {
          html = `
                            <tr>
                                <td><strong>${task.title}</strong></td>
                                <td>${subject?.name || "Unknown"}</td>
                                <td>${formatDate(task.dueDate)}</td>
                                <td><span class="priority-badge priority-${task.priority}">${task.completed ? "✓ Completed" : "Pending"}</span></td>
                                <td>
                                    <button class="btn btn-secondary btn-small" onclick="editTask('${task.id}')">Edit</button>
                                    <button class="btn btn-success btn-small" onclick="toggleTask('${task.id}')" style="opacity: ${task.completed ? "0.6" : "1"}">${task.completed ? "↩️" : "✓"}</button>
                                    <button class="btn btn-danger btn-small" onclick="deleteTask('${task.id}')">Delete</button>
                                </td>
                            </tr>
                        `;
        } else if (tableId === "examsTable") {
          html = `
                            <tr>
                                <td><strong>${subject?.name || "Unknown"}</strong></td>
                                <td>${formatDate(task.dueDate)}</td>
                                <td>${task.dueTime || "-"}</td>
                                <td>TBD</td>
                                <td><span class="priority-badge priority-${task.priority}">${task.completed ? "✓ Completed" : "Pending"}</span></td>
                                <td>
                                    <button class="btn btn-secondary btn-small" onclick="editTask('${task.id}')">Edit</button>
                                    <button class="btn btn-success btn-small" onclick="toggleTask('${task.id}')" style="opacity: ${task.completed ? "0.6" : "1"}">${task.completed ? "↩️" : "✓"}</button>
                                    <button class="btn btn-danger btn-small" onclick="deleteTask('${task.id}')">Delete</button>
                                </td>
                            </tr>
                        `;
        } else {
          html = `
                            <tr>
                                <td><strong>${task.title}</strong></td>
                                <td><span class="priority-badge" style="background: #dbeafe; color: #0c4a6e;">${task.type.toUpperCase()}</span></td>
                                <td>${subject?.name || "Unknown"}</td>
                                <td>${formatDate(task.dueDate)}</td>
                                <td><span class="priority-badge priority-${task.priority}">${task.completed ? "✓ Completed" : "Pending"}</span></td>
                                <td>
                                    <button class="btn btn-secondary btn-small" onclick="editTask('${task.id}')">Edit</button>
                                    <button class="btn btn-success btn-small" onclick="toggleTask('${task.id}')" style="opacity: ${task.completed ? "0.6" : "1"}">${task.completed ? "↩️" : "✓"}</button>
                                    <button class="btn btn-danger btn-small" onclick="deleteTask('${task.id}')">Delete</button>
                                </td>
                            </tr>
                        `;
        }
        return html;
      })
      .join("");
  }
}

function editTask(id) {
  const task = planner.tasks.find((t) => t.id === id);
  currentEditingId = id;
  document.getElementById("taskModalTitle").textContent = "Edit Task";
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskType").value = task.type;
  document.getElementById("taskSubject").value = task.subjectId;
  document.getElementById("taskDueDate").value = task.dueDate;
  document.getElementById("taskDueTime").value = task.dueTime;
  document.getElementById("taskDescription").value = task.description;
  document.getElementById("taskPriority").value = task.priority;
  showModal("taskModal");
}

function deleteTask(id) {
  if (confirm("Delete this task?")) {
    planner.tasks = planner.tasks.filter((t) => t.id !== id);
    planner.saveData();
    updateTasksTables();
    updateDashboard();
  }
}

function toggleTask(id) {
  const task = planner.tasks.find((t) => t.id === id);
  task.completed = !task.completed;
  planner.saveData();
  updateTasksTables();
  updateDashboard();
}

function resetTaskForm() {
  document.getElementById("taskForm").reset();
  currentEditingId = null;
  document.getElementById("taskModalTitle").textContent = "Add Task";
}

function updateTaskFormOptions() {
  const select = document.getElementById("taskSubject");
  select.innerHTML = '<option value="">Select a subject</option>';
  planner.subjects.forEach((subject) => {
    const option = document.createElement("option");
    option.value = subject.id;
    option.textContent = subject.name;
    select.appendChild(option);
  });
}

// ==================== ANALYTICS ====================
function updateAnalytics() {
  updateProgressChart();
  updatePerformanceChart();
  updateActivityChart();
  updateCompletedSubjects();
  updateTimeAllocation();
}

function updateProgressChart() {
  const total = planner.tasks.length;
  const completed = planner.tasks.filter((t) => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const html = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 48px; font-weight: 700; color: var(--primary-color);">${percentage}%</div>
                    <div style="color: var(--text-secondary); margin-top: 10px;">
                        ${completed} of ${total} tasks completed
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            `;
  document.getElementById("progressChart").innerHTML = html;
}

function updatePerformanceChart() {
  const subjectStats = planner.subjects.map((subject) => {
    const subjectTasks = planner.tasks.filter(
      (t) => t.subjectId === subject.id,
    );
    const completedCount = subjectTasks.filter((t) => t.completed).length;
    const percentage =
      subjectTasks.length === 0
        ? 0
        : Math.round((completedCount / subjectTasks.length) * 100);
    return { name: subject.name, percentage, total: subjectTasks.length };
  });

  const html = subjectStats
    .map(
      (stat) => `
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>${stat.name}</span>
                        <span style="font-weight: 600;">${stat.percentage}% (${stat.total} tasks)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${stat.percentage}%"></div>
                    </div>
                </div>
            `,
    )
    .join("");

  document.getElementById("performanceChart").innerHTML =
    html ||
    '<div style="text-align: center; color: var(--text-secondary); padding: 40px;">No data available</div>';
}

function updateActivityChart() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activityData = days.map((day) => {
    const count = planner.schedule.filter((s) =>
      (s.day === day.slice(0, 3)) === "Sun" ||
      (s.day === day.slice(0, 3)) === "Mon" ||
      (s.day === day.slice(0, 3)) === "Tue" ||
      (s.day === day.slice(0, 3)) === "Wed" ||
      (s.day === day.slice(0, 3)) === "Thu" ||
      (s.day === day.slice(0, 3)) === "Fri" ||
      (s.day === day.slice(0, 3)) === "Sat"
        ? 1
        : 0,
    ).length;
    return { day, count };
  });

  const html = `
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">
                    ${activityData
                      .map((data, idx) => {
                        const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
                        const count = planner.schedule.filter((s) => {
                          const dayMap = {
                            Monday: 0,
                            Tuesday: 1,
                            Wednesday: 2,
                            Thursday: 3,
                            Friday: 4,
                            Saturday: 5,
                            Sunday: 6,
                          };
                          return dayMap[s.day] === idx;
                        }).length;
                        return `
                            <div style="text-align: center;">
                                <div style="font-weight: 600; margin-bottom: 5px;">${dayNames[idx]}</div>
                                <div style="background: var(--primary-color); color: white; padding: 10px; border-radius: 6px; font-weight: 600;">${count}</div>
                            </div>
                        `;
                      })
                      .join("")}
                </div>
            `;
  document.getElementById("activityChart").innerHTML = html;
}

function updateCompletedSubjects() {
  const completed = planner.subjects.filter((s) => {
    const tasks = planner.tasks.filter((t) => t.subjectId === s.id);
    return tasks.length > 0 && tasks.every((t) => t.completed);
  });

  const html =
    completed.length === 0
      ? '<div style="color: var(--text-secondary); text-align: center; padding: 40px;">No completed subjects yet</div>'
      : completed
          .map(
            (s) =>
              `<div style="padding: 10px; background: var(--light-bg); border-radius: 6px; margin-bottom: 8px;">✓ ${s.name}</div>`,
          )
          .join("");

  document.getElementById("completedSubjectsList").innerHTML = html;
}

function updateTimeAllocation() {
  const timeData = planner.subjects
    .map((subject) => {
      const totalTime = planner.schedule
        .filter((s) => s.subjectId === subject.id)
        .reduce((sum, s) => sum + s.duration, 0);
      return { name: subject.name, time: totalTime };
    })
    .filter((d) => d.time > 0);

  const html =
    timeData.length === 0
      ? '<div style="color: var(--text-secondary); text-align: center; padding: 40px;">No schedule data</div>'
      : timeData
          .map(
            (d) => `
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>${d.name}</span>
                            <span style="font-weight: 600;">${d.time} mins</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(100, (d.time / 300) * 100)}%"></div>
                        </div>
                    </div>
                `,
          )
          .join("");

  document.getElementById("timeAllocationList").innerHTML = html;
}

// ==================== SETTINGS ====================
function initSettings() {
  const darkModeCheckbox = document.getElementById("darkModeCheckbox");
  const notificationsCheckbox = document.getElementById(
    "notificationsCheckbox",
  );
  const weekStartDay = document.getElementById("weekStartDay");

  darkModeCheckbox.checked = planner.settings.darkMode;
  notificationsCheckbox.checked = planner.settings.notifications;
  weekStartDay.value = planner.settings.weekStartDay;

  darkModeCheckbox.addEventListener("change", () => {
    planner.settings.darkMode = darkModeCheckbox.checked;
    applyTheme();
    planner.saveData();
  });

  notificationsCheckbox.addEventListener("change", () => {
    planner.settings.notifications = notificationsCheckbox.checked;
    planner.saveData();
  });

  weekStartDay.addEventListener("change", () => {
    planner.settings.weekStartDay = parseInt(weekStartDay.value);
    planner.saveData();
  });
}

function applyTheme() {
  const isDarkMode = planner.settings.darkMode;
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    document.getElementById("themeToggle").textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    document.getElementById("themeToggle").textContent = "🌙";
  }
}

// ==================== DATA EXPORT/IMPORT ====================
function exportData() {
  const data = planner.exportData();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `study-planner-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    if (planner.importData(content)) {
      alert("Data imported successfully!");
      location.reload();
    } else {
      alert("Error importing data. Please check the file format.");
    }
  };
  reader.readAsText(file);
}

function resetAllData() {
  if (
    confirm(
      "Are you sure? This will delete ALL your data and cannot be undone.",
    )
  ) {
    if (confirm("This action is irreversible. Click OK to confirm.")) {
      planner.resetData();
      alert("All data has been deleted.");
      location.reload();
    }
  }
}

// ==================== EVENT LISTENERS ====================
// Sidebar auto-collapse based on window width
function updateSidebarCollapse() {
  const sidebar = document.querySelector(".sidebar");
  const isAutoCollapsed = window.innerWidth <= 1100;
  const isManuallyCollapsed = localStorage.getItem("sidebarCollapsed") === "true";

  if (isAutoCollapsed) {
    sidebar.classList.add("collapsed");
    sidebar.classList.add("auto-collapsed");
  } else if (!isManuallyCollapsed) {
    sidebar.classList.remove("collapsed");
  }
  sidebar.classList.toggle("auto-collapsed", isAutoCollapsed);
}

window.addEventListener("resize", updateSidebarCollapse);

document.addEventListener("DOMContentLoaded", () => {
  // Sidebar toggle
  document.getElementById("sidebarToggle").addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapsed");
    localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));
  });

  // Restore sidebar state on page load and apply auto-collapse
  updateSidebarCollapse();
  if (localStorage.getItem("sidebarCollapsed") === "true" && window.innerWidth > 1100) {
    document.querySelector(".sidebar").classList.add("collapsed");
  }

  // Theme
  applyTheme();
  document.getElementById("themeToggle").addEventListener("click", () => {
    planner.settings.darkMode = !planner.settings.darkMode;
    document.getElementById("darkModeCheckbox").checked =
      planner.settings.darkMode;
    applyTheme();
    planner.saveData();
  });

  // Navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const sectionId = item.getAttribute("data-section");
      switchSection(sectionId);
    });
  });

  // Modal close buttons
  document.querySelectorAll(".modal-close, [data-modal]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modalId = btn.getAttribute("data-modal");
      closeModal(modalId);
    });
  });

  // Click outside modal to close
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  // Tab switching
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.getAttribute("data-tab");
      const parent = tab.closest(".tabs")?.parentElement;
      if (parent) {
        parent
          .querySelectorAll(".tab")
          .forEach((t) => t.classList.remove("active"));
        parent
          .querySelectorAll(".tab-content")
          .forEach((tc) => tc.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tabName)?.classList.add("active");
      }
    });
  });

  // Buttons
  document.getElementById("addSubjectBtn").addEventListener("click", () => {
    resetSubjectForm();
    showModal("subjectModal");
  });

  document.getElementById("addScheduleBtn").addEventListener("click", () => {
    resetScheduleForm();
    showModal("scheduleModal");
  });

  document.getElementById("addTaskBtn").addEventListener("click", () => {
    resetTaskForm();
    showModal("taskModal");
  });

  // Forms
  document
    .getElementById("subjectForm")
    .addEventListener("submit", addOrUpdateSubject);
  document
    .getElementById("scheduleForm")
    .addEventListener("submit", addOrUpdateSchedule);
  document
    .getElementById("taskForm")
    .addEventListener("submit", addOrUpdateTask);

  // Settings
  document.getElementById("exportBtn").addEventListener("click", exportData);
  document.getElementById("importBtn").addEventListener("click", () => {
    document.getElementById("importFile").click();
  });
  document.getElementById("importFile").addEventListener("change", (e) => {
    if (e.target.files[0]) {
      importData(e.target.files[0]);
    }
  });
  document.getElementById("resetBtn").addEventListener("click", resetAllData);

  // Schedule date picker
  document
    .getElementById("scheduleDate")
    .addEventListener("change", updateDailyScheduleView);

  // Initialize
  initSettings();
  updateSubjectsTable();
  updateScheduleTable();
  updateTasksTables();
  updateDashboard();
  updateAnalytics();
});

// Update dashboard on tab focus
window.addEventListener("focus", () => {
  updateDashboard();
});
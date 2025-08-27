// Utility functions
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const fmt = (d) => d.toLocaleString(undefined, { month: 'short', day: 'numeric' });
const fmtTime = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
const inSameWeek = (d, ref = new Date()) => {
  const day = new Date(ref);
  const dow = day.getDay(); // 0 Sun
  const weekStart = new Date(day); weekStart.setDate(day.getDate() - dow);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
  return d >= startOfDay(weekStart) && d <= endOfDay(weekEnd);
};
const isSoon = (d) => {
  const now = new Date();
  const diff = (d - now) / (1000*60*60);
  return diff <= 48 && diff >= 0;
};
const isOverdue = (d) => d < new Date();

// TASKS (Upcoming)
const seedTasks = [
  { id: 'hw12', title: 'HW 1.2 Integer Exponents', course: 'math', due: '2025-08-31T23:59:00', url: 'https://cedarville.instructure.com/courses/25243/assignments/498419' },
  { id: 'hw13', title: 'HW 1.3 Rational Exponents', course: 'math', due: '2025-08-31T23:59:00', url: 'https://cedarville.instructure.com/courses/25243/assignments/498432' },
  { id: 'hw14', title: 'HW 1.4 Polynomials', course: 'math', due: '2025-08-31T23:59:00', url: 'https://cedarville.instructure.com/courses/25243/assignments/498447' },
  { id: 'compForm', title: 'Formative Essay: Establishing a Baseline', course: 'comp', due: '2025-08-31T23:59:00', url: 'https://cedarville.instructure.com/courses/25136/assignments/496849' },
  { id: 'histQ1', title: 'US History Chapter 1 Quiz', course: 'hist', due: '2025-09-03T23:59:00', url: 'https://cedarville.instructure.com/courses/25307/pages/unit-1-overview?module_item_id=1399568' },
  { id: 'histQ2', title: 'US History Chapter 2 Quiz', course: 'hist', due: '2025-09-03T23:59:00', url: 'https://cedarville.instructure.com/courses/25307/pages/unit-1-overview?module_item_id=1399568' },
  { id: 'm1Written', title: 'Module 1 Written Work (Q38 upload)', course: 'math', due: '2025-09-07T23:59:00', url: 'https://cedarville.instructure.com/courses/25243/assignments/498829' },
  { id: 'm1Disc', title: 'Group Discussion: God and Mathematics', course: 'math', due: '2025-09-07T23:59:00', url: 'https://cedarville.instructure.com/courses/25243/discussion_topics/255361' },
  { id: 'exam1', title: 'Exam 1 (1.1–1.4) Remotely Proctored', course: 'math', due: '2025-09-07T23:59:00', url: 'https://cedarville.instructure.com/courses/25243/quizzes/89558' },
  { id: 'compAppraise', title: 'Researched Argument BA #1: Appraise the Project', course: 'comp', due: '2025-09-07T23:59:00', url: 'https://cedarville.instructure.com/courses/25136/pages/instructions-for-researched-argument-building-assignment-1-appraising-the-project-2?module_item_id=1397002' },
  { id: 'histTheme', title: 'US History: Capstone Theme Choice', course: 'hist', due: '2025-09-07T23:59:00', url: 'https://cedarville.instructure.com/courses/25307/pages/capstone-paper-themes?module_item_id=1399581' },
  { id: 'hw11', title: 'HW 1.1 Real Numbers — Done 98.84%', course: 'math', due: '2025-08-31T23:59:00', url: 'https://cedarville.instructure.com/courses/25243/assignments/498407', done: true }
];
const STORAGE_KEY = 'levi_dashboard_tasks_v1';
let tasks = loadTasks();

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const byId = new Map(parsed.map(t => [t.id, t]));
      seedTasks.forEach(s => { if (!byId.has(s.id)) parsed.push(s); });
      return parsed;
    } catch (_) {}
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTasks));
  return structuredClone(seedTasks);
}

function saveTasks() { 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); 
}

function getFilter() { 
  return $('#courseFilter').value; 
}

function getQuery() { 
  return ($('#searchBox').value || '').toLowerCase(); 
}

function passFilterCourseAndQuery(item) {
  const f = getFilter();
  const q = getQuery();
  const courseOK = (f === 'all' || item.course === f);
  const text = (item.title || item.label || '').toLowerCase();
  const textOK = !q || text.includes(q);
  return courseOK && textOK;
}

function coursePill(c) {
  if (c === 'math') return '<span class="pill math">Algebra</span>';
  if (c === 'comp') return '<span class="pill comp">Composition</span>';
  if (c === 'hist') return '<span class="pill hist">US History</span>';
  return '';
}

function dueBadge(due) {
  const d = new Date(due);
  if (isOverdue(d)) return `<span class="overdue">Overdue</span>`;
  if (isSoon(d)) return `<span class="soon">Soon</span>`;
  return `<span class="ok">Scheduled</span>`;
}

function renderTask(t) {
  const d = new Date(t.due);
  const link = t.url ? ` • <a class="link" href="${t.url}" target="_blank" rel="noopener">Open</a>` : '';
  return `
    <div class="task">
      <div><input type="checkbox" data-id="${t.id}" ${t.done ? 'checked' : ''} aria-label="Mark complete"/></div>
      <div>
        <div class="title ${t.done ? 'strike' : ''}">${t.title}</div>
        <div class="meta">${coursePill(t.course)} ${link}</div>
      </div>
      <div class="due" title="${d.toString()}">
        <div class="when">${fmt(d)} • ${fmtTime(d)}</div>
        <div>${dueBadge(d)}</div>
      </div>
    </div>
  `;
}

function renderLists() {
  const now = new Date();
  const thisWeek = tasks.filter(t => !t.done && inSameWeek(new Date(t.due), now) && passFilterCourseAndQuery(t))
    .sort((a,b) => new Date(a.due) - new Date(b.due));
  const nextUp = tasks.filter(t => !t.done && !inSameWeek(new Date(t.due), now) && passFilterCourseAndQuery(t))
    .sort((a,b) => new Date(a.due) - new Date(b.due));
  const done = tasks.filter(t => t.done && passFilterCourseAndQuery(t))
    .sort((a,b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));

  $('#listThisWeek').innerHTML = thisWeek.length ? thisWeek.map(renderTask).join('') : `<div class="muted small">No tasks due this week.</div>`;
  $('#listNextUp').innerHTML = nextUp.length ? nextUp.slice(0, 8).map(renderTask).join('') : `<div class="muted small">Nothing queued after this week.</div>`;
  $('#listDone').innerHTML = done.length ? done.slice(0, 10).map(renderTask).join('') : `<div class="muted small">No completed tasks yet.</div>`;

  $$('#dashboardView input[type="checkbox"][data-id]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      const t = tasks.find(x => x.id === id);
      if (t) {
        t.done = e.target.checked;
        t.completedAt = t.done ? new Date().toISOString() : null;
        saveTasks(); 
        renderLists(); 
        renderCalendar();
      }
            });
      });
      
      // Update progress bars after rendering lists
      updateProgressBars();
    }

// CALENDAR
const calDOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
let calRef = new Date();

function renderCalendarDOW() { 
  $('#calGridDOW').innerHTML = calDOW.map(d => `<div class="dow">${d}</div>`).join(''); 
}

function renderCalendar() {
  const y = calRef.getFullYear();
  const m = calRef.getMonth();
  const first = new Date(y, m, 1);
  const startIdx = first.getDay();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startIdx; i++) cells.push({ blank: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(y, m, d);
    const dayTasks = tasks.filter(t => {
      const td = new Date(t.due);
      return td.getFullYear() === y && td.getMonth() === m && td.getDate() === d && passFilterCourseAndQuery(t);
    }).sort((a,b) => new Date(a.due) - new Date(b.due));
    cells.push({ date: dayDate, items: dayTasks });
  }
  while (cells.length % 7 !== 0) cells.push({ blank: true });
  $('#calLabel').textContent = calRef.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  $('#calGrid').innerHTML = cells.map(cell => {
    if (cell.blank) return `<div class="cal-cell"></div>`;
    const dt = cell.date;
    const evts = cell.items.slice(0, 4).map(ev => `
      <div class="cal-evt ${ev.course}" title="${ev.title} — ${fmtTime(new Date(ev.due))}${ev.done ? ' (Done)' : ''}">
        ${ev.done ? '✓ ' : ''}${ev.title.length > 28 ? ev.title.slice(0, 28)+'…' : ev.title}
      </div>
    `).join('');
    return `
      <div class="cal-cell">
        <div class="cal-date">${dt.getDate()}</div>
        <div class="cal-events">${evts || ''}</div>
      </div>
    `;
  }).join('');
}

// SCHEDULE BLOCKS (minute-by-minute)
// Edit the times/labels below as you like.
const scheduleBlocks = [
  // Wednesday Aug 27, 2025 (example timeline based on our plan)
  { date: '2025-08-27', start: '09:00', end: '09:05', label: 'Setup: DND on, Canvas full screen, scratch ready', course: 'math' },
  { date: '2025-08-27', start: '09:05', end: '09:55', label: 'HW 1.2 — pass 1 (fast to slow, 2-min rule)', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/assignments/498419' },
  { date: '2025-08-27', start: '09:55', end: '10:05', label: 'Break', course: 'math' },
  { date: '2025-08-27', start: '10:05', end: '10:45', label: 'HW 1.2 — finish and submit', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/assignments/498419' },
  { date: '2025-08-27', start: '10:45', end: '10:55', label: 'Break', course: 'math' },
  { date: '2025-08-27', start: '10:55', end: '11:35', label: 'HW 1.3 — pass 1 (rational exponents, exact forms)', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/assignments/498432' },
  { date: '2025-08-27', start: '11:35', end: '11:45', label: 'Note sticky types for quick review', course: 'math' },
  { date: '2025-08-27', start: '11:45', end: '12:30', label: 'Lunch', course: 'math' },
  { date: '2025-08-27', start: '12:30', end: '12:45', label: 'Targeted refresh 1.3 misses (e-text/video snippets)', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/pages/module-1-overview?module_item_id=1400587' },
  { date: '2025-08-27', start: '12:45', end: '13:25', label: 'HW 1.3 — finish and submit', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/assignments/498432' },
  { date: '2025-08-27', start: '13:25', end: '13:35', label: 'Break', course: 'comp' },
  { date: '2025-08-27', start: '13:35', end: '14:05', label: 'Watch Composition intro + Importance of Words', course: 'comp', url: 'https://cedarville.instructure.com/courses/25136/pages/introduction-video-cyndi-messer?module_item_id=1396982' },
  { date: '2025-08-27', start: '14:05', end: '14:55', label: 'Formative Essay — draft 600–700 words', course: 'comp', url: 'https://cedarville.instructure.com/courses/25136/assignments/496849' },
  { date: '2025-08-27', start: '14:55', end: '15:05', label: 'Break', course: 'hist' },
  { date: '2025-08-27', start: '15:05', end: '15:25', label: 'US History Videos — Lectures 1–2', course: 'hist', url: 'https://cedarville.instructure.com/courses/25307/pages/unit-1-video-lectures?module_item_id=1399574' },
  { date: '2025-08-27', start: '15:25', end: '15:45', label: 'US History Videos — Lecture 3', course: 'hist', url: 'https://cedarville.instructure.com/courses/25307/pages/unit-1-video-lectures?module_item_id=1399574' },
  { date: '2025-08-27', start: '15:45', end: '16:00', label: 'Email Dr. Hammett about Exam 1 date/proctoring', course: 'math', url: 'mailto:ahammett@cedarville.edu' },

  // Thursday Aug 28, 2025
  { date: '2025-08-28', start: '09:00', end: '09:05', label: 'Setup', course: 'math' },
  { date: '2025-08-28', start: '09:05', end: '09:55', label: 'HW 1.4 — pass 1 (polynomials)', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/assignments/498447' },
  { date: '2025-08-28', start: '09:55', end: '10:05', label: 'Break', course: 'math' },
  { date: '2025-08-28', start: '10:05', end: '10:35', label: 'HW 1.4 — finish and submit', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/assignments/498447' },
  { date: '2025-08-28', start: '10:35', end: '10:45', label: 'Break', course: 'comp' },
  { date: '2025-08-28', start: '10:45', end: '11:25', label: 'Formative Essay — expand to 900–1100 words', course: 'comp', url: 'https://cedarville.instructure.com/courses/25136/assignments/496849' },
  { date: '2025-08-28', start: '11:25', end: '11:45', label: 'Tighten and submit Formative Essay', course: 'comp', url: 'https://cedarville.instructure.com/courses/25136/assignments/496849' },
  { date: '2025-08-28', start: '11:45', end: '12:30', label: 'Lunch', course: 'comp' },
  { date: '2025-08-28', start: '12:40', end: '13:00', label: 'Module 1 Written Work — read Q38, plan', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/assignments/498829' },
  { date: '2025-08-28', start: '13:00', end: '13:30', label: 'Module 1 Written Work — solve neatly', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/assignments/498829' },
  { date: '2025-08-28', start: '13:30', end: '13:45', label: 'Scan/upload PDF', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/assignments/498829' },
  { date: '2025-08-28', start: '13:55', end: '14:25', label: 'US History Videos — Lectures 4–5', course: 'hist', url: 'https://cedarville.instructure.com/courses/25307/pages/unit-1-video-lectures?module_item_id=1399574' },
  { date: '2025-08-28', start: '14:25', end: '14:45', label: 'Unit 1 Overview — outline Ch 1–2', course: 'hist', url: 'https://cedarville.instructure.com/courses/25307/pages/unit-1-overview?module_item_id=1399568' },
  { date: '2025-08-28', start: '14:45', end: '15:05', label: 'Draft 120–180 words: God and Mathematics post', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/discussion_topics/255361' },
  { date: '2025-08-28', start: '15:05', end: '15:45', label: 'Comp: Appraise the Project — brainstorm top 3 + pros/cons', course: 'comp', url: 'https://cedarville.instructure.com/courses/25136/pages/instructions-for-researched-argument-building-assignment-1-appraising-the-project-2?module_item_id=1397002' },

  // Friday Aug 29, 2025 (buffer if needed)
  { date: '2025-08-29', start: '09:00', end: '09:30', label: 'US History — Chapter 1 Quiz', course: 'hist', url: 'https://cedarville.instructure.com/courses/25307/pages/unit-1-overview?module_item_id=1399568' },
  { date: '2025-08-29', start: '09:35', end: '10:05', label: 'US History — Chapter 2 Quiz', course: 'hist', url: 'https://cedarville.instructure.com/courses/25307/pages/unit-1-overview?module_item_id=1399568' },
  { date: '2025-08-29', start: '10:15', end: '10:35', label: 'Post: God and Mathematics discussion', course: 'math', url: 'https://cedarville.instructure.com/courses/25243/discussion_topics/255361' },
  { date: '2025-08-29', start: '10:45', end: '11:30', label: 'Comp: Appraise the Project — select topic + alternate', course: 'comp', url: 'https://cedarville.instructure.com/courses/25136/pages/instructions-for-researched-argument-building-assignment-1-appraising-the-project-2?module_item_id=1397002' }
];

let dayRef = new Date();

function setDayRef(d) {
  dayRef = new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getDayKey(d) {
  return d.toISOString().slice(0,10);
}

function renderSchedule() {
  $('#dayLabel').textContent = dayRef.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  const key = getDayKey(dayRef);
  const blocks = scheduleBlocks
    .filter(b => b.date === key && passFilterCourseAndQuery({ course: b.course, title: b.label }))
    .sort((a,b) => a.start.localeCompare(b.start));
  $('#slotList').innerHTML = blocks.length ? blocks.map(renderSlot).join('') : `<div class="muted small">No blocks scheduled for this day.</div>`;
}

function renderSlot(b) {
  const link = b.url ? ` • <a class="link" href="${b.url}" target="_blank" rel="noopener">Open</a>` : '';
  return `
    <div class="slot" data-block-id="${b.date}-${b.start}">
      <div class="time">
        <span class="time-display start-time" data-time="${b.start}" data-type="start">${b.start}</span>–
        <span class="time-display end-time" data-time="${b.end}" data-type="end">${b.end}</span>
        <button class="edit-time-btn" title="Edit time">✏️</button>
      </div>
      <div>
        <div class="title">${b.label} ${link}</div>
        <div class="sub">${coursePill(b.course)}</div>
        <div class="blockline ${b.course}"></div>
      </div>
      <div></div>
    </div>
  `;
}

// View toggles
function showDashboard() {
  $('#dashboardView').style.display = '';
  $('#scheduleView').style.display = 'none';
  $('#calendarView').style.display = 'none';
  $('#btnDashboard').classList.add('active');
  $('#btnSchedule').classList.remove('active');
  $('#btnCalendar').classList.remove('active');
}

function showSchedule() {
  $('#dashboardView').style.display = 'none';
  $('#scheduleView').style.display = '';
  $('#calendarView').style.display = 'none';
  $('#btnDashboard').classList.remove('active');
  $('#btnSchedule').classList.add('active');
  $('#btnCalendar').classList.remove('active');
  renderSchedule();
}

function showCalendar() {
  $('#dashboardView').style.display = 'none';
  $('#scheduleView').style.display = 'none';
  $('#calendarView').style.display = '';
  $('#btnDashboard').classList.remove('active');
  $('#btnSchedule').classList.remove('active');
  $('#btnCalendar').classList.add('active');
  renderCalendarDOW();
  renderCalendar();
}

// Initialize the application
function init() {
  // Event listeners for view toggles
  $('#btnDashboard').addEventListener('click', showDashboard);
  $('#btnSchedule').addEventListener('click', showSchedule);
  $('#btnCalendar').addEventListener('click', showCalendar);

  // Event listeners for filters and search
  $('#courseFilter').addEventListener('change', () => { 
    renderLists(); 
    renderCalendar(); 
    renderSchedule(); 
  });
  $('#searchBox').addEventListener('input', () => { 
    renderLists(); 
    renderCalendar(); 
    renderSchedule(); 
  });

  // Calendar navigation
  $('#prevMonth').addEventListener('click', () => { 
    calRef.setMonth(calRef.getMonth()-1); 
    renderCalendar(); 
  });
  $('#nextMonth').addEventListener('click', () => { 
    calRef.setMonth(calRef.getMonth()+1); 
    renderCalendar(); 
  });
  $('#todayBtn').addEventListener('click', () => { 
    calRef = new Date(); 
    renderCalendar(); 
  });

  // Schedule navigation
  $('#prevDay').addEventListener('click', () => { 
    dayRef.setDate(dayRef.getDate()-1); 
    renderSchedule(); 
  });
  $('#nextDay').addEventListener('click', () => { 
    dayRef.setDate(dayRef.getDate()+1); 
    renderSchedule(); 
  });
  $('#todayDay').addEventListener('click', () => { 
    setDayRef(new Date()); 
    renderSchedule(); 
  });

      // Initial render
    renderLists();
    renderCalendarDOW();
    renderCalendar();
    setDayRef(new Date());
    renderSchedule();
    
    // Setup additional features
    setupTimeEditing();
    
    // Add export button event listener
    const exportBtn = document.getElementById('exportICS');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportToICS);
    }
    
    // Setup quick add task functionality
    setupQuickAddTask();
    
    // Update progress bars
    updateProgressBars();
  }

// Inline time editing functionality
function setupTimeEditing() {
  // Handle edit button clicks
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-time-btn')) {
      const slot = e.target.closest('.slot');
      const startTime = slot.querySelector('.start-time');
      const endTime = slot.querySelector('.end-time');
      
      // Create time inputs
      const startInput = document.createElement('input');
      startInput.type = 'time';
      startInput.value = startTime.dataset.time;
      startInput.className = 'time-input';
      
      const endInput = document.createElement('input');
      endInput.type = 'time';
      endInput.value = endTime.dataset.time;
      endInput.className = 'time-input';
      
      // Replace time displays with inputs
      startTime.style.display = 'none';
      endTime.style.display = 'none';
      e.target.style.display = 'none';
      
      const timeContainer = slot.querySelector('.time');
      timeContainer.appendChild(startInput);
      timeContainer.appendChild(document.createTextNode('–'));
      timeContainer.appendChild(endInput);
      
      // Add save button
      const saveBtn = document.createElement('button');
      saveBtn.textContent = '💾';
      saveBtn.className = 'save-time-btn';
      saveBtn.title = 'Save changes';
      timeContainer.appendChild(saveBtn);
      
      // Focus on first input
      startInput.focus();
      
      // Handle save
      saveBtn.addEventListener('click', function() {
        const newStart = startInput.value;
        const newEnd = endInput.value;
        
        if (newStart && newEnd && newStart < newEnd) {
          // Update the scheduleBlocks array
          const blockId = slot.dataset.blockId;
          const [date, oldStart] = blockId.split('-');
          const block = scheduleBlocks.find(b => b.date === date && b.start === oldStart);
          
          if (block) {
            block.start = newStart;
            block.end = newEnd;
            
            // Update localStorage
            localStorage.setItem('levi_dashboard_schedule_blocks', JSON.stringify(scheduleBlocks));
            
            // Update display
            startTime.textContent = newStart;
            startTime.dataset.time = newStart;
            endTime.textContent = newEnd;
            endTime.dataset.time = newEnd;
            
            // Update block ID
            slot.dataset.blockId = `${date}-${newStart}`;
            
            // Show success message
            showNotification('Time updated successfully!', 'success');
          }
        } else {
          showNotification('Invalid time range!', 'error');
        }
        
        // Restore original display
        startTime.style.display = '';
        endTime.style.display = '';
        e.target.style.display = '';
        startInput.remove();
        endInput.remove();
        saveBtn.remove();
        timeContainer.appendChild(document.createTextNode('–'));
      });
    }
  });
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// .ics Export functionality
function exportToICS() {
  const events = [];
  
  // Add tasks
  tasks.forEach(task => {
    if (!task.done) {
      const dueDate = new Date(task.due);
      events.push({
        id: task.id,
        start: dueDate,
        end: new Date(dueDate.getTime() + 60 * 60 * 1000), // 1 hour duration
        summary: task.title,
        description: `Course: ${getCourseName(task.course)}`,
        location: 'Canvas',
        url: task.url
      });
    }
  });
  
  // Add schedule blocks
  scheduleBlocks.forEach(block => {
    const blockDate = new Date(block.date);
    const [startHour, startMin] = block.start.split(':').map(Number);
    const [endHour, endMin] = block.end.split(':').map(Number);
    
    const startTime = new Date(blockDate);
    startTime.setHours(startHour, startMin, 0, 0);
    
    const endTime = new Date(blockDate);
    endTime.setHours(endHour, endMin, 0, 0);
    
    events.push({
      id: `${block.date}-${block.start}`,
      start: startTime,
      end: endTime,
      summary: block.label,
      description: `Course: ${getCourseName(block.course)}`,
      location: 'Scheduled Block',
      url: block.url
    });
  });
  
  // Generate .ics content
  let icsContent = 'BEGIN:VCALENDAR\r\n';
  icsContent += 'VERSION:2.0\r\n';
  icsContent += 'PRODID:-//Levi Course Dashboard//EN\r\n';
  icsContent += 'CALSCALE:GREGORIAN\r\n';
  icsContent += 'METHOD:PUBLISH\r\n';
  
  events.forEach(event => {
    icsContent += 'BEGIN:VEVENT\r\n';
    icsContent += `UID:${event.id}@levi-dashboard\r\n`;
    icsContent += `DTSTAMP:${formatICSDate(new Date())}\r\n`;
    icsContent += `DTSTART:${formatICSDate(event.start)}\r\n`;
    icsContent += `DTEND:${formatICSDate(event.end)}\r\n`;
    icsContent += `SUMMARY:${escapeICSField(event.summary)}\r\n`;
    icsContent += `DESCRIPTION:${escapeICSField(event.description)}\r\n`;
    icsContent += `LOCATION:${escapeICSField(event.location)}\r\n`;
    if (event.url) {
      icsContent += `URL:${event.url}\r\n`;
    }
    icsContent += 'END:VEVENT\r\n';
  });
  
  icsContent += 'END:VCALENDAR';
  
  // Download the file
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `levi-course-schedule-${new Date().toISOString().split('T')[0]}.ics`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  
  showNotification('Calendar exported successfully!', 'success');
}

function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeICSField(field) {
  return field.replace(/[\\;,]/g, '\\$&').replace(/\r\n/g, '\\n').replace(/\n/g, '\\n');
}

function getCourseName(courseCode) {
  const courseNames = {
    'math': 'College Algebra',
    'comp': 'Composition',
    'hist': 'US History'
  };
  return courseNames[courseCode] || courseCode;
}

// Quick Add Task functionality
function setupQuickAddTask() {
  const quickAddBtn = document.getElementById('quickAddBtn');
  const titleInput = document.getElementById('quickTaskTitle');
  const courseSelect = document.getElementById('quickTaskCourse');
  const dueInput = document.getElementById('quickTaskDue');
  
  // Set default due date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 0, 0);
  dueInput.value = tomorrow.toISOString().slice(0, 16);
  
  quickAddBtn.addEventListener('click', function() {
    const title = titleInput.value.trim();
    const course = courseSelect.value;
    const due = dueInput.value;
    
    if (!title || !due) {
      showNotification('Please fill in all fields!', 'error');
      return;
    }
    
    // Create new task
    const newTask = {
      id: 'quick_' + Date.now(),
      title: title,
      course: course,
      due: new Date(due).toISOString(),
      url: null
    };
    
    // Add to tasks array
    tasks.push(newTask);
    saveTasks();
    
    // Clear form
    titleInput.value = '';
    dueInput.value = tomorrow.toISOString().slice(0, 16);
    
    // Refresh display
    renderLists();
    renderCalendar();
    updateProgressBars();
    
    showNotification('Task added successfully!', 'success');
  });
}

// Progress tracking
function updateProgressBars() {
  const now = new Date();
  const thisWeekTasks = tasks.filter(t => !t.done && inSameWeek(new Date(t.due), now));
  const thisWeekDone = tasks.filter(t => t.done && inSameWeek(new Date(t.due), now));
  const totalTasks = tasks.filter(t => !t.done);
  const totalDone = tasks.filter(t => t.done);
  
  // Calculate percentages
  const weekProgress = thisWeekTasks.length > 0 ? (thisWeekDone.length / (thisWeekTasks.length + thisWeekDone.length)) * 100 : 0;
  const overallProgress = totalTasks.length > 0 ? (totalDone.length / (totalTasks.length + totalDone.length)) * 100 : 0;
  
  // Update progress bars
  const weekProgressBar = document.getElementById('weekProgress');
  const overallProgressBar = document.getElementById('overallProgress');
  const weekProgressText = document.getElementById('weekProgressText');
  const overallProgressText = document.getElementById('overallProgressText');
  
  if (weekProgressBar && overallProgressBar) {
    weekProgressBar.style.width = weekProgress + '%';
    overallProgressBar.style.width = overallProgress + '%';
    
    if (weekProgressText && overallProgressText) {
      weekProgressText.textContent = `${thisWeekDone.length}/${thisWeekTasks.length + thisWeekDone.length}`;
      overallProgressText.textContent = `${totalDone.length}/${totalTasks.length + totalDone.length}`;
    }
  }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

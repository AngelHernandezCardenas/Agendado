const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
const shortDays = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const defaultSchedule = {
  1: [{ start: '06:00', end: '07:00', task: 'JavaScript: fundamentos', activity: 'JavaScript' }, { start: '15:00', end: '16:00', task: 'Python: práctica guiada', activity: 'Python' }, { start: '16:15', end: '17:15', task: 'Automatización: flujo sencillo', activity: 'Automatización' }],
  2: [{ start: '06:00', end: '07:00', task: 'Python: estructuras de datos', activity: 'Python' }, { start: '15:00', end: '16:00', task: 'C++: sintaxis y lógica', activity: 'C++' }, { start: '16:15', end: '17:15', task: 'JavaScript: DOM', activity: 'JavaScript' }],
  3: [{ start: '06:00', end: '07:00', task: 'C++: ejercicios', activity: 'C++' }, { start: '15:00', end: '16:00', task: 'Python: mini proyecto', activity: 'Python' }, { start: '16:15', end: '17:15', task: 'Automatización: repaso', activity: 'Automatización' }],
  4: [{ start: '16:00', end: '17:00', task: 'JavaScript: interfaz', activity: 'JavaScript' }, { start: '17:15', end: '18:15', task: 'C++: funciones', activity: 'C++' }],
  5: [{ start: '16:00', end: '17:00', task: 'Python: proyecto semanal', activity: 'Python' }, { start: '17:15', end: '18:15', task: 'Automatización: práctica', activity: 'Automatización' }],
  6: [{ start: '10:00', end: '11:00', task: 'Repaso libre: JavaScript', activity: 'JavaScript' }],
  0: [{ start: '10:00', end: '11:00', task: 'Planear la semana', activity: 'Automatización' }]
};
let schedule = JSON.parse(localStorage.getItem('recordatorios-schedule')) || defaultSchedule;
Object.values(schedule).flat().forEach((item) => { if (!item.activity && item.language) item.activity = item.language; });
let selectedDay = new Date().getDay();
const $ = (id) => document.getElementById(id);
Object.values(schedule).flat().forEach((item) => { if (!item.id) item.id = Date.now() + Math.random(); });

function formatTime(time) { return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' }); }
function currentMinutes() { const now = new Date(); return now.getHours() * 60 + now.getMinutes(); }
function minutes(time) { const [hours, mins] = time.split(':').map(Number); return hours * 60 + mins; }
function isPauseWindow() { return selectedDay >= 1 && selectedDay <= 3 && currentMinutes() >= 420 && currentMinutes() < 900; }
function timeOptions(interval, selectedValues = []) {
  const values = new Set(selectedValues);
  for (let total = 0; total < 24 * 60; total += interval) {
    const hours = String(Math.floor(total / 60)).padStart(2, '0');
    const mins = String(total % 60).padStart(2, '0');
    values.add(`${hours}:${mins}`);
  }
  return [...values].sort().map((value) => `<option value="${value}" ${selectedValues.includes(value) ? 'selected' : ''}>${formatTime(value)}</option>`).join('');
}
function populateTimeOptions(interval, selectedStart = '', selectedEnd = '') {
  const values = [selectedStart, selectedEnd].filter(Boolean);
  const options = timeOptions(interval, values);
  $('session-start').innerHTML = options;
  $('session-end').innerHTML = options;
  if (selectedStart) $('session-start').value = selectedStart;
  if (selectedEnd) $('session-end').value = selectedEnd;
}
function selectedDays() { return [...document.querySelectorAll('input[name="session-days"]:checked')].map((input) => Number(input.value)); }
function renderDayOptions(days = [selectedDay]) {
  $('day-options').innerHTML = dayNames.map((name, index) => `<label><input type="checkbox" name="session-days" value="${index}" ${days.includes(index) ? 'checked' : ''}>${name}</label>`).join('');
}
function applyDayRange(range) {
  const ranges = { weekdays: [1, 2, 3, 4, 5], weekend: [0, 6], 'monday-saturday': [1, 2, 3, 4, 5, 6], everyday: [0, 1, 2, 3, 4, 5, 6] };
  if (ranges[range]) renderDayOptions(ranges[range]);
}

function renderTabs() {
  $('day-tabs').innerHTML = dayNames.map((name, index) => `<button class="day-tab ${index === selectedDay ? 'active' : ''}" data-day="${index}">${shortDays[index]}<small>${index === new Date().getDay() ? 'HOY' : ''}</small></button>`).join('');
  document.querySelectorAll('.day-tab').forEach((tab) => tab.addEventListener('click', () => { selectedDay = Number(tab.dataset.day); renderTabs(); renderSchedule(); updateStatus(); }));
}
function renderSchedule() {
  const sessions = [...(schedule[selectedDay] || [])].sort((a, b) => a.start.localeCompare(b.start));
  $('schedule-list').innerHTML = sessions.length ? sessions.map((item) => `<div class="schedule-row"><div class="time">${formatTime(item.start)}<br><span>↓ ${formatTime(item.end)}</span></div><div class="task"><strong>${item.task}</strong><span>${item.activity || item.language}</span></div><div class="alarm"><span>◷ aviso activo</span><span class="row-actions"><button class="icon-button edit-session" type="button" data-id="${item.id}">Editar</button><button class="icon-button delete-session" type="button" data-id="${item.id}">×</button></span></div></div>`).join('') : '<div class="empty-state">Día libre. También descansar es parte del plan.</div>';
  document.querySelectorAll('.edit-session').forEach((button) => button.addEventListener('click', () => openSessionDialog(button.dataset.id)));
  document.querySelectorAll('.delete-session').forEach((button) => button.addEventListener('click', () => deleteSession(button.dataset.id)));
}
function updateStatus() {
  const now = currentMinutes(); const sessions = [...(schedule[selectedDay] || [])].sort((a, b) => a.start.localeCompare(b.start));
  const active = sessions.find((item) => now >= minutes(item.start) && now < minutes(item.end));
  const next = sessions.find((item) => minutes(item.start) > now);
  const pause = isPauseWindow();
  if (selectedDay === new Date().getDay() && pause) { $('status-title').textContent = 'Pausa de la mañana'; $('status-description').textContent = 'Lunes a miércoles: retomamos el estudio a las 3:00 p. m.'; $('status-dot').style.background = '#f4d35e'; }
  else if (active && selectedDay === new Date().getDay()) { $('status-title').textContent = `En curso: ${active.task}`; $('status-description').textContent = `Concéntrate hasta las ${formatTime(active.end)}. Un bloque a la vez.`; $('status-dot').style.background = '#b8e0d2'; }
  else { $('status-title').textContent = selectedDay === new Date().getDay() ? 'Todo listo para estudiar' : `Plan de ${dayNames[selectedDay].toLowerCase()}`; $('status-description').textContent = selectedDay === new Date().getDay() ? 'Revisa tu siguiente bloque y prepara tu espacio.' : 'Consulta o ajusta las tareas de este día.'; $('status-dot').style.background = '#f4d35e'; }
  $('next-block-label').textContent = next ? `${formatTime(next.start)} · ${next.task}` : 'Sin más bloques';
}
function updateClock() { const now = new Date(); $('clock').textContent = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }); $('date-label').textContent = now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }); updateStatus(); }
function saveSchedule() { localStorage.setItem('recordatorios-schedule', JSON.stringify(schedule)); }
function openSessionDialog(sessionId = null) {
  const session = sessionId ? (schedule[selectedDay] || []).find((item) => String(item.id) === String(sessionId)) : null;
  $('session-form').dataset.editingId = session ? session.id : '';
  $('dialog-eyebrow').textContent = session ? 'EDITAR BLOQUE' : 'NUEVO BLOQUE';
  $('dialog-title').textContent = session ? 'Ajusta tu tarea' : 'Agrega una tarea';
  $('day-range').value = 'custom'; renderDayOptions([selectedDay]);
  const start = session?.start || '16:00'; const end = session?.end || '17:00';
  $('time-interval').value = '5'; populateTimeOptions(Number($('time-interval').value), start, end);
  $('session-task').value = session?.task || ''; $('session-activity').value = session?.activity || session?.language || 'Python'; $('form-error').textContent = '';
  $('session-dialog').showModal();
}
function deleteSession(sessionId) {
  if (!window.confirm('¿Eliminar este bloque del horario?')) return;
  schedule[selectedDay] = (schedule[selectedDay] || []).filter((item) => String(item.id) !== String(sessionId)); saveSchedule(); renderSchedule(); updateStatus();
}
function notifyIfBlockStarts() {
  if (selectedDay !== new Date().getDay()) return;
  const session = (schedule[selectedDay] || []).find((item) => minutes(item.start) === currentMinutes());
  if (!session) return;
  const key = `recordatorios-notified-${new Date().toISOString().slice(0, 10)}-${session.start}-${session.task}`;
  if (localStorage.getItem(key)) return;
  localStorage.setItem(key, 'true');
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Agendado · Ahora', { body: `${session.task} (${formatTime(session.start)} - ${formatTime(session.end)})` });
  }
  fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Agendado · Ahora', message: `${session.task} (${formatTime(session.start)} - ${formatTime(session.end)})` }) }).catch(() => {});
}

$('add-session').addEventListener('click', () => openSessionDialog());
$('day-range').addEventListener('change', () => applyDayRange($('day-range').value));
$('time-interval').addEventListener('change', () => { populateTimeOptions(Number($('time-interval').value), $('session-start').value, $('session-end').value); });
$('session-form').addEventListener('submit', (event) => { event.preventDefault(); const days = selectedDays(); const start = $('session-start').value; const end = $('session-end').value; const task = $('session-task').value.trim(); if (!days.length) { $('form-error').textContent = 'Selecciona al menos un día.'; return; } if (!task || !start || !end || minutes(end) <= minutes(start)) { $('form-error').textContent = 'Escribe una tarea y usa una hora final posterior a la inicial.'; return; } const editingId = $('session-form').dataset.editingId; const updatedSession = { id: editingId ? Number(editingId) : Date.now(), start, end, task, activity: $('session-activity').value }; if (editingId) { Object.keys(schedule).forEach((key) => { schedule[key] = schedule[key].filter((item) => String(item.id) !== String(editingId)); }); } days.forEach((day) => { schedule[day] = schedule[day] || []; schedule[day].push({ ...updatedSession }); }); saveSchedule(); selectedDay = days[0]; $('session-dialog').close(); renderTabs(); renderSchedule(); updateStatus(); });
$('new-note').addEventListener('click', () => { const notes = ['Hazlo sencillo, pero hazlo hoy.', 'Tu yo del futuro agradece este bloque.', 'Constancia primero, velocidad después.', 'Un ejercicio más y cierras el cuaderno.']; $('daily-note').textContent = notes[Math.floor(Math.random() * notes.length)]; });
$('request-notification').addEventListener('click', async () => { if (!('Notification' in window)) { $('notification-status').textContent = 'Este navegador no admite notificaciones.'; return; } const permission = await Notification.requestPermission(); if (permission === 'granted') { $('notification-status').textContent = 'Permiso concedido. Recibirás avisos al comenzar cada actividad.'; new Notification('Agendado', { body: 'Las notificaciones están activadas.' }); } else { $('notification-status').textContent = 'El permiso de notificaciones no fue concedido.'; } });

renderTabs(); renderSchedule(); updateClock(); notifyIfBlockStarts(); setInterval(() => { updateClock(); notifyIfBlockStarts(); }, 30000);

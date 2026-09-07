const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
const shortDays = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const defaultSchedule = {
  1: [{ start: '06:00', end: '07:00', task: 'JavaScript: fundamentos', language: 'JavaScript' }, { start: '15:00', end: '16:00', task: 'Python: práctica guiada', language: 'Python' }, { start: '16:15', end: '17:15', task: 'Automatización: flujo sencillo', language: 'Automatización' }],
  2: [{ start: '06:00', end: '07:00', task: 'Python: estructuras de datos', language: 'Python' }, { start: '15:00', end: '16:00', task: 'C++: sintaxis y lógica', language: 'C++' }, { start: '16:15', end: '17:15', task: 'JavaScript: DOM', language: 'JavaScript' }],
  3: [{ start: '06:00', end: '07:00', task: 'C++: ejercicios', language: 'C++' }, { start: '15:00', end: '16:00', task: 'Python: mini proyecto', language: 'Python' }, { start: '16:15', end: '17:15', task: 'Automatización: repaso', language: 'Automatización' }],
  4: [{ start: '16:00', end: '17:00', task: 'JavaScript: interfaz', language: 'JavaScript' }, { start: '17:15', end: '18:15', task: 'C++: funciones', language: 'C++' }],
  5: [{ start: '16:00', end: '17:00', task: 'Python: proyecto semanal', language: 'Python' }, { start: '17:15', end: '18:15', task: 'Automatización: práctica', language: 'Automatización' }],
  6: [{ start: '10:00', end: '11:00', task: 'Repaso libre: JavaScript', language: 'JavaScript' }],
  0: [{ start: '10:00', end: '11:00', task: 'Planear la semana', language: 'Automatización' }]
};
let schedule = JSON.parse(localStorage.getItem('recordatorios-schedule')) || defaultSchedule;
let selectedDay = new Date().getDay();
const $ = (id) => document.getElementById(id);
Object.values(schedule).flat().forEach((item) => { if (!item.id) item.id = Date.now() + Math.random(); });

function formatTime(time) { return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' }); }
function currentMinutes() { const now = new Date(); return now.getHours() * 60 + now.getMinutes(); }
function minutes(time) { const [hours, mins] = time.split(':').map(Number); return hours * 60 + mins; }
function isPauseWindow() { return selectedDay >= 1 && selectedDay <= 3 && currentMinutes() >= 420 && currentMinutes() < 900; }

function renderTabs() {
  $('day-tabs').innerHTML = dayNames.map((name, index) => `<button class="day-tab ${index === selectedDay ? 'active' : ''}" data-day="${index}">${shortDays[index]}<small>${index === new Date().getDay() ? 'HOY' : ''}</small></button>`).join('');
  document.querySelectorAll('.day-tab').forEach((tab) => tab.addEventListener('click', () => { selectedDay = Number(tab.dataset.day); renderTabs(); renderSchedule(); updateStatus(); }));
}
function renderSchedule() {
  const sessions = [...(schedule[selectedDay] || [])].sort((a, b) => a.start.localeCompare(b.start));
  $('schedule-list').innerHTML = sessions.length ? sessions.map((item) => `<div class="schedule-row"><div class="time">${formatTime(item.start)}<br><span>↓ ${formatTime(item.end)}</span></div><div class="task"><strong>${item.task}</strong><span>${item.language}</span></div><div class="alarm"><span>◷ aviso activo</span><span class="row-actions"><button class="icon-button edit-session" type="button" data-id="${item.id}">Editar</button><button class="icon-button delete-session" type="button" data-id="${item.id}">×</button></span></div></div>`).join('') : '<div class="empty-state">Día libre. También descansar es parte del plan.</div>';
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
  $('session-day').innerHTML = dayNames.map((name, index) => `<option value="${index}" ${index === selectedDay ? 'selected' : ''}>${name}</option>`).join('');
  $('session-start').value = session?.start || '16:00'; $('session-end').value = session?.end || '17:00';
  $('session-task').value = session?.task || ''; $('session-language').value = session?.language || 'JavaScript'; $('form-error').textContent = '';
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
  fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Agendado · Ahora', message: `${session.task} (${formatTime(session.start)} - ${formatTime(session.end)})` }) }).catch(() => {});
}

$('add-session').addEventListener('click', () => openSessionDialog());
$('session-form').addEventListener('submit', (event) => { event.preventDefault(); const day = Number($('session-day').value); const start = $('session-start').value; const end = $('session-end').value; const task = $('session-task').value.trim(); if (!task || !start || !end || minutes(end) <= minutes(start)) { $('form-error').textContent = 'Escribe una tarea y usa una hora final posterior a la inicial.'; return; } const editingId = $('session-form').dataset.editingId; schedule[day] = schedule[day] || []; const updatedSession = { id: editingId ? Number(editingId) : Date.now(), start, end, task, language: $('session-language').value }; if (editingId) { Object.keys(schedule).forEach((key) => { schedule[key] = schedule[key].filter((item) => String(item.id) !== String(editingId)); }); } schedule[day].push(updatedSession); saveSchedule(); selectedDay = day; $('session-dialog').close(); renderTabs(); renderSchedule(); updateStatus(); });
$('new-note').addEventListener('click', () => { const notes = ['Hazlo sencillo, pero hazlo hoy.', 'Tu yo del futuro agradece este bloque.', 'Constancia primero, velocidad después.', 'Un ejercicio más y cierras el cuaderno.']; $('daily-note').textContent = notes[Math.floor(Math.random() * notes.length)]; });
$('test-notification').addEventListener('click', async () => { try { const response = await fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Agendado', message: 'Este es un aviso de prueba. Tu próximo bloque te espera.' }) }); $('notification-status').textContent = response.ok ? 'Aviso enviado a Windows correctamente.' : 'El servidor respondió con un error.'; } catch { $('notification-status').textContent = 'Abre la app con python server.py para activar avisos.'; } });

renderTabs(); renderSchedule(); updateClock(); notifyIfBlockStarts(); setInterval(() => { updateClock(); notifyIfBlockStarts(); }, 30000);

const DEFAULT_SITES = [
  { name: "Facebook", url: "facebook.com", icon: "f", color: "#1877f2" },
  { name: "YouTube", url: "youtube.com", icon: "▶", color: "#e52222" },
  { name: "Discord", url: "discord.com/app", icon: "◉", color: "#5865f2" },
  { name: "Gmail", url: "mail.google.com", icon: "M", color: "#e65b4d" },
  { name: "Google Drive", url: "drive.google.com", icon: "△", color: "#36a852" },
  { name: "GitHub", url: "github.com", icon: "◆", color: "#596674" }
];

const QUOTES = [
  "Tập trung vào điều quan trọng, rồi làm nó thật tốt.",
  "Sự nhất quán biến kế hoạch nhỏ thành kết quả lớn.",
  "Đừng chờ cảm hứng. Hãy bắt đầu, rồi cảm hứng sẽ đến.",
  "Hôm nay là một cơ hội mới để xây điều bạn muốn thấy.",
  "Làm chậm, làm đúng, và làm đến cùng."
];

const WEATHER_CODES = {
  0: ["☀", "Trời quang"], 1: ["🌤", "Chủ yếu quang đãng"], 2: ["⛅", "Có mây rải rác"],
  3: ["☁", "Nhiều mây"], 45: ["🌫", "Sương mù"], 48: ["🌫", "Sương mù đóng băng"],
  51: ["🌦", "Mưa phùn nhẹ"], 53: ["🌦", "Mưa phùn"], 55: ["🌧", "Mưa phùn dày"],
  56: ["🌧", "Mưa phùn băng giá"], 57: ["🌧", "Mưa phùn băng giá mạnh"],
  61: ["🌦", "Mưa nhẹ"], 63: ["🌧", "Mưa vừa"], 65: ["🌧", "Mưa to"],
  66: ["🌧", "Mưa băng giá"], 67: ["🌧", "Mưa băng giá mạnh"],
  71: ["🌨", "Tuyết nhẹ"], 73: ["🌨", "Tuyết vừa"], 75: ["❄", "Tuyết dày"],
  77: ["❄", "Hạt tuyết"], 80: ["🌦", "Mưa rào nhẹ"], 81: ["🌧", "Mưa rào"],
  82: ["⛈", "Mưa rào mạnh"], 85: ["🌨", "Mưa tuyết nhẹ"], 86: ["🌨", "Mưa tuyết mạnh"],
  95: ["⛈", "Dông"], 96: ["⛈", "Dông kèm mưa đá"], 99: ["⛈", "Dông mạnh kèm mưa đá"]
};

const WEATHER_LOCATION = {
  latitude: 11.311,
  longitude: 106.094,
  label: "Xã Đức Hòa, Tây Ninh"
};

const state = {
  calendarDate: new Date(),
  selectedDateKey: "",
  sites: JSON.parse(localStorage.getItem("tdv-sites") || "null") || DEFAULT_SITES,
  notes: JSON.parse(localStorage.getItem("tdv-calendar-notes") || "{}")
};

const $ = (selector) => document.querySelector(selector);
const pad = (number) => String(number).padStart(2, "0");

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
}

function normalizeUrl(value) {
  const input = value.trim();
  if (!input) return "";
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(input)) return input;
  return `https://${input}`;
}

function getDisplayUrl(value) {
  return value.replace(/^[a-z][a-z\d+.-]*:\/\//i, "").replace(/\/$/, "");
}

function looksLikeUrl(value) {
  const text = value.trim();
  if (!text || /\s/.test(text)) return false;
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(text)) return true;
  if (/^localhost(?::\d+)?(?:\/.*)?$/i.test(text)) return true;
  if (/^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/.*)?$/.test(text)) return true;
  return /^(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,}(?::\d+)?(?:\/[^\s]*)?$/i.test(text);
}

function submitSmartSearch(event) {
  event.preventDefault();
  const query = $("#search-input").value.trim();
  if (!query) return;
  window.location.assign(looksLikeUrl(query) ? normalizeUrl(query) : `https://www.google.com/search?q=${encodeURIComponent(query)}`);
}

function dateKey(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function formatNoteDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .format(new Date(year, month - 1, day))
    .replace(/^./, (char) => char.toUpperCase());
}

function saveNotes() {
  localStorage.setItem("tdv-calendar-notes", JSON.stringify(state.notes));
}

function updateTime() {
  const now = new Date();
  $("#clock").textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  $("#full-date").textContent = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .format(now).replace(/^./, (char) => char.toUpperCase());
  const hour = now.getHours();
  $("#greeting").textContent = hour < 11 ? "CHÀO BUỔI SÁNG" : hour < 14 ? "CHÀO BUỔI TRƯA" : hour < 18 ? "CHÀO BUỔI CHIỀU" : "CHÀO BUỔI TỐI";
}

function renderCalendar() {
  const display = state.calendarDate;
  const year = display.getFullYear();
  const month = display.getMonth();
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();

  $("#calendar-title").textContent = new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" })
    .format(display).replace(/^./, (char) => char.toUpperCase());

  let html = "";
  for (let index = firstDay - 1; index >= 0; index--) html += `<button type="button" class="muted-day" tabindex="-1">${previousMonthDays - index}</button>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(year, month, day);
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const hasNote = state.notes[key]?.length > 0;
    html += `<button type="button" class="calendar-day${isToday ? " today" : ""}${hasNote ? " has-note" : ""}" data-date="${key}" title="${hasNote ? `${state.notes[key].length} ghi chú` : "Thêm ghi chú"}"><span class="day-number">${day}</span></button>`;
  }
  const remaining = (7 - (firstDay + daysInMonth) % 7) % 7;
  for (let day = 1; day <= remaining; day++) html += `<button type="button" class="muted-day" tabindex="-1">${day}</button>`;
  $("#calendar-days").innerHTML = html;

  document.querySelectorAll(".calendar-day").forEach((button) => {
    button.addEventListener("click", () => openNotes(button.dataset.date));
  });
}

async function loadWeather() {
  $("#weather-place").textContent = WEATHER_LOCATION.label;
  try {
    const { latitude, longitude } = WEATHER_LOCATION;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FBangkok`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather request failed");
    const weather = await response.json();
    const current = weather.current;
    const [icon, description] = WEATHER_CODES[current.weather_code] || ["◌", "Không xác định"];
    $("#weather-icon").textContent = icon;
    $("#temperature").textContent = Math.round(current.temperature_2m);
    $("#weather-description").textContent = description;
    $("#apparent-temperature").textContent = `${Math.round(current.apparent_temperature)}°`;
    $("#humidity").textContent = `${current.relative_humidity_2m}%`;
    $("#wind-speed").textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  } catch {
    $("#weather-icon").textContent = "◌";
    $("#temperature").textContent = "--";
    $("#weather-description").textContent = "Không tải được thời tiết";
    $("#apparent-temperature").textContent = "--";
    $("#humidity").textContent = "--";
    $("#wind-speed").textContent = "--";
  }
}

function renderSites() {
  const grid = $("#site-grid");
  const template = $("#site-template");
  grid.innerHTML = "";
  state.sites.forEach((site) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".site-card");
    const icon = node.querySelector(".site-icon");
    card.href = normalizeUrl(site.url);
    icon.textContent = site.icon || site.name.slice(0, 1).toUpperCase();
    icon.style.setProperty("--site-color", site.color || "#41516a");
    node.querySelector("h3").textContent = site.name;
    node.querySelector("p").textContent = getDisplayUrl(site.url);
    grid.appendChild(node);
  });
  $("#site-count").textContent = `${state.sites.length} trang web`;
}

function renderSettingsSites() {
  const container = $("#site-settings");
  container.innerHTML = "";
  state.sites.forEach((site) => addSettingsRow(site));
}

function addSettingsRow(site = { name: "Trang web mới", url: "" }) {
  const row = document.createElement("div");
  row.className = "site-setting-row";
  row.innerHTML = `
    <input class="setting-site-name" aria-label="Tên trang web" value="${escapeHtml(site.name)}" placeholder="Tên trang web" />
    <input class="setting-site-url" aria-label="URL trang web" value="${escapeHtml(site.url)}" placeholder="facebook.com hoặc https://..." />
    <button type="button" class="remove-site" title="Xóa trang web">×</button>
  `;
  row.querySelector(".remove-site").addEventListener("click", () => row.remove());
  $("#site-settings").appendChild(row);
}

function openSettings() {
  renderSettingsSites();
  $("#settings-dialog").showModal();
}

function saveSettings() {
  const existing = state.sites;
  state.sites = [...document.querySelectorAll(".site-setting-row")].map((row, index) => ({
    name: row.querySelector(".setting-site-name").value.trim(),
    url: row.querySelector(".setting-site-url").value.trim(),
    icon: existing[index]?.icon || "◆",
    color: existing[index]?.color || "#41516a"
  })).filter((site) => site.name && site.url);
  localStorage.setItem("tdv-sites", JSON.stringify(state.sites));
  renderSites();
}

function getNotesForSelectedDate() {
  return state.notes[state.selectedDateKey] || [];
}

function sortNotes(notes) {
  return [...notes].sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
}

function renderNotes() {
  const container = $("#note-list");
  const notes = sortNotes(getNotesForSelectedDate());
  container.innerHTML = "";

  if (!notes.length) {
    container.innerHTML = `<p class="empty-notes">Chưa có ghi chú cho ngày này.<br>Thêm việc cần làm, lịch hẹn hoặc một lời nhắc ở bên dưới.</p>`;
    return;
  }

  const template = $("#note-template");
  notes.forEach((note) => {
    const node = template.content.cloneNode(true);
    const item = node.querySelector(".note-item");
    item.dataset.noteId = note.id;
    node.querySelector(".note-time").textContent = note.time || "";
    node.querySelector("h3").textContent = note.title;
    node.querySelector("p").textContent = note.content || "";
    node.querySelector(".edit-note").addEventListener("click", () => startEditNote(note.id));
    node.querySelector(".delete-note").addEventListener("click", () => deleteNote(note.id));
    container.appendChild(node);
  });
}

function clearNoteForm() {
  $("#note-form").reset();
  $("#note-id").value = "";
  $("#note-form-heading").textContent = "Thêm ghi chú";
  $("#save-note").textContent = "+ Lưu ghi chú";
  $("#cancel-edit").classList.add("hidden");
}

function openNotes(key) {
  state.selectedDateKey = key;
  $("#notes-date-title").textContent = formatNoteDate(key);
  clearNoteForm();
  renderNotes();
  $("#notes-dialog").showModal();
}

function startEditNote(noteId) {
  const note = getNotesForSelectedDate().find((item) => item.id === noteId);
  if (!note) return;
  $("#note-id").value = note.id;
  $("#note-time").value = note.time || "";
  $("#note-title").value = note.title;
  $("#note-content").value = note.content || "";
  $("#note-form-heading").textContent = "Sửa ghi chú";
  $("#save-note").textContent = "Lưu thay đổi";
  $("#cancel-edit").classList.remove("hidden");
  $("#note-title").focus();
}

function submitNote(event) {
  event.preventDefault();
  const id = $("#note-id").value;
  const title = $("#note-title").value.trim();
  const time = $("#note-time").value;
  const content = $("#note-content").value.trim();
  if (!title || !state.selectedDateKey) return;

  const notes = getNotesForSelectedDate();
  if (id) {
    const index = notes.findIndex((note) => note.id === id);
    if (index !== -1) notes[index] = { ...notes[index], title, time, content };
  } else {
    notes.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, title, time, content });
  }
  state.notes[state.selectedDateKey] = notes;
  saveNotes();
  clearNoteForm();
  renderNotes();
  renderCalendar();
}

function deleteNote(noteId) {
  const notes = getNotesForSelectedDate();
  const note = notes.find((item) => item.id === noteId);
  if (!note || !confirm(`Xóa ghi chú “${note.title}”?`)) return;
  state.notes[state.selectedDateKey] = notes.filter((item) => item.id !== noteId);
  if (!state.notes[state.selectedDateKey].length) delete state.notes[state.selectedDateKey];
  saveNotes();
  clearNoteForm();
  renderNotes();
  renderCalendar();
}

function setupEvents() {
  $("#smart-search").addEventListener("submit", submitSmartSearch);
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA" && !$("#settings-dialog").open && !$("#notes-dialog").open) {
      event.preventDefault();
      $("#search-input").focus();
    }
    if (event.key === "Escape" && $("#notes-dialog").open) $("#notes-dialog").close();
  });
  $("#previous-month").addEventListener("click", () => {
    state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() - 1, 1);
    renderCalendar();
  });
  $("#next-month").addEventListener("click", () => {
    state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + 1, 1);
    renderCalendar();
  });
  $("#settings-button").addEventListener("click", openSettings);
  $("#add-site").addEventListener("click", () => addSettingsRow());
  $("#settings-form").addEventListener("submit", (event) => {
    if (event.submitter?.value === "save") saveSettings();
  });
  $("#close-notes").addEventListener("click", () => $("#notes-dialog").close());
  $("#note-form").addEventListener("submit", submitNote);
  $("#cancel-edit").addEventListener("click", clearNoteForm);
}

function initialize() {
  updateTime();
  setInterval(updateTime, 1000);
  renderCalendar();
  $("#daily-quote").textContent = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];
  renderSites();
  setupEvents();
  loadWeather();
}

initialize();
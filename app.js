const DEFAULT_SITES = [
  { name: "Facebook", url: "facebook.com" },
  { name: "YouTube", url: "youtube.com" },
  { name: "Discord", url: "discord.com/app" },
];

const QUOTES = [
  "Thanh xuân là một cuốn sách quá vội vã, chúng ta luôn muốn đọc thêm vài trang nữa.",
  "Thanh xuân như một cơn mưa lớn, dù cảm lạnh vẫn muốn tắm thêm lần nữa.",
  "Thích bạn chưa chắc đã yêu bạn; nhưng yêu bạn thì nhất định là rất thích bạn rồi.",
  "Sau này chúng ta có tất cả, chỉ là không còn “chúng ta”.",
  "Nơi nào có yêu thương, nơi đó sẽ có ánh sáng.",
  "Đời người như một cuốn sách: sinh ra là bìa trước, mất đi là bìa sau, nội dung phải tự mình viết.",
  "Đừng giả vờ nỗ lực, kết quả sẽ không diễn cùng bạn.",
  "Lúc này tâm trạng không tốt, ngoài việc ăn được cơm thì chẳng muốn làm gì.",
  "Hoa nở hoa tàn, nhân gian vô thường.",
];

const WEATHER_CODES = {
  0: ["☀", "Trời quang"],
  1: ["🌤", "Chủ yếu quang đãng"],
  2: ["⛅", "Có mây rải rác"],
  3: ["☁", "Nhiều mây"],
  45: ["🌫", "Sương mù"],
  48: ["🌫", "Sương mù đóng băng"],
  51: ["🌦", "Mưa phùn nhẹ"],
  53: ["🌦", "Mưa phùn"],
  55: ["🌧", "Mưa phùn dày"],
  56: ["🌧", "Mưa phùn băng giá"],
  57: ["🌧", "Mưa phùn băng giá mạnh"],
  61: ["🌦", "Mưa nhẹ"],
  63: ["🌧", "Mưa vừa"],
  65: ["🌧", "Mưa to"],
  66: ["🌧", "Mưa băng giá"],
  67: ["🌧", "Mưa băng giá mạnh"],
  71: ["🌨", "Tuyết nhẹ"],
  73: ["🌨", "Tuyết vừa"],
  75: ["❄", "Tuyết dày"],
  77: ["❄", "Hạt tuyết"],
  80: ["🌦", "Mưa rào nhẹ"],
  81: ["🌧", "Mưa rào"],
  82: ["⛈", "Mưa rào mạnh"],
  85: ["🌨", "Mưa tuyết nhẹ"],
  86: ["🌨", "Mưa tuyết mạnh"],
  95: ["⛈", "Dông"],
  96: ["⛈", "Dông kèm mưa đá"],
  99: ["⛈", "Dông mạnh kèm mưa đá"],
};


const WEATHER_FALLBACK_LOCATION = {
  latitude: 10.789359,
  longitude: 106.652784,
  label: "TP. Hồ Chí Minh",
};
const WEATHER_LOCATION_CACHE_KEY = "tdv-weather-location";
const WEATHER_LOCATION_CACHE_TTL = 30 * 24 * 60 * 60 * 1000;

const state = {
  calendarDate: new Date(),
  selectedDateKey: "",
  sites:
    JSON.parse(localStorage.getItem("tdv-sites") || "null") || DEFAULT_SITES,
  notes: JSON.parse(localStorage.getItem("tdv-calendar-notes") || "{}"),
};

const $ = (selector) => document.querySelector(selector);
const pad = (number) => String(number).padStart(2, "0");

function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character],
  );
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
function normalizeSearchText(value) {
  return String(value || "")
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}
function getBookmarkFaviconUrl(url, size = 32) {
  try {
    const hostname = new URL(normalizeUrl(url)).hostname;

    if (!hostname) return "";

    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=${size}`;
  } catch {
    return "";
  }
}

function setBookmarkIcon(element, bookmark) {
  const fallback = (bookmark.title || "?")
    .trim()
    .slice(0, 1)
    .toUpperCase();

  const faviconUrl = getBookmarkFaviconUrl(bookmark.url);

  element.textContent = fallback;

  if (!faviconUrl) return;

  const image = new Image();
  image.src = faviconUrl;
  image.alt = "";

  image.onload = () => {
    element.textContent = "";
    element.appendChild(image);
  };
}

function countBookmarkLinks(nodes) {
  return nodes.reduce((total, node) => {
    if (node.url) return total + 1;
    return total + countBookmarkLinks(node.children || []);
  }, 0);
}

function createBookmarkLink(bookmark) {
  const template = $("#bookmark-link-template");
  const node = template.content.cloneNode(true);
  const link = node.querySelector(".bookmark-link");
  const icon = node.querySelector(".bookmark-link-icon");

  link.href = bookmark.url;
link.dataset.searchText = normalizeSearchText(
  `${bookmark.title || ""} ${bookmark.url || ""} ${bookmark.parentTitle || ""}`
);
  link.title = bookmark.title || bookmark.url;
  node.querySelector(".bookmark-link-title").textContent = bookmark.title || bookmark.url;
  node.querySelector(".bookmark-link-url").textContent = getDisplayUrl(bookmark.url);
  setBookmarkIcon(icon, bookmark);

  return node;
}

function createBookmarkFolder(folder, parentPath = "") {
  const template = $("#bookmark-folder-template");
  const node = template.content.cloneNode(true);
  const details = node.querySelector(".bookmark-folder");
  const children = node.querySelector(".bookmark-children");
  const childNodes = folder.children || [];
  const folderPath = `${parentPath} ${folder.title || ""}`.trim();

  details.dataset.bookmarkId = folder.id;
  details.dataset.folderText = normalizeSearchText(folderPath);
  node.querySelector(".bookmark-folder-title").textContent = folder.title || "Không tên";
  node.querySelector(".bookmark-folder-count").textContent = `${countBookmarkLinks(childNodes)} link`;

  childNodes.forEach((child) => {
    const childWithParent = { ...child, parentTitle: folderPath };
    children.appendChild(
      child.url
        ? createBookmarkLink(childWithParent)
        : createBookmarkFolder(childWithParent, folderPath)
    );
  });

  return node;
}

function renderBookmarkTree(tree) {
  const container = $("#bookmark-tree");
  container.innerHTML = "";

  const roots = tree.flatMap((root) => root.children || []);
  const folders = roots.filter((node) => !node.url);
  const links = roots.filter((node) => node.url);

  if (!folders.length && !links.length) {
    container.innerHTML = `<p class="bookmark-empty">Chưa có bookmark trong Brave.</p>`;
    return;
  }

  folders.forEach((folder) => container.appendChild(createBookmarkFolder(folder)));
  links.forEach((link) => container.appendChild(createBookmarkLink(link)));
}

function loadBookmarks() {
  const refreshButton = $("#refresh-bookmarks");
  refreshButton?.classList.add("is-loading");

  if (!chrome?.bookmarks) {
    $("#bookmark-tree").innerHTML = `<p class="bookmark-empty">Extension chưa có quyền đọc bookmark.</p>`;
    refreshButton?.classList.remove("is-loading");
    return;
  }

  chrome.bookmarks.getTree((tree) => {
    if (chrome.runtime.lastError) {
      $("#bookmark-tree").innerHTML = `<p class="bookmark-empty">Không thể đọc bookmark: ${chrome.runtime.lastError.message}</p>`;
    } else {
      renderBookmarkTree(tree);
      filterBookmarkTree($("#bookmark-search")?.value || "");
    }
    refreshButton?.classList.remove("is-loading");
  });
}

function watchBookmarks() {
  if (!chrome?.bookmarks) return;
  chrome.bookmarks.onCreated.addListener(loadBookmarks);
  chrome.bookmarks.onRemoved.addListener(loadBookmarks);
  chrome.bookmarks.onChanged.addListener(loadBookmarks);
  chrome.bookmarks.onMoved.addListener(loadBookmarks);
  chrome.bookmarks.onChildrenReordered.addListener(loadBookmarks);
}
function filterBookmarkTree(rawQuery) {
  const query = normalizeSearchText(rawQuery).trim();
  const tree = $("#bookmark-tree");
  const result = $("#bookmark-search-result");
  const clearButton = $("#clear-bookmark-search");

  clearButton.classList.toggle("hidden", !query);

  if (!query) {
    tree.querySelectorAll(".bookmark-link, .bookmark-folder").forEach((element) => {
      element.classList.remove("search-hidden", "search-open");
    });
    result.classList.add("hidden");
    result.textContent = "";
    return;
  }

  const links = [...tree.querySelectorAll(".bookmark-link")];
  let matchedLinks = 0;

  links.forEach((link) => {
    const matches = link.dataset.searchText?.includes(query);
    link.classList.toggle("search-hidden", !matches);
    if (matches) matchedLinks++;
  });

  const folders = [...tree.querySelectorAll(".bookmark-folder")].reverse();
  folders.forEach((folder) => {
    const ownFolderMatches = folder.dataset.folderText?.includes(query);
    const containsMatchedLink = [...folder.querySelectorAll(":scope .bookmark-link")]
      .some((link) => !link.classList.contains("search-hidden"));
    const containsVisibleFolder = [...folder.querySelectorAll(":scope .bookmark-folder")]
      .some((childFolder) => !childFolder.classList.contains("search-hidden"));
    const isVisible = ownFolderMatches || containsMatchedLink || containsVisibleFolder;

    folder.classList.toggle("search-hidden", !isVisible);
    folder.classList.toggle("search-open", isVisible);
    if (isVisible) folder.open = true;
  });

  result.textContent = matchedLinks
    ? `${matchedLinks} bookmark phù hợp`
    : "Không tìm thấy bookmark phù hợp";
  result.classList.remove("hidden");
}

function clearBookmarkSearch() {
  $("#bookmark-search").value = "";
  filterBookmarkTree("");
  $("#bookmark-search").focus();
}

function getHostname(url) {
  try {
    return new URL(normalizeUrl(url)).hostname;
  } catch {
    return "";
  }
}

function getFallbackIcon(site) {
  const hostname = getHostname(site.url);
  const label = site.name?.trim() || hostname || "?";
  return label.slice(0, 1).toUpperCase();
}

function getFaviconUrl(url, size = 64) {
  const hostname = getHostname(url);
  if (!hostname) return "";
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=${size}`;
}

function setAutomaticSiteIcon(element, site) {
  const fallback = getFallbackIcon(site);
  const faviconUrl = getFaviconUrl(site.url);

  element.textContent = fallback;
  element.classList.add("is-fallback-icon");

  if (!faviconUrl) return;

  const image = new Image();
  image.src = faviconUrl;
  image.alt = "";
  image.decoding = "async";

  image.onload = () => {
    element.textContent = "";
    element.classList.remove("is-fallback-icon");
    element.appendChild(image);
  };
}

function looksLikeUrl(value) {
  const text = value.trim();
  if (!text || /\s/.test(text)) return false;
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(text)) return true;
  if (/^localhost(?::\d+)?(?:\/.*)?$/i.test(text)) return true;
  if (/^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/.*)?$/.test(text)) return true;
  return /^(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,}(?::\d+)?(?:\/[^\s]*)?$/i.test(
    text,
  );
}

function submitSmartSearch(event) {
  event.preventDefault();
  const query = $("#search-input").value.trim();
  if (!query) return;
  window.location.assign(
    looksLikeUrl(query)
      ? normalizeUrl(query)
      : `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  );
}

function dateKey(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function formatNoteDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date(year, month - 1, day))
    .replace(/^./, (char) => char.toUpperCase());
}

function saveNotes() {
  localStorage.setItem("tdv-calendar-notes", JSON.stringify(state.notes));
}

function updateTime() {
  const now = new Date();
  $("#clock").textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  $("#full-date").textContent = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(now)
    .replace(/^./, (char) => char.toUpperCase());
  const hour = now.getHours();
  $("#greeting").textContent =
    hour < 11
      ? "CHÀO BUỔI SÁNG"
      : hour < 14
        ? "CHÀO BUỔI TRƯA"
        : hour < 18
          ? "CHÀO BUỔI CHIỀU"
          : "CHÀO BUỔI TỐI";
}

function renderCalendar() {
  const display = state.calendarDate;
  const year = display.getFullYear();
  const month = display.getMonth();
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();

  $("#calendar-title").textContent = new Intl.DateTimeFormat("vi-VN", {
    month: "long",
    year: "numeric",
  })
    .format(display)
    .replace(/^./, (char) => char.toUpperCase());

  let html = "";
  for (let index = firstDay - 1; index >= 0; index--)
    html += `<button type="button" class="muted-day" tabindex="-1">${previousMonthDays - index}</button>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(year, month, day);
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    const hasNote = state.notes[key]?.length > 0;
    html += `<button type="button" class="calendar-day${isToday ? " today" : ""}${hasNote ? " has-note" : ""}" data-date="${key}" title="${hasNote ? `${state.notes[key].length} ghi chú` : "Thêm ghi chú"}"><span class="day-number">${day}</span></button>`;
  }
  const remaining = (7 - ((firstDay + daysInMonth) % 7)) % 7;
  for (let day = 1; day <= remaining; day++)
    html += `<button type="button" class="muted-day" tabindex="-1">${day}</button>`;
  $("#calendar-days").innerHTML = html;

  document.querySelectorAll(".calendar-day").forEach((button) => {
    button.addEventListener("click", () => openNotes(button.dataset.date));
  });
}
function getCachedWeatherLocation() {
  try {
    const cached = JSON.parse(localStorage.getItem(WEATHER_LOCATION_CACHE_KEY));

    if (
      !cached ||
      !Number.isFinite(cached.latitude) ||
      !Number.isFinite(cached.longitude) ||
      !Number.isFinite(cached.savedAt)
    ) {
      return null;
    }

    const isExpired = Date.now() - cached.savedAt > WEATHER_LOCATION_CACHE_TTL;
    return isExpired ? null : cached;
  } catch {
    return null;
  }
}

function cacheWeatherLocation(location) {
  const payload = {
    latitude: location.latitude,
    longitude: location.longitude,
    label: location.label || "Vị trí hiện tại",
    savedAt: Date.now()
  };

  localStorage.setItem(WEATHER_LOCATION_CACHE_KEY, JSON.stringify(payload));
  return payload;
}

function clearCachedWeatherLocation() {
  localStorage.removeItem(WEATHER_LOCATION_CACHE_KEY);
}
function getDeviceLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Trình duyệt không hỗ trợ định vị"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      reject,
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 15 * 60 * 1000
      }
    );
  });
}

async function getLocationLabel(latitude, longitude) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=vi&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Reverse geocoding failed");

    const data = await response.json();
    const place = data.results?.[0];
    if (!place) return "Vị trí hiện tại";

    return place.admin1 || place.name || "Vị trí hiện tại";
  } catch {
    return "Vị trí hiện tại";
  }
}

async function fetchWeather(latitude, longitude, label) {
  $("#weather-place").textContent = label;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
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
}

async function loadWeather() {
  $("#weather-description").textContent = "Đang tải thời tiết...";

  const cachedLocation = getCachedWeatherLocation();

  if (cachedLocation) {
    try {
      await fetchWeather(
        cachedLocation.latitude,
        cachedLocation.longitude,
        cachedLocation.label
      );
      return;
    } catch {
      // Nếu lỗi mạng thời tiết, tiếp tục dùng luồng fallback bên dưới.
    }
  }

  $("#weather-place").textContent = "Đang xác định vị trí...";

  try {
    const location = await getDeviceLocation();
    const label = await getLocationLabel(location.latitude, location.longitude);
    const savedLocation = cacheWeatherLocation({ ...location, label });

    await fetchWeather(
      savedLocation.latitude,
      savedLocation.longitude,
      savedLocation.label
    );
  } catch {
    try {
      await fetchWeather(
        WEATHER_FALLBACK_LOCATION.latitude,
        WEATHER_FALLBACK_LOCATION.longitude,
        WEATHER_FALLBACK_LOCATION.label
      );
    } catch {
      $("#weather-icon").textContent = "◌";
      $("#temperature").textContent = "--";
      $("#weather-description").textContent = "Không tải được thời tiết";
      $("#apparent-temperature").textContent = "--";
      $("#humidity").textContent = "--";
      $("#wind-speed").textContent = "--";
    }
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
    card.title = `Mở ${site.name}`;
    setAutomaticSiteIcon(icon, site);

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
  row
    .querySelector(".remove-site")
    .addEventListener("click", () => row.remove());
  $("#site-settings").appendChild(row);
}

function openSettings() {
  renderSettingsSites();
  $("#settings-dialog").showModal();
}

function saveSettings() {
  state.sites = [...document.querySelectorAll(".site-setting-row")]
    .map((row) => ({
      name: row.querySelector(".setting-site-name").value.trim(),
      url: row.querySelector(".setting-site-url").value.trim()
    }))
    .filter((site) => site.name && site.url);

  localStorage.setItem("tdv-sites", JSON.stringify(state.sites));
  renderSites();
}

function getNotesForSelectedDate() {
  return state.notes[state.selectedDateKey] || [];
}

function sortNotes(notes) {
  return [...notes].sort((a, b) =>
    (a.time || "99:99").localeCompare(b.time || "99:99"),
  );
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
    node
      .querySelector(".edit-note")
      .addEventListener("click", () => startEditNote(note.id));
    node
      .querySelector(".delete-note")
      .addEventListener("click", () => deleteNote(note.id));
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
    notes.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      time,
      content,
    });
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
  state.notes[state.selectedDateKey] = notes.filter(
    (item) => item.id !== noteId,
  );
  if (!state.notes[state.selectedDateKey].length)
    delete state.notes[state.selectedDateKey];
  saveNotes();
  clearNoteForm();
  renderNotes();
  renderCalendar();
}

function exportNotesToJson() {
  const backup = {
    app: "Thiên Dật Vũ - 天逸宇 New Tab",
    version: 1,
    exportedAt: new Date().toISOString(),
    notes: state.notes,
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `thien-dat-vu-calendar-notes-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

async function importNotesFromJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const raw = await file.text();
    const parsed = JSON.parse(raw);

    const importedNotes = parsed.notes ?? parsed;

    if (
      !importedNotes ||
      typeof importedNotes !== "object" ||
      Array.isArray(importedNotes)
    ) {
      throw new Error("Sai cấu trúc dữ liệu note");
    }

    const shouldReplace = confirm(
      "Nhập file này sẽ thay thế toàn bộ note hiện tại. Bạn có muốn tiếp tục không?",
    );

    if (!shouldReplace) return;

    state.notes = importedNotes;
    saveNotes();
    renderCalendar();

    if ($("#notes-dialog").open && state.selectedDateKey) {
      renderNotes();
    }

    alert("Đã nhập note thành công.");
  } catch (error) {
    alert(
      "Không thể đọc file JSON. Hãy chắc chắn bạn chọn đúng file note đã xuất từ dashboard.",
    );
  } finally {
    event.target.value = "";
  }
}
const HISTORY_LIMIT = 10;

function isAllowedHistoryUrl(url) {
  return Boolean(url) && !/^(brave|chrome|chrome-extension|about|file):/i.test(url);
}

function getHistoryHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

function getHistoryFaviconUrl(url, size = 32) {
  const hostname = getHistoryHostname(url);
  if (!hostname) return "";
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=${size}`;
}

function formatHistoryTime(timestamp) {
  const date = new Date(timestamp);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) return "Vừa xong";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}p trước`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}g trước`;
  if (seconds < 172800) return "Hôm qua";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit"
  }).format(date);
}

function setHistoryIcon(element, item) {
  const fallback = (item.title || getHistoryHostname(item.url) || "?")
    .trim()
    .slice(0, 1)
    .toUpperCase();
  const faviconUrl = getHistoryFaviconUrl(item.url);

  element.textContent = fallback;
  if (!faviconUrl) return;

  const image = new Image();
  image.src = faviconUrl;
  image.alt = "";
  image.decoding = "async";
  image.onload = () => {
    element.textContent = "";
    element.appendChild(image);
  };
}

function renderHistory(items) {
  const list = $("#history-list");
  const template = $("#history-item-template");
  list.innerHTML = "";

  if (!items.length) {
    list.innerHTML = `<p class="history-empty">Chưa có trang web phù hợp trong lịch sử.</p>`;
    return;
  }

  items.forEach((item) => {
    const node = template.content.cloneNode(true);
    const link = node.querySelector(".history-item");
    const icon = node.querySelector(".history-icon");

    link.href = item.url;
    link.title = item.title || item.url;
    node.querySelector(".history-title").textContent = item.title || item.url;
    node.querySelector(".history-domain").textContent = getHistoryHostname(item.url);
    node.querySelector(".history-time").textContent = formatHistoryTime(item.lastVisitTime);
    setHistoryIcon(icon, item);
    list.appendChild(node);
  });
}

function loadRecentHistory() {
  const refreshButton = $("#refresh-history");
  refreshButton?.classList.add("is-loading");

  if (!chrome?.history) {
    $("#history-list").innerHTML = `<p class="history-empty">Extension chưa có quyền đọc lịch sử.</p>`;
    refreshButton?.classList.remove("is-loading");
    return;
  }

  chrome.history.search(
    {
      text: "",
      startTime: 0,
      maxResults: 100
    },
    (results) => {
      if (chrome.runtime.lastError) {
        $("#history-list").innerHTML = `<p class="history-empty">Không thể đọc lịch sử: ${chrome.runtime.lastError.message}</p>`;
      } else {
        const recent = results
          .filter((item) => isAllowedHistoryUrl(item.url))
          .sort((a, b) => (b.lastVisitTime || 0) - (a.lastVisitTime || 0))
          .slice(0, HISTORY_LIMIT);
        renderHistory(recent);
      }
      refreshButton?.classList.remove("is-loading");
    }
  );
}

function watchHistory() {
  if (!chrome?.history) return;
  chrome.history.onVisited.addListener(() => loadRecentHistory());
  chrome.history.onVisitRemoved.addListener(() => loadRecentHistory());
}

function setupEvents() {
  $("#smart-search").addEventListener("submit", submitSmartSearch);
  document.addEventListener("keydown", (event) => {

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
  event.preventDefault();
  $("#bookmark-search").focus();
  $("#refresh-history").addEventListener("click", loadRecentHistory);
  return;
}

    if (
      event.key === "/" &&
      document.activeElement?.tagName !== "INPUT" &&
      document.activeElement?.tagName !== "TEXTAREA" &&
      !$("#settings-dialog").open &&
      !$("#notes-dialog").open
    ) {
      event.preventDefault();
      $("#search-input").focus();
    }
    if (event.key === "Escape" && $("#notes-dialog").open)
      $("#notes-dialog").close();
  });
  $("#previous-month").addEventListener("click", () => {
    state.calendarDate = new Date(
      state.calendarDate.getFullYear(),
      state.calendarDate.getMonth() - 1,
      1,
    );
    renderCalendar();
  });
  $("#next-month").addEventListener("click", () => {
    state.calendarDate = new Date(
      state.calendarDate.getFullYear(),
      state.calendarDate.getMonth() + 1,
      1,
    );
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

  $("#export-notes").addEventListener("click", exportNotesToJson);
  $("#import-notes").addEventListener("change", importNotesFromJson);
  $("#refresh-bookmarks").addEventListener("click", loadBookmarks);

  $("#bookmark-search").addEventListener("input", (event) => {
  filterBookmarkTree(event.target.value);
});

  $("#clear-bookmark-search").addEventListener("click", clearBookmarkSearch);

}

function initialize() {
  updateTime();
  setInterval(updateTime, 1000);
  renderCalendar();
  $("#daily-quote").textContent =
    QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];
  renderSites();
  setupEvents();
  loadWeather();
  loadBookmarks();
  watchBookmarks();
  loadRecentHistory();
  watchHistory();
  
}

initialize();

# Thiên Dật Vũ — 天逸宇 | Brave New Tab

<p align="center">
  <a href="README.md">Tiếng Việt</a>
</p>

> **This project was created with the assistance of AI. It has no private backend or server operated by the author. You can download the source code, inspect it, and customize it for your own needs.**

A personal New Tab extension for Brave/Chrome with a clock, calendar notes, device-based weather, Google Smart Search, quick links, bookmarks, and a browsing-history popup.

## Features

- Real-time clock, date, greeting, and calendar.
- Calendar notes: add, edit, delete, and optional JSON import/export controls if enabled in the current interface.
- Weather based on the device location; coordinates are cached locally for up to 7 days.
- Google Smart Search: search Google with regular text, or open a domain, URL, LAN IP, or `localhost` directly.
- Quick links loaded from a separate JSON file.
- Expandable and accent-insensitive searchable bookmark tree.
- Browsing history in a popup opened with the `◷` button.
- No localhost service, Python server, or private backend.

## Installation

1. Open Brave and visit `brave://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the folder that contains `manifest.json`.
5. Open a new tab with `Ctrl + T`.
6. Allow location access if you want weather based on the device location.

Only one New Tab override extension should be enabled to avoid conflicts.

## Updating

1. Save changes to the project files.
2. Open `brave://extensions`.
3. Click **Reload** on the extension.
4. Close the old dashboard tab and open a new tab with `Ctrl + T`.

Reloading is required after changing `manifest.json`.

## Folder structure

```text
thien-dat-vu-new-tab/
├── data/
│   ├── sites.example.json
│   └── sites.local.json       # Personal configuration, ignored by Git
├── img/                       # Optional images/icons/avatars
├── manifest.json
├── newtab.html
├── styles.css
├── app.js
├── README.md                  # Vietnamese
└── README_EN.md               # English
```

## Quick links

The dashboard first loads:

```text
data/sites.local.json
```

If it is unavailable, it loads the public example:

```text
data/sites.example.json
```

Example:

```json
[
  { "name": "Facebook", "url": "https://facebook.com" },
  { "name": "YouTube", "url": "https://youtube.com" },
  { "name": "Discord", "url": "https://discord.com/app" },
  { "name": "Fast", "url": "https://fast.com" }
]
```

After editing the JSON file, save it → open `brave://extensions` → click **Reload**.

## GitHub

Create a `.gitignore` file in the project root to keep personal links out of GitHub:

```gitignore
data/sites.local.json
```

Or use a broader rule:

```gitignore
data/*.local.json
```

Keep `data/sites.example.json` in the repository as a public example.

If `sites.local.json` was already committed:

```bash
git rm --cached data/sites.local.json
git add .gitignore
git commit -m "Ignore local quick links config"
git push
```

This removes the file from Git tracking without deleting it from your computer.

## Bookmarks and history

Your `manifest.json` must include:

```json
"permissions": [
  "bookmarks",
  "history"
]
```

- **Bookmarks** are read directly from Brave, rendered as an expandable tree, and have a dedicated search field.
- **History** opens through the `◷` button and lists recently visited pages in a popup.
- Brave Sync handles bookmark synchronization between devices; the dashboard only reads bookmarks available in the local Brave profile.

## Data and privacy

- Calendar notes are stored locally in the Brave profile under `tdv-calendar-notes`.
- Location is requested only when required for weather and cached for up to 7 days under `tdv-weather-location`.
- Bookmarks and browsing history are read through Brave's internal APIs; the dashboard does not permanently copy browsing history.
- Weather data is requested from Open-Meteo over HTTPS.
- Favicons may be loaded from external favicon services, depending on the current `app.js` configuration.
- The project has no private backend and does not send data to a server operated by the project author.

## Customization

You are free to download the source code, inspect it, and customize the UI, quick-link data, displayed name, colors, and features for personal use.
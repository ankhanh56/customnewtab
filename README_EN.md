# Cục Bột · An Khánh | New Tab


<p align="center">
  <a href="README.md">Tiếng Việt</a>
</p>



A personal New Tab extension for Brave/Chrome with a clock, calendar notes, device-based weather, Google Smart Search, quick links, bookmarks, and a browsing-history popup.

>[!NOTE]
> **This project was created with the assistance of AI. It has NO private backend or server operated by the author. You can download the source code, inspect it, and customize it for your own needs.**

![New Tab](/img/chrome_uJMffqdA6r.png)

## Features

- Real-time clock, date, greeting, and calendar.
- Calendar notes: add, edit, delete, and optional JSON import/export controls.
- Weather based on the device location; coordinates are cached locally default 7 days.
- Google Smart Search: search Google with regular text, or open a domain, URL, LAN IP, or `localhost` directly.
- Quick links loaded from a separate JSON file.
- Expandable and accent-insensitive searchable bookmark tree.
- Browsing history in a popup opened with the `◷` button.
- No localhost service, Python server, or private backend.

## Installation

1. Open Brave and visit `brave://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the folder your download and unzip.
5. Open a new tab with `Ctrl + T`.
6. Allow location access if you want weather based on the device location.

Only one New Tab override extension should be enabled to avoid conflicts.

## Uninstall

1. Open Brave and visit `brave://extensions`.
2. Click **Remove** and open File Explorer find your download and zip **Delete** it.

## Updating

1. Save changes to the project files.
2. Open `brave://extensions`.
3. Click **Reload** on the extension.
4. Close the old dashboard tab and open a new tab with `Ctrl + T`.

Reloading is required after changing `manifest.json`.

## Folder structure

```text
custom-new-tab/
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


## Device Location Weather

The dashboard uses Brave’s Geolocation API to retrieve the current device coordinates, then fetches weather data from Open-Meteo.

In app.js, the fallback configuration looks like this:

```javascript
const WEATHER_FALLBACK_LOCATION = {
  latitude: 10.789359,
  longitude: 106.652784,
  label: "Ho Chi Minh City",
};
```

| Situation | Result |
|---|---|
| Location permission allowed | Displays weather based on the device’s current location. |
| Location permission blocked or denied | Uses Ho Chi Minh City as the fallback weather location. |
| No Internet connection | Weather data cannot be loaded. |

If you previously blocked location permission, open the dashboard → click the page controls/site information icon on the left side of the address bar → find **Location** → change it to **Allow** → reload the tab.

Your `manifest.json` must include the following host permissions:

```json
"host_permissions": [
  "https://api.open-meteo.com/*",
  "https://geocoding-api.open-meteo.com/*",
  "https://www.google.com/*"
]
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


## Rename

Edit the following values in `newtab.html`:

```html
<title>Cục Bột · An Khánh</title>
<span>LHAnKhánh <b>— 天逸宇</b></span>
<h1>Thiên Dật Vũ</h1>
```

To change the extension name shown on `brave://extensions`, edit the `name` field in `manifest.json`, then Reload the extension.

## Customize the Weather Location Cache Duration

To change the cache duration from 7 days to another period, edit this line:

```javascript
const WEATHER_LOCATION_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
```

Examples:

```javascript
// 1 ngày
const WEATHER_LOCATION_CACHE_TTL = 24 * 60 * 60 * 1000;

// 30 ngày
const WEATHER_LOCATION_CACHE_TTL = 30 * 24 * 60 * 60 * 1000;
```

## Troubleshooting

- The dashboard does not appear: Make sure the extension is enabled and that no other New Tab extension is causing a conflict.

- The old interface is still displayed: Reload the extension, close the old tab, and open a new tab.

- Bookmarks are empty: Check that the extension has the `bookmarks` permission, then reload the extension.

- Weather does not load: Check your Internet connection, location permission, the Open-Meteo `host_permissions`, and the permissions granted to the extension.

- Favicons do not appear: The website may not provide a favicon; the fallback icon will be displayed.



## Data and privacy

- Calendar notes are stored locally in the Brave profile under `tdv-calendar-notes`.
- Location is requested only when required for weather and cached default 7 days under `tdv-weather-location`.
- Bookmarks and browsing history are read through Brave's internal APIs; the dashboard does not permanently copy browsing history.
- Weather data is requested from Open-Meteo over HTTPS.
- Favicons may be loaded from external favicon services, depending on the current `app.js` configuration.
- The project has no private backend and does not send data to a server operated by the project author.

## Customization

You are free to download the source code, inspect it, and customize the UI, quick-link data, displayed name, colors, and features for personal use(maybe use AI to edit).


> [!CAUTION]
> **This project was created with the assistance of AI and customized according to my personal preferences. It does not collect, store, or transmit any personal information from you.**
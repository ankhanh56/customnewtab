# Cục Bột · An Khánh | New Tab

Extension New Tab cá nhân: dashboard tối, đồng hồ, lịch có note, thời tiết theo vị trí máy, Google Smart Search, Truy cập nhanh và cây Bookmark.

<p align="center">
  <a href="README.md">Tiếng Việt</a>
  ·
  <a href="README_EN.md">English</a>
</p>

> **Project này được thực hiện với sự hỗ trợ của AI. KHÔNG CÓ backend hoặc server riêng do tác giả vận hành. Bạn có thể tải source code, kiểm tra và tùy chỉnh lại theo nhu cầu.**

Extension New Tab cá nhân cho Brave/Chrome với đồng hồ, lịch có note, thời tiết theo vị trí máy, Google Smart Search, Truy cập nhanh, Bookmark và popup lịch sử duyệt web.

## Tính năng

- Đồng hồ, ngày tháng, lời chào và lịch tiếng Việt.
- Ghi chú theo từng ngày: thêm, sửa, xóa và xuất/nhập JSON.
- Thời tiết theo vị trí hiện tại của máy; tọa độ được cache cục bộ mặc định 7 ngày.
- Google Smart Search: nhập từ khóa để tìm Google; nhập domain, URL, IP LAN hoặc `localhost` để mở trực tiếp.
- Truy cập nhanh đọc từ file JSON riêng.
- Bookmark hiển thị dạng cây, có tìm kiếm không dấu.
- Lịch sử duyệt web mở trong popup qua nút `◷`.
- Không dùng localhost, Python server hay backend riêng.

## Cài đặt

1. Mở Brave và truy cập `brave://extensions`.
2. Bật **Developer mode / Chế độ nhà phát triển**.
3. Nhấn **Load unpacked / Tải tiện ích đã giải nén**.
4. Chọn thư mục chứa `manifest.json`.
5. Mở tab mới bằng `Ctrl + T`.
6. Cho phép quyền vị trí nếu muốn hiển thị thời tiết theo vị trí máy.

Chỉ nên bật một extension ghi đè New Tab để tránh xung đột.

## Cập nhật

1. Lưu các file đã thay đổi trong thư mục project.
2. Mở `brave://extensions`.
3. Nhấn **Reload / Tải lại** trên extension.
4. Đóng tab dashboard cũ rồi mở tab mới bằng `Ctrl + T`.

Nếu sửa `manifest.json`, bắt buộc phải Reload extension.

## Cấu trúc thư mục

```text
custom-new-tab/
├── data/
│   ├── sites.example.json
│   └── sites.local.json       # Cấu hình cá nhân, không đưa lên GitHub
├── img/                       # Ảnh/icon/avatar nếu project đang dùng
├── manifest.json
├── newtab.html
├── styles.css
├── app.js
├── README.md                  # Tiếng Việt
└── README_EN.md               # English
```


## Thời tiết vị trí máy

Dashboard dùng Geolocation API của Brave để lấy tọa độ hiện tại, sau đó lấy thời tiết từ Open-Meteo.

Trong `app.js`, cấu hình dự phòng có dạng:

```javascript
const WEATHER_FALLBACK_LOCATION = {
  latitude: 10.789359,
  longitude: 106.652784,
  label: "TP. Hồ Chí Minh",
};
```

| Tình huống | Kết quả |
|---|---|
| Cho phép vị trí | Hiển thị thời tiết theo vị trí thiết bị. |
| Chặn/từ chối vị trí | Dùng thời tiết TP.Hồ Chí Minh dự phòng. |
| Không có Internet | Không tải được dữ liệu thời tiết. |

Nếu đã lỡ chặn quyền vị trí, mở dashboard → bấm biểu tượng điều khiển trang ở cạnh trái thanh địa chỉ → tìm **Location / Vị trí** → đổi sang **Allow / Cho phép** → tải lại tab.

`manifest.json` phải có các quyền host sau:

```json
"host_permissions": [
  "https://api.open-meteo.com/*",
  "https://geocoding-api.open-meteo.com/*",
  "https://www.google.com/*"
]
```



## Truy cập nhanh

Dashboard ưu tiên đọc danh sách tại:

```text
data/sites.local.json
```

Nếu file này không có, dashboard dùng file mẫu:

```text
data/sites.example.json
```

Ví dụ:

```json
[
  { "name": "Facebook", "url": "https://facebook.com" },
  { "name": "YouTube", "url": "https://youtube.com" },
  { "name": "Discord", "url": "https://discord.com/app" },
  { "name": "Fast", "url": "https://fast.com" }
]
```

Sau khi sửa JSON: lưu file → vào `brave://extensions` → nhấn **Reload**.


## Bookmark và History

`manifest.json` cần có:

```json
"permissions": [
  "bookmarks",
  "history"
]
```

- **Bookmark** đọc trực tiếp từ Brave, hiển thị dạng cây và có ô tìm kiếm riêng.
- **History** mở qua nút `◷`, hiển thị các trang gần đây trong popup.
- Brave Sync là thành phần đồng bộ bookmark giữa các thiết bị; dashboard chỉ đọc dữ liệu đã có trong Brave.


## Đổi tên

Sửa trong `newtab.html`:

```html
<title>Cục Bột · An Khánh</title>
<span>Thiên Dật Vũ <b>— 天逸宇</b></span>
<h1>Thiên Dật Vũ</h1>
```

Để đổi tên extension ở `brave://extensions`, sửa trường `name` trong `manifest.json`, rồi Reload extension.

## Tùy chỉnh thời hạn cache vị trí thời tiết

Muốn thay 7 ngày thành thời hạn khác, sửa dòng:

```javascript
const WEATHER_LOCATION_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
```

Ví dụ:

```javascript
// 1 ngày
const WEATHER_LOCATION_CACHE_TTL = 24 * 60 * 60 * 1000;

// 30 ngày
const WEATHER_LOCATION_CACHE_TTL = 30 * 24 * 60 * 60 * 1000;
```

## Khắc phục lỗi

- Không hiện dashboard: kiểm tra extension đang bật và không có New Tab extension khác xung đột.
- Giao diện cũ: Reload extension, đóng tab cũ rồi mở tab mới.
- Bookmark trống: kiểm tra quyền `bookmarks` rồi Reload extension.
- Weather không tải: kiểm tra Internet, quyền vị trí và các `host_permissions` Open-Meteo, xem lại quyền cấp phép cho extensions.
- Favicon không hiện: site có thể không cung cấp favicon; icon fallback sẽ hiển thị.


## Dữ liệu và riêng tư

- Note lịch được lưu cục bộ trong profile Brave với khóa `tdv-calendar-notes`.
- Vị trí chỉ được lấy khi cần tải thời tiết và được cache mặc định 7 ngày với khóa `tdv-weather-location`.
- Bookmark và history được đọc bằng API nội bộ của Brave; dashboard không tạo bản sao cố định của history.
- Thời tiết gọi Open-Meteo qua HTTPS.
- Favicon có thể được tải từ dịch vụ favicon bên ngoài, tùy cấu hình `app.js`.
- Project không có backend riêng và không gửi dữ liệu đến server do tác giả project vận hành.

## Tùy chỉnh

Bạn có thể tự do tải source code, đọc mã và chỉnh sửa giao diện, dữ liệu site, tên hiển thị, màu sắc hoặc chức năng theo nhu cầu cá nhân.
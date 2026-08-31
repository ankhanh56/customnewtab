# Cục Bột · An Khánh | New Tab

Extension New Tab cá nhân: dashboard tối, đồng hồ, lịch có note, thời tiết theo vị trí máy, Google Smart Search, Truy cập nhanh và cây Bookmark.

## Tính năng

- Đồng hồ, ngày tháng, lời chào và lịch tiếng Việt.
- Ghi chú theo ngày: thêm, sửa, xóa; ngày có note hiện chấm xanh.
- Thời tiết theo **vị trí hiện tại của máy**; nếu không cấp quyền vị trí sẽ dùng TP.Hồ Chí Minh làm vị trí dự phòng.
- Google Smart Search:
  - Nhập từ khóa → tìm Google.
  - Nhập `facebook.com`, `fast.com`, IP LAN, `localhost:3000` hoặc URL đầy đủ → mở trực tiếp.
- **Truy cập nhanh**: thêm/sửa/xóa website qua nút `⚙`; favicon tự lấy theo domain.
- **Bookmark**: đọc và hiển thị cây bookmark; folder có thể mở/đóng và tự cập nhật khi bookmark thay đổi.
- Không dùng localhost, Python server hoặc backend riêng.

## Cấu trúc thư mục

```text
thien-dat-vu-new-tab/
├── img/                  # Nếu project đang dùng ảnh/icon/avatar riêng
├── manifest.json
├── newtab.html
├── styles.css
├── app.js
└── README.md
```

## Cài đặt

1. Mở Brave và truy cập:

```text
brave://extensions
chrome://extensions

```

2. Bật **Developer mode / Chế độ nhà phát triển**.
3. Nhấn **Load unpacked / Tải tiện ích đã giải nén**.
4. Chọn thư mục chứa file `manifest.json`.
5. Mở tab mới bằng `Ctrl + T`.
6. Khi Brave yêu cầu quyền vị trí, chọn **Allow / Cho phép** để thời tiết dùng vị trí máy.

> Chỉ nên bật một extension ghi đè New Tab để tránh xung đột giao diện.

## Cập nhật

1. Lưu các file đã chỉnh trong thư mục extension.
2. Mở `brave://extensions`.
3. Nhấn **Reload / Tải lại** trên extension.
4. Đóng tab dashboard cũ rồi mở tab mới bằng `Ctrl + T`.

Nếu vừa đổi `manifest.json`, Reload extension là bắt buộc.

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

Bấm `⚙` để thêm, sửa hoặc xóa website. Chỉ cần nhập tên và URL, ví dụ:

| Nhập URL | Mở thành |
|---|---|
| `facebook.com` | `https://facebook.com` |
| `fast.com` | `https://fast.com` |
| `https://youtube.com` | Giữ nguyên HTTPS |
| `http://192.168.1.1` | Mở router/LAN qua HTTP |

Icon website tự lấy từ domain. Nếu favicon không tải được, dashboard hiển thị chữ cái đầu của tên site.

Danh sách được lưu cục bộ trong Brave với khóa:

```text
tdv-sites
```

## Bookmark

Mục **BOOKMARK** đọc trực tiếp bookmark hiện có trong Brave.

- Hiển thị folder dạng cây; bấm folder để đóng/mở.
- Tự cập nhật khi bạn thêm, xóa, đổi tên, di chuyển hoặc sắp xếp bookmark.
- Bấm `↻` để làm mới thủ công.
- Brave Sync chịu trách nhiệm đồng bộ bookmark giữa các thiết bị; dashboard chỉ đọc bookmark trên máy hiện tại.

`manifest.json` phải có:

```json
"permissions": ["bookmarks"]
```

## Ghi chú lịch

1. Bấm vào một ngày trên lịch.
2. Nhập thời gian, tiêu đề và nội dung.
3. Bấm **Lưu ghi chú**.
4. Bấm lại vào ngày đó để xem, sửa hoặc xóa note.

Note được lưu cục bộ trong hồ sơ Brave với khóa:

```text
tdv-calendar-notes
```

Không xóa dữ liệu extension hoặc gỡ extension nếu muốn giữ note. Nếu bản của bạn có nút Xuất/Nhập JSON, hãy xuất file định kỳ để backup note.

## Đổi tên

Sửa trong `newtab.html`:

```html
<title>Cục Bột · An Khánh</title>
<span>Thiên Dật Vũ <b>— 天逸宇</b></span>
<h1>Thiên Dật Vũ</h1>
```

Để đổi tên extension ở `brave://extensions`, sửa trường `name` trong `manifest.json`, rồi Reload extension.

## Khắc phục lỗi

- Không hiện dashboard: kiểm tra extension đang bật và không có New Tab extension khác xung đột.
- Giao diện cũ: Reload extension, đóng tab cũ rồi mở tab mới.
- Bookmark trống: kiểm tra quyền `bookmarks` rồi Reload extension.
- Weather không tải: kiểm tra Internet, quyền vị trí và các `host_permissions` Open-Meteo, xem lại quyền cấp phép cho extensions.
- Favicon không hiện: site có thể không cung cấp favicon; icon fallback sẽ hiển thị.

## Quyền riêng tư

- Vị trí chỉ được lấy khi dashboard mở để tải thời tiết; không theo dõi nền và không lưu lịch sử vị trí.
- Bookmark đọc qua API nội bộ của Brave.
- Note và Truy cập nhanh lưu trong profile Brave hiện tại.
- Thời tiết gọi Open-Meteo; favicon gọi dịch vụ favicon Google theo hostname website.
- Không có server riêng, localhost hoặc ứng dụng chạy nền.
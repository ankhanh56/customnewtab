# Thiên Dật Vũ — 天逸宇 | Brave New Tab Dashboard

Một extension **New Tab** dành cho Brave/Chrome theo phong cách dashboard tối giản. Trang tab mới có đồng hồ, lịch, thời tiết cố định, Google Smart Search và các ô truy cập nhanh có thể tự thêm hoặc chỉnh sửa.

> Phiên bản hiện tại: `1.1.0`

## Tính năng

- Ghi đè trang tab mới của Brave/Chrome bằng giao diện dashboard cá nhân.
- Tên hiển thị mặc định: **Thiên Dật Vũ — 天逸宇**.
- Đồng hồ thời gian thực, lời chào theo buổi và lịch tháng tiếng Việt.
- Thời tiết thời gian thực từ Open-Meteo, không cần API key.
- Địa điểm thời tiết được ghim cố định trong mã nguồn.
- **Google Smart Search**:
  - Nhập cụm từ bình thường để tìm trên Google.
  - Nhập tên miền, URL, IP LAN hoặc `localhost` để truy cập thẳng trang web.
- Truy cập nhanh mặc định: Facebook, YouTube, Discord, Gmail, Google Drive và GitHub.
- Có thể thêm, sửa tên, sửa URL hoặc xóa các ô truy cập nhanh trong giao diện cài đặt `⚙`.
- Lưu danh sách truy cập nhanh bằng `localStorage`, nên các thay đổi vẫn còn sau khi mở tab mới hoặc khởi động lại Brave.
- Không dùng ảnh, video webcam, backend hay tài khoản API.

## Cấu trúc thư mục

Tạo một thư mục, ví dụ `thien-dat-vu-new-tab`, với đúng cấu trúc sau:

```text
thien-dat-vu-new-tab/
├── manifest.json
├── newtab.html
├── styles.css
├── app.js
└── README.md
```

| File | Mục đích |
|---|---|
| `manifest.json` | Khai báo extension và cho Brave dùng `newtab.html` thay trang tab mới mặc định. |
| `newtab.html` | Cấu trúc giao diện dashboard. |
| `styles.css` | Màu sắc, bố cục, responsive và hiệu ứng giao diện. |
| `app.js` | Đồng hồ, lịch, thời tiết, Smart Search và lưu truy cập nhanh. |
| `README.md` | Hướng dẫn cài đặt, cập nhật và tùy chỉnh. |

## Cài đặt lần đầu

### 1. Chuẩn bị file extension

1. Tạo thư mục `thien-dat-vu-new-tab` tại một nơi **không bị xóa hoặc di chuyển**, ví dụ `D:\Extensions\thien-dat-vu-new-tab`.
2. Tạo bốn file: `manifest.json`, `newtab.html`, `styles.css` và `app.js`.
3. Dán mã nguồn tương ứng vào từng file.
4. Lưu file với mã hóa UTF-8.

> Không chọn thư mục trong Downloads nếu bạn thường dọn Downloads. Brave sẽ mất đường dẫn extension nếu thư mục bị di chuyển, đổi tên hoặc xóa.

### 2. Bật Developer mode

1. Mở Brave.
2. Nhập địa chỉ sau vào thanh địa chỉ, sau đó nhấn Enter:

```text
brave://extensions
```

3. Bật công tắc **Developer mode / Chế độ nhà phát triển** ở góc trên bên phải.

### 3. Load extension

1. Nhấn **Load unpacked / Tải tiện ích đã giải nén**.
2. Chọn thư mục `thien-dat-vu-new-tab` — chọn thư mục chứa các file, không chọn riêng lẻ một file.
3. Extension **Thiên Dật Vũ - 天逸宇 | New Tab** sẽ xuất hiện trong danh sách extension.
4. Mở một tab mới bằng `Ctrl + T` để kiểm tra dashboard.

Nếu trang tab mới vẫn là giao diện mặc định, thử đóng toàn bộ tab mới cũ rồi mở một tab mới sau khi extension đã được tải.

## Cập nhật dashboard

Khi bạn chỉnh mã hoặc nhận bản cập nhật mới, không cần xóa extension và cài lại.

1. Mở thư mục extension hiện tại.
2. Thay nội dung file cần cập nhật, thường là `newtab.html`, `styles.css` hoặc `app.js`.
3. Nếu cập nhật có thay đổi `manifest.json`, thay file đó luôn.
4. Lưu tất cả file.
5. Mở `brave://extensions`.
6. Tìm extension **Thiên Dật Vũ - 天逸宇 | New Tab**.
7. Nhấn nút **Reload / Tải lại** (biểu tượng làm mới) trên thẻ extension.
8. Đóng các tab dashboard đang mở, rồi nhấn `Ctrl + T` để mở dashboard mới.

### Nếu bản cũ vẫn hiện

Trình duyệt đôi khi giữ giao diện cũ trong cache. Làm theo thứ tự này:

1. Nhấn `Ctrl + Shift + R` trên tab dashboard để tải cứng lại.
2. Nếu chưa được, vào `brave://extensions` và nhấn **Reload** thêm một lần.
3. Đóng tab đó, mở tab mới lại.
4. Kiểm tra bạn đã sửa đúng file trong đúng thư mục mà Brave đang load hay chưa. Trên thẻ extension, nhấn **Details / Chi tiết** để xem đường dẫn extension nếu cần.

## Tùy chỉnh tên hiển thị

Tên **Thiên Dật Vũ — 天逸宇** hiện xuất hiện ở nhiều vị trí. Để đổi đồng bộ, mở `newtab.html` rồi tìm và thay các đoạn sau:

```html
<title>Thiên Dật Vũ — 天逸宇</title>
```

```html
<span>Thiên Dật Vũ <b>— 天逸宇</b></span>
```

```html
<h1>Thiên Dật Vũ</h1>
<p>逸宇 · Digital workspace</p>
```

Ví dụ, nếu muốn đổi thành **An Khánh — 安庆**, bạn có thể thay thành:

```html
<title>An Khánh — 安庆</title>
```

```html
<span>An Khánh <b>— 安庆</b></span>
```

```html
<h1>An Khánh</h1>
<p>安庆 · Digital workspace</p>
```

Ngoài ra, nếu muốn đổi cả tên extension hiển thị tại `brave://extensions`, sửa trường `name` trong `manifest.json`:

```json
{
  "name": "An Khánh - 安庆 | New Tab"
}
```

Sau khi sửa, vào `brave://extensions` và nhấn **Reload**.

## Chỉnh vị trí thời tiết

Thời tiết được đặt cố định trong file `app.js`. Tìm khối sau:

```javascript
const WEATHER_LOCATION = {
  latitude: 11.311,
  longitude: 106.094,
  label: "Xã Đức Hòa, Tây Ninh"
};
```

Ý nghĩa từng giá trị:

| Thuộc tính | Ý nghĩa |
|---|---|
| `latitude` | Vĩ độ của vị trí, ví dụ `11.311`. |
| `longitude` | Kinh độ của vị trí, ví dụ `106.094`. |
| `label` | Tên địa điểm hiển thị trên dashboard. |

### Ví dụ thay địa điểm

Nếu muốn hiển thị tên khác nhưng giữ tọa độ hiện tại:

```javascript
const WEATHER_LOCATION = {
  latitude: 11.311,
  longitude: 106.094,
  label: "Đức Hòa, Tây Ninh"
};
```

Nếu muốn ghim sang một khu vực khác, thay cả ba giá trị:

```javascript
const WEATHER_LOCATION = {
  latitude: 10.7769,
  longitude: 106.7009,
  label: "Quận 1, Thành phố Hồ Chí Minh"
};
```

### Cách lấy tọa độ chính xác

1. Mở Google Maps và tìm địa điểm bạn muốn.
2. Nhấp chuột phải đúng vị trí trên bản đồ.
3. Sao chép cặp số tọa độ xuất hiện ở đầu menu, theo dạng `vĩ_độ, kinh_độ`.
4. Dán số thứ nhất vào `latitude`; dán số thứ hai vào `longitude`.
5. Đổi `label` thành tên bạn muốn nhìn thấy trên dashboard.
6. Lưu `app.js`, vào `brave://extensions`, nhấn **Reload**, sau đó mở tab mới.

> Chỉ `label` thay đổi thì giao diện chỉ đổi tên. Muốn dữ liệu nhiệt độ/mưa/gió thực sự của địa điểm mới, phải đổi cả `latitude` lẫn `longitude`.

## Thêm và quản lý truy cập nhanh

### Thêm trực tiếp trên dashboard

1. Mở tab mới.
2. Nhấn biểu tượng **⚙** ở góc trên bên phải.
3. Chọn **+ Thêm trang web**.
4. Điền tên và URL.
5. Nhấn **Lưu thay đổi**.

URL có thể nhập dưới các dạng sau:

| Bạn nhập | Dashboard sẽ mở |
|---|---|
| `facebook.com` | `https://facebook.com` |
| `fast.com` | `https://fast.com` |
| `https://www.youtube.com/` | Giữ nguyên URL HTTPS |
| `192.168.1.1` | `https://192.168.1.1` |
| `localhost:3000` | `https://localhost:3000` |

> Với router, Home Assistant, hoặc dịch vụ LAN chỉ chạy HTTP, hãy nhập đầy đủ giao thức. Ví dụ: `http://192.168.1.1`, `http://homeassistant.local:8123`, hoặc `http://localhost:3000`. Nếu không, dashboard sẽ tự thêm `https://`.

### Chỉnh danh sách mặc định trong code

Các website xuất hiện lần đầu nằm ở đầu file `app.js`:

```javascript
const DEFAULT_SITES = [
  { name: "Facebook", url: "facebook.com", icon: "f", color: "#1877f2" },
  { name: "YouTube", url: "youtube.com", icon: "▶", color: "#e52222" },
  { name: "Discord", url: "discord.com/app", icon: "◉", color: "#5865f2" }
];
```

Mỗi trang có bốn phần:

- `name`: Tên hiển thị trên thẻ.
- `url`: Địa chỉ trang web.
- `icon`: Ký tự hoặc emoji trong ô biểu tượng.
- `color`: Mã màu nền biểu tượng dạng hex.

Ví dụ thêm Fast.com:

```javascript
{ name: "Fast", url: "fast.com", icon: "⚡", color: "#ef4444" }
```

### Lưu ý về dữ liệu cũ

Danh sách bạn chỉnh bằng biểu tượng `⚙` được lưu trong `localStorage`. Vì vậy, nếu bạn sửa `DEFAULT_SITES` trong `app.js` nhưng dashboard vẫn hiện danh sách cũ, đó là hành vi bình thường: dữ liệu cá nhân đã lưu sẽ được ưu tiên.

Để quay về danh sách mặc định mới trong code:

1. Mở dashboard.
2. Nhấn `F12` để mở DevTools.
3. Vào tab **Console**.
4. Dán lệnh sau rồi nhấn Enter:

```javascript
localStorage.removeItem("tdv-sites");
location.reload();
```

Hoặc xóa dữ liệu trang của extension trong phần cài đặt quyền riêng tư của Brave.

## Google Smart Search

Ô tìm kiếm ở đầu trang tự chọn giữa tìm Google và truy cập trực tiếp.

| Nội dung nhập | Hành động |
|---|---|
| `cách cấu hình Tailscale` | Mở tìm kiếm Google. |
| `fast.com` | Mở trực tiếp Fast.com. |
| `facebook.com` | Mở trực tiếp Facebook. |
| `discord.com/app` | Mở trực tiếp Discord. |
| `youtube.com/@tenkenh` | Mở trực tiếp đường dẫn YouTube. |
| `192.168.1.1` | Mở trực tiếp trang router. |
| `localhost:3000` | Mở server local. |
| `http://192.168.1.1` | Mở chính xác URL HTTP được nhập. |
| `https://github.com/...` | Mở nguyên URL được nhập. |

Nhấn phím `/` ở bất cứ đâu trên dashboard để đưa con trỏ vào ô Smart Search.

## Khắc phục lỗi

### Extension báo lỗi khi Load unpacked

- Kiểm tra file tên đúng là `manifest.json`, không phải `manifest.json.txt`.
- Kiểm tra cấu trúc thư mục: cả bốn file phải nằm trực tiếp trong thư mục bạn chọn.
- Mở `manifest.json` bằng VS Code và đảm bảo JSON không có dấu phẩy thừa.
- Trong `brave://extensions`, bấm nút **Errors** trên extension để đọc dòng lỗi cụ thể.

### Không mở được một website nội bộ

- Thử mở URL trực tiếp trong Brave trước để xác nhận URL đang hoạt động.
- Nếu dịch vụ chỉ dùng HTTP, nhập `http://` rõ ràng thay vì chỉ nhập IP/tên miền.
- Kiểm tra máy tính có đang kết nối mạng LAN, Tailscale hoặc VPN cần thiết không.
- Nếu dùng chứng chỉ HTTPS tự ký, mở URL một lần trong Brave và chấp nhận cảnh báo chứng chỉ nếu bạn hiểu và tin cậy dịch vụ nội bộ đó.

### Không tải được thời tiết

- Kiểm tra kết nối Internet.
- Vào `brave://extensions`, nhấn Reload extension.
- Mở DevTools bằng `F12`, xem tab Console để biết lỗi mạng nếu có.
- Kiểm tra `manifest.json` vẫn có quyền sau:

```json
"host_permissions": [
  "https://api.open-meteo.com/*"
]
```

### Các thay đổi truy cập nhanh bị mất

- Không dùng chế độ Private/Incognito, vì dữ liệu có thể bị xóa khi đóng cửa sổ.
- Không xóa dữ liệu trang của extension hoặc dữ liệu Brave nếu muốn giữ danh sách.
- Không đổi ID extension bằng cách chuyển sang một thư mục/project khác nếu bạn muốn giữ `localStorage` cũ.

## Gỡ cài đặt

1. Mở `brave://extensions`.
2. Tìm **Thiên Dật Vũ - 天逸宇 | New Tab**.
3. Nhấn **Remove / Xóa**.
4. Brave sẽ tự khôi phục trang tab mới mặc định.

> Gỡ extension sẽ xóa dữ liệu cài đặt/truy cập nhanh gắn với extension đó. Nếu muốn dùng lại sau này, nên sao chép danh sách site hoặc lưu cả thư mục project ở nơi an toàn.

## Quyền riêng tư

- Extension không gửi danh sách website của bạn đến máy chủ riêng.
- Thời tiết gọi trực tiếp Open-Meteo qua HTTPS.
- Tìm kiếm được mở qua Google khi bạn nhập nội dung không phải URL.
- Danh sách truy cập nhanh được lưu cục bộ trong hồ sơ Brave thông qua `localStorage`.

## Phát triển tiếp

Một số hướng nâng cấp phù hợp nếu muốn mở rộng sau này:

- Kéo thả để đổi vị trí các ô truy cập nhanh.
- Đặt favicon thật cho từng website.
- Đồng bộ danh sách website qua file JSON hoặc GitHub Gist riêng.
- Tạo nhóm: Mạng xã hội, Công việc, Server, Streaming và Dev.
- Thêm chỉ số từ Home Assistant/Proxmox/Docker qua API hoặc endpoint status nội bộ.
- Thêm phím tắt cho từng site và chuyển đổi chủ đề màu.

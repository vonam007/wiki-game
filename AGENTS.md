# 🤖 Hướng Dẫn Dành Cho AI (Agent Instructions): Thêm Game & Guide Mới

Tài liệu này được thiết kế để các AI (ChatGPT, Claude, Gemini, DeepSeek, Cursor, Copilot...) đọc và tạo ra các file HTML hướng dẫn game (guide) chuẩn chỉnh nhất cho hệ thống **Gaming Wiki Hub**.

---

## 📌 1. Nguyên Tắc Cốt Lõi (Core Principles)

1. **Vị trí lưu file**: Mọi bài guide PHẢI được đặt trong thư mục `guides/`.
2. **Không tự chèn Header quay về trang chủ**: Hệ thống build (`build.js`) sẽ **tự động chèn** component `<wiki-nav-hud>` (Shadow DOM) vào đầu thẻ `<body>`. AI **không cần** và **không nên** tự viết thanh điều hướng quay về trang chủ.
3. **Độc lập CSS & Responsive**: File HTML nên có `<style>` nội bộ đẹp mắt, tone màu tối (Dark mode) đồng bộ với phong cách gaming, hiển thị tốt trên cả màn hình máy tính và điện thoại.

---

## 📂 2. Quy Ước Đặt Tên File & Thư Mục

AI có thể chọn 1 trong 2 cách sau để hệ thống tự nhận diện tên game:

### Cách 1: Tiền tố tên game trong ngoặc vuông (Khuyên dùng cho bài lẻ)
```text
guides/[Tên Game] Tieu De Bai Viet.html
```
*Ví dụ:*
- `guides/[Elden Ring] Top Vu Khi Danh Cho Phap Su.html`
- `guides/[Black Myth Wukong] Vi Tri Toan Bo Bi Khi Chuong 2.html`

### Cách 2: Chia theo thư mục con (Khuyên dùng khi có nhiều bài cho 1 game)
```text
guides/<Tên Game>/<tieu-de-bai-viet>.html
```
*Ví dụ:*
- `guides/Monster Hunter Wilds/greatsword-build.html`
- `guides/Cyberpunk 2077/ending-guide.html`

---

## 🏷️ 3. Chuẩn Thẻ Meta (Metadata Requirements)

Trong thẻ `<head>`, AI **bắt buộc** hoặc **khuyến khích** khai báo các thẻ sau:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- BẮT BUỘC: Tiêu đề bài viết hiển thị trên tab và card trang chủ -->
  <title>Tên Game - Tiêu Đề Bài Guide Đầy Đủ</title>
  
  <!-- KHUYẾN KHÍCH: Khai báo chính xác tên game (hệ thống sẽ ưu tiên lấy thẻ này) -->
  <meta name="game" content="Tên Game Chính Xác">
  
  <!-- KHUYẾN KHÍCH: Tóm tắt 1-2 câu ngắn (dưới 180 ký tự) cho thẻ bài viết ở trang chủ -->
  <meta name="description" content="Tóm tắt ngắn gọn nội dung của bài viết để người chơi nắm nhanh.">
</head>
```

---

## 🎨 4. Mẫu Khung HTML Chuẩn (HTML Template Cho AI)

AI hãy sử dụng mẫu khung sườn dưới đây khi tạo bài viết mới:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tên Game - Tiêu Đề Chi Tiết</title>
  <meta name="game" content="Tên Game">
  <meta name="description" content="Tóm tắt ngắn gọn nội dung bài viết...">
  <style>
    :root {
      --bg-body: #0b0f19;
      --bg-card: #131b2e;
      --text-main: #e2e8f0;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --accent-gold: #f59e0b;
      --border: #1e293b;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.7;
      color: var(--text-main);
      background-color: var(--bg-body);
      margin: 0;
      padding: 24px 16px;
    }
    .guide-container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    h1 {
      color: var(--accent-gold);
      font-size: 26px;
      border-bottom: 2px solid rgba(245, 158, 11, 0.3);
      padding-bottom: 12px;
      margin-top: 0;
    }
    h2 {
      color: var(--accent);
      font-size: 20px;
      margin-top: 28px;
    }
    .callout-box {
      background: rgba(56, 189, 248, 0.1);
      border-left: 4px solid var(--accent);
      padding: 12px 16px;
      margin: 16px 0;
      border-radius: 0 8px 8px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 10px 14px;
      text-align: left;
    }
    th {
      background: #1e293b;
      color: var(--accent);
    }
    ul, ol {
      padding-left: 24px;
    }
    li {
      margin-bottom: 8px;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      background: #334155;
      color: #fff;
    }
  </style>
</head>
<body>
  <div class="guide-container">
    <h1>Tiêu Đề Bài Viết Ở Đây</h1>
    <p>Đoạn mở đầu giới thiệu nội dung hướng dẫn.</p>

    <div class="callout-box">
      <strong>💡 Mẹo quan trọng:</strong> Điểm cốt lõi cần lưu ý khi chơi.
    </div>

    <h2>1. Mục Chính Số 1</h2>
    <p>Nội dung chi tiết...</p>

    <!-- Có thể thêm bảng biểu, danh sách, hình ảnh nếu có -->
  </div>
</body>
</html>
```

---

## ✅ 5. Checklist Dành Cho AI Trước Khi Hoàn Thành

- [ ] File đã được lưu vào đúng thư mục `guides/` hoặc thư mục con của `guides/`.
- [ ] Thẻ `<title>` đã có đầy đủ tên game và tiêu đề.
- [ ] Thẻ `<meta name="game" content="...">` đã được khai báo chính xác.
- [ ] Thẻ `<meta name="description" content="...">` có độ dài vừa phải (1 - 2 câu).
- [ ] KHÔNG chèn thanh header quay về trang chủ (hệ thống tự lo việc này).
- [ ] Chạy lệnh kiểm tra build:
  ```bash
  node build.js
  ```
- [ ] Xác nhận bài viết mới xuất hiện trong file `dist/guides.json`.

---

## 💬 6. Mẫu Prompt Người Dùng Có Thể Dùng Để Yêu Cầu AI

Nếu bạn muốn yêu cầu một AI bất kỳ viết guide, hãy copy đoạn này gửi cho AI đó:

> "Hãy đóng vai trò chuyên gia chơi game và viết một bài guide chi tiết về [TÊN GAME HOẶC CHỦ ĐỀ]. Hãy xuất ra định dạng file HTML hoàn chỉnh theo đúng các tiêu chuẩn được quy định trong file AGENTS.md: có thẻ meta game, meta description tóm tắt, giao diện Dark mode gaming hiện đại, nội dung chia mục rõ ràng có bảng biểu/mẹo hay, và KHÔNG cần tự tạo thanh header quay về trang chủ."

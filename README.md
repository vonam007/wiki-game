# 🎮 Gaming Wiki Hub - Sổ Tay Hướng Dẫn Game Cá Nhân

Trang Wiki game cá nhân được thiết kế hiện đại, tối ưu để bạn **quăng các file HTML do AI tạo vào một thư mục**, hệ thống sẽ tự động quét, phân loại tựa game, tạo trang chủ tuyệt đẹp và tự động nhúng **thanh điều hướng (Header) quay về trang chủ** vào từng bài viết!

---

## ✨ Tính Năng Nổi Bật

1. **Thả file HTML là xong (`guides/`)**:
   - Bạn nhờ ChatGPT, Claude, Gemini, DeepSeek tạo guide game ra file `.html`? Chỉ cần ném file vào thư mục `guides/` (hoặc thư mục con bên trong).
   - Hệ thống tự trích xuất: Tiêu đề, Tên Game, Mô tả tóm tắt, Thời gian đọc, Ngày cập nhật.

2. **Header Quay Về Trang Chủ (Gaming HUD) Siêu An Toàn**:
   - Tự động chèn vào đầu mỗi bài guide.
   - Áp dụng **Shadow DOM** cách ly CSS tuyệt đối: Không sợ CSS của AI làm vỡ thanh Header, và Header cũng không làm méo mó giao diện bài viết.
   - Trang bị sẵn: Nút **← Trang Chủ** (hoặc bấm phím `Esc`), Tên Game/Bài viết, Nút **Toàn màn hình**, Nút **Copy link**, Nút **In/Lưu PDF**, và nút **Thu gọn menu** để tập trung chơi game.

3. **Giao Diện Trang Chủ Phong Cách Gaming Hub**:
   - **Dark Mode** hiện đại (Obsidian / Steam / Cyberpunk style).
   - **Tìm kiếm tức thì (Live Search)**: Gõ từ khóa tìm game/bài viết ngay lập tức (phím tắt `/`).
   - **Lọc theo Game & Đã Ghim**: Lọc nhanh các bài theo từng tựa game, hoặc bài yêu thích.
   - **Ghim bài yêu thích (Bookmarks)**: Bấm icon ⭐ để ghim các guide đang cày cuốc lên đầu (lưu trên trình duyệt qua LocalStorage).
   - Chuyển đổi hiển thị dạng **Lưới (Grid)** hoặc **Danh sách gọn (List)**.

4. **Tối Ưu Hoàn Toàn Cho Netlify (Auto-Build)**:
   - Viết bằng Node.js thuần, **không có dependencies nặng**, thời gian build trên Netlify chỉ tốn **dưới 1 giây**!
   - Đã cấu hình sẵn file `netlify.toml`.

---

## 🚀 Hướng Dẫn Sử Dụng

### 1. Thêm Bài Guide Mới Vào Thư Mục `guides/`

Bạn có 3 cách rất linh hoạt để tổ chức:

- **Cách 1: Đặt tên file có tiền tố tên game (Khuyên dùng)**:
  ```
  guides/[Elden Ring] Top Build Phap Su.html
  guides/[Black Myth Wukong] Huong Dan Boss Chuong 1.html
  ```
- **Cách 2: Chia theo thư mục con**:
  ```
  guides/Monster Hunter Wilds/greatsword-guide.html
  guides/Cyberpunk 2077/katana-build.html
  ```
- **Cách 3: Tự đặt tên file tùy ý**:
  Hệ thống sẽ tự nhận diện tựa game nếu trong tiêu đề hoặc nội dung có nhắc đến các game phổ biến, hoặc bạn có thể gắn thẻ `<meta name="game" content="Tên Game Của Bạn">` ở đầu file.

---

### 2. Chạy Thử Tại Máy Của Bạn (Local Dev)

Mở terminal tại thư mục này và chạy:

```bash
npm run dev
```

- Trình duyệt sẽ mở tại `http://localhost:3000`.
- Mỗi khi bạn thêm, sửa hoặc xóa file `.html` trong `guides/`, hệ thống sẽ **tự động rebuild và cập nhật ngay lập tức**!

---

### 3. Deploy Lên Netlify (Tự Động Cập Nhật Khi Push Git)

Hệ thống đã có sẵn file cấu hình `netlify.toml`. Bạn chỉ cần:

1. **Khởi tạo Git & Push lên GitHub / GitLab**:
   ```bash
   git init
   git add .
   git commit -m "Khoi tao Game Wiki"
   git branch -M main
   # Thay bang link repo GitHub cua ban:
   git remote add origin https://github.com/username/ten-repo-wiki.git
   git push -u origin main
   ```

2. **Kết nối với Netlify**:
   - Đăng nhập vào [Netlify.com](https://app.netlify.com).
   - Chọn **Add new site** > **Import an existing project** > Chọn **GitHub**.
   - Chọn kho code wiki của bạn.
   - Netlify sẽ tự đọc `netlify.toml` và điền sẵn:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Bấm **Deploy Site**!

3. **Từ nay về sau**:
   Mỗi khi có guide mới, bạn chỉ việc quăng file vào `guides/` rồi gõ:
   ```bash
   git add .
   git commit -m "Them guide moi"
   git push
   ```
   Netlify sẽ tự động nhận diện và cập nhật trang web sau vài giây!

---

## 📂 Cấu Trúc Dự Án

```
wiki-game/
├── guides/                     # 🎮 NƠI BẠN QUĂNG CÁC FILE HTML VÀO ĐÂY
│   ├── [Black Myth Wukong] Huong Dan Boss Chuong 1.html
│   ├── [Elden Ring] Top Build Phap Su Manh Nhat.html
│   └── Monster Hunter Wilds/
│       └── greatsword-guide.html
├── src/
│   ├── assets/
│   │   ├── style.css           # CSS phong cách Gaming HUD
│   │   └── home.js             # Logic tìm kiếm, lọc game, ghim bài
│   ├── components/
│   │   └── nav-hud.js          # Web Component Shadow DOM cho thanh Header
│   └── template.html           # Template trang chủ
├── build.js                    # Script build siêu tốc cho Netlify (<1s)
├── dev.js                      # Server local có chế độ auto-watch
├── netlify.toml                # File cấu hình deploy tự động của Netlify
├── package.json
└── README.md
```

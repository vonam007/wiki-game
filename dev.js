/**
 * Gaming Wiki - Local Development Server & Auto-Watcher
 * Pure Node.js, 0 dependencies
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { build } = require('./build');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const GUIDES_DIR = path.join(__dirname, 'guides');
const SRC_DIR = path.join(__dirname, 'src');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Start initial build
build();

// HTTP server serving dist/
const server = http.createServer((req, res) => {
  let reqUrl = decodeURI(req.url.split('?')[0]);
  if (reqUrl === '/' || reqUrl === '') reqUrl = '/index.html';

  let filePath = path.join(DIST_DIR, reqUrl);

  // Security check to avoid path traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // If directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h2 style="font-family: sans-serif; color: #e11d48; text-align: center; margin-top: 50px;">
        404 - Không tìm thấy trang!
      </h2>
      <p style="text-align: center; font-family: sans-serif;">
        <a href="/" style="color: #0284c7; text-decoration: none; font-weight: bold;">← Quay về Trang Chủ</a>
      </p>
    `);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🎮 [Game Wiki Server] Đang chạy tại: http://localhost:${PORT}`);
  console.log(`👀 Đang theo dõi thư mục 'guides/' và 'src/'...`);
  console.log(`💡 Chỉ cần quăng file HTML vào thư mục 'guides/', trang sẽ tự build lại ngay lập tức!`);
  console.log('====================================================\n');
});

// Watch for file changes in guides/ and src/
let rebuildTimeout = null;
function triggerRebuild(event, filename) {
  if (rebuildTimeout) clearTimeout(rebuildTimeout);
  rebuildTimeout = setTimeout(() => {
    console.log(`🔄 [Watcher] Phát hiện thay đổi: ${filename || 'file'} (${event}). Đang rebuild...`);
    try {
      build();
    } catch (err) {
      console.error('❌ Lỗi khi rebuild:', err);
    }
  }, 250);
}

if (fs.existsSync(GUIDES_DIR)) {
  fs.watch(GUIDES_DIR, { recursive: true }, triggerRebuild);
}
if (fs.existsSync(SRC_DIR)) {
  fs.watch(SRC_DIR, { recursive: true }, triggerRebuild);
}

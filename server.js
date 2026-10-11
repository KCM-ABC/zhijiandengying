/* ============================================================
   server.js —— 《指尖灯影》零依赖本地服务器
   用法：node server.js   （或双击 启动服务器.bat）
   说明：摄像头与手势模型需要 http(s) 安全上下文，
        请通过本服务器访问，勿直接双击 index.html。
   ============================================================ */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = Number(process.env.PORT) || 8080;
const ROOT = __dirname;
/* 默认只允许本机访问。需要局域网触控演示时，以 LAN=1 启动。 */
const HOST = process.env.LAN === '1' ? '0.0.0.0' : '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.task': 'application/octet-stream',
  '.tflite': 'application/octet-stream',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.bat': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('405 Method Not Allowed');
      return;
    }
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    if (urlPath.includes('\0')) { res.writeHead(400); res.end('Bad Request'); return; }
    const filePath = path.resolve(ROOT, '.' + urlPath);
    /* 防目录穿越：必须位于 ROOT 本身或 ROOT + 路径分隔符之下，不能只比较字符串前缀。 */
    const insideRoot = filePath === ROOT || filePath.startsWith(ROOT + path.sep);
    if (!insideRoot) { res.writeHead(403); res.end('Forbidden'); return; }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found: ' + urlPath);
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        /* 本地演示项目：禁止浏览器缓存任何资源，避免改版后出现新旧混搭 */
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Permissions-Policy': 'camera=(self), microphone=(), geolocation=()',
      });
      res.end(req.method === 'HEAD' ? undefined : data);
    });
  } catch (e) {
    res.writeHead(500); res.end('Server Error');
  }
});

server.on('error', e => {
  /* 端口被占用：多半是服务器已经在运行了，给个明白话而不是一屏报错 */
  if (e.code === 'EADDRINUSE') {
    console.log('');
    console.log('  ⚠ 端口 8080 已被占用：服务器可能已经在运行');
    console.log('  👉 直接打开浏览器访问 http://localhost:8080 即可');
  } else {
    console.log('服务器启动失败：' + e.message);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const url = `http://localhost:${PORT}`;
  console.log('');
  console.log('  🏮 《指尖灯影》已亮灯');
  console.log(`  👉 请用浏览器打开：${url}`);
  console.log(HOST === '127.0.0.1'
    ? '  🔒 当前仅本机可访问；局域网触控演示请运行“启动局域网演示.bat”'
    : '  ⚠ 当前已开放局域网访问；移动端 HTTP 仅保证触控，摄像头手势需要 HTTPS');
  console.log('  （关闭本窗口即停止服务）');
  console.log('');
  /* 自动打开默认浏览器（后台静默启动时跳过，避免突然弹出窗口） */
  if (!process.env.NO_BROWSER) {
    try {
      exec(process.platform === 'win32' ? `start "" "${url}"` : `open "${url}"`);
    } catch (e) { /* 打不开就手动访问 */ }
  }
});

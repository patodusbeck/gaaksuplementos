const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const host = "127.0.0.1";
const port = Number(process.env.E2E_PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const resolvePath = (urlPath) => {
  const normalized = decodeURIComponent(String(urlPath || "/").split("?")[0]);
  const filePath = normalized === "/" ? "/index.html" : normalized;
  const absolute = path.normalize(path.join(root, filePath));
  if (!absolute.startsWith(root)) return null;
  return absolute;
};

const server = http.createServer((req, res) => {
  const absolute = resolvePath(req.url || "/");
  if (!absolute) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad Request");
    return;
  }

  fs.stat(absolute, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }

    const ext = path.extname(absolute).toLowerCase();
    const contentType = contentTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(absolute).pipe(res);
  });
});

server.listen(port, host, () => {
  process.stdout.write(`static-server listening on http://${host}:${port}\n`);
});

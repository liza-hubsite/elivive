/* eslint-disable no-console */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = process.cwd();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = parseInt(process.env.PORT || "5173", 10);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp"
};

function normalizeRequestPath(rawPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch {
    return null;
  }
  const withoutQuery = decoded.split("?")[0].split("#")[0];
  const stripped = withoutQuery.replace(/^\/+/, "");
  const normalized = path.normalize(stripped);
  const safeRelativePath = normalized.replace(/^(\.\.(\/|\\|$))+/, "");
  return safeRelativePath || "index.html";
}

function resolveFilePath(requestPath) {
  const relativePath = normalizeRequestPath(requestPath);
  if (!relativePath) {
    return null;
  }
  const absolutePath = path.resolve(ROOT_DIR, relativePath);
  const insideRoot =
    absolutePath === ROOT_DIR || absolutePath.startsWith(ROOT_DIR + path.sep);

  if (!insideRoot) {
    return null;
  }

  return absolutePath;
}

function sendResponse(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });

  const stream = fs.createReadStream(filePath);
  stream.on("error", () => sendResponse(res, 500, "Internal server error."));
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    sendResponse(res, 400, "Bad request.");
    return;
  }

  const initialPath = resolveFilePath(req.url);
  if (!initialPath) {
    sendResponse(res, 403, "Forbidden.");
    return;
  }

  fs.stat(initialPath, (statError, stat) => {
    if (statError) {
      sendResponse(res, 404, "Not found.");
      return;
    }

    if (stat.isDirectory()) {
      const indexPath = path.join(initialPath, "index.html");
      fs.stat(indexPath, (indexError, indexStat) => {
        if (indexError || !indexStat.isFile()) {
          sendResponse(res, 404, "Not found.");
          return;
        }
        serveFile(indexPath, res);
      });
      return;
    }

    if (!stat.isFile()) {
      sendResponse(res, 404, "Not found.");
      return;
    }

    serveFile(initialPath, res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Dev server running at http://${HOST}:${PORT}`);
  console.log("Press Ctrl+C to stop.");
});

server.on("error", (error) => {
  if (error && error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Set a different port with PORT=####.`);
    process.exit(1);
  }

  console.error("Server error:", error);
  process.exit(1);
});

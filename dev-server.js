const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "127.0.0.1";
const defaultPort = Number(process.env.PORT) || 3000;
const rootDir = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function sendFile(filePath, response) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=UTF-8" });
      response.end("Internal server error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream"
    });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  const requestPath = request.url === "/" ? "/index.html" : request.url;
  const safePath = path.normalize(requestPath).replace(/^(\.\.[\\/])+/, "");
  const filePath = path.join(rootDir, safePath);

  if (!filePath.startsWith(rootDir)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=UTF-8" });
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=UTF-8" });
      response.end("Not found");
      return;
    }

    sendFile(filePath, response);
  });
});

function startServer(port) {
  server
    .once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        startServer(port + 1);
        return;
      }

      throw error;
    })
    .listen(port, host, () => {
      console.log(`Talme Connects site running at http://${host}:${port}`);
    });
}

startServer(defaultPort);

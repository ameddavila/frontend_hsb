// server.js
const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const certPath = path.join(__dirname, "certificates", "cert.pem");
const keyPath = path.join(__dirname, "certificates", "key.pem");

app.prepare().then(() => {
  createServer(
    {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
    (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }
  ).listen(3000, (err) => {
    if (err) throw err;
    console.log("✅ Servidor HTTPS corriendo en https://localhost:3000");
  });
});

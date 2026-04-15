const http = require("http");
const fs = require("fs");
const path = require("path");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const port = 2909;
const mimeTypes = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  json: "application/json",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  ico: "image/x-icon",
};

const API_KEY = process.env.SENDGRID_API_KEY;
console.log("Using SendGrid API Key:", API_KEY);
sgMail.setApiKey(API_KEY);

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function handleApiRequest(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  parseRequestBody(req)
    .then((body) => {
      let msg;

      if (req.url === "/api/visit-booking") {
        msg = {
          to: body.email,
          from: "studiesmedina@gmail.com",
          subject: "Your visit booking at Zoolondia Park",
          text:
            `Dear ${body.name},\n\nThank you for booking a visit to Zoolondia Park!\n\n` +
            `Date: ${body.date}\nNumber of tickets: ${body.tickets}\nType: ${body.type}\n\n` +
            "We look forward to welcoming you!\n\nBest regards,\nZoolondia Team",
        };
      } else if (req.url === "/api/table-reservation") {
        msg = {
          to: body.resEmail,
          from: "studiesmedina@gmail.com",
          subject: "Your table reservation at Food Corner",
          text:
            `Dear ${body.resName},\n\nThank you for reserving a table at Food Corner!\n\n` +
            `Date: ${body.resDate}\nTime: ${body.resTime}\nNumber of guests: ${body.guests}\n\n` +
            "We look forward to serving you!\n\nBest regards,\nFood Corner Team",
        };
      } else {
        sendJson(res, 404, { error: "API route not found" });
        return;
      }

      return sgMail.send(msg).then(() => {
        sendJson(res, 200, { success: true });
      });
    })
    .catch((error) => {
      console.error(error);
      sendJson(res, 400, { error: "Invalid request payload" });
    });
}

const server = http.createServer((req, res) => {
  if (
    req.url === "/api/visit-booking" ||
    req.url === "/api/table-reservation"
  ) {
    handleApiRequest(req, res);
    return;
  }

  let filePath;

  if (req.url === "/") {
    filePath = path.join(__dirname, "src", "homepage.html");
  } else if (req.url === "/homepage.html") {
    filePath = path.join(__dirname, "src", "homepage.html");
  } else if (req.url.endsWith(".html")) {
    const requestedPage = path.basename(req.url);
    filePath = path.join(__dirname, "src", requestedPage);
  } else if (req.url.endsWith(".json")) {
    const requestedJson = path.basename(req.url);
    filePath = path.join(__dirname, "data", requestedJson);
  } else if (
    req.url.startsWith("/css/") ||
    req.url.startsWith("/js/") ||
    req.url.startsWith("/images/")
  ) {
    filePath = path.join(__dirname, req.url);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).slice(1).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

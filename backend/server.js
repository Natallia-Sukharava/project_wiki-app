import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import path from "path";
import fs from "fs";
import { WebSocketServer } from "ws";

import articlesRouter from "./routes/articles.js";

import db from "./models/index.js";

const app = express();
const server = http.createServer(app);
const PORT = 4000;

export const wss = new WebSocketServer({ server, path: "/ws" });

function broadcast(event) {
  const payload = JSON.stringify(event);
  for (const client of wss.clients) {
    try { client.send(payload); } catch {}
  }
}

export function notifyArticleCreated(article) {
  broadcast({ type: "article_created", articleId: article.id, title: article.title, at: Date.now()
  });
}

export function notifyArticleUpdated(article) {
  broadcast({ type: "article_updated", articleId: article.id, title: article.title, at: Date.now()});
}
export function notifyAttachmentAdded(articleId, file) {
  broadcast({ type: "attachment_added", articleId, fileName: file.originalname || file.filename, at: Date.now() });
}

app.use(cors());
app.use(bodyParser.json());

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use("/uploads", express.static(uploadsDir));

app.use("/api/articles", articlesRouter);

app.get("/", (req, res) => {
  res.send("Backend is running with WS and uploads!");
});

db.sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('DB error', err));

server.listen(PORT, () => {
  console.log(`HTTP+WS server at http://localhost:${PORT}`);
  console.log(`WebSocket endpoint ws://localhost:${PORT}/ws`);
});

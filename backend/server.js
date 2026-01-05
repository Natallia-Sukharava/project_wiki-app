import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import fs from "fs";
import { WebSocketServer } from "ws";
import workspacesRouter from "./routes/workspaces.js";
import commentsRoutes from './routes/comments.js';
import articlesRouter from "./routes/articles.js";
import articleVersionsRoutes from "./routes/articleVersions.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import authRouter from "./routes/auth.js";
import db from "./models/index.js";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

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
app.use(express.json());
app.use("/api/workspaces", workspacesRouter);

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

const uploadsDir = path.join(currentDirPath, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use("/uploads", express.static(uploadsDir));

app.use("/api/articles", authMiddleware, articlesRouter);
app.use("/api/comments", authMiddleware, commentsRoutes);
app.use("/api/article-versions", authMiddleware, articleVersionsRoutes);

app.use('/api', commentsRoutes);

app.use("/api", articleVersionsRoutes);

app.use("/api/auth", authRouter);

//http://localhost:4000/ 
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

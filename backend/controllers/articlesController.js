import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

const dataDir = path.join(currentDir, "../data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

export const getAllArticles = (req, res) => {
  try {
    const files = fs.readdirSync(dataDir);
    const articles = files.map((file) => {
      const content = JSON.parse(fs.readFileSync(path.join(dataDir, file)));
      return { id: file.replace(".json", ""), title: content.title };
    });
    res.json(articles);
  } catch (err) {
    console.error("Error reading articles:", err);
    res.status(500).json({ error: "Failed to read articles" });
  }
};

export const getArticleById = (req, res) => {
  const filePath = path.join(dataDir, `${req.params.id}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Article not found" });
  }
  const article = JSON.parse(fs.readFileSync(filePath));
  res.json(article);
};

export const createArticle = (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const id = Date.now().toString();
  const filePath = path.join(dataDir, `${id}.json`);
  const newArticle = { id, title, content, createdAt: new Date().toISOString() };

  fs.writeFileSync(filePath, JSON.stringify(newArticle, null, 2));
  res.json(newArticle);
};
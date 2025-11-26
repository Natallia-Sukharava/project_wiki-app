import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { notifyArticleCreated, notifyArticleUpdated } from "../server.js";

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

  const newArticle = {
    id,
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(newArticle, null, 2));

  notifyArticleCreated(newArticle);

  return res.json(newArticle);
};

export const updateArticle = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const filePath = path.join(dataDir, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Article not found" });
  }

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const updatedArticle = {
      id,
      title,
      content,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(updatedArticle, null, 2));

    notifyArticleUpdated(updatedArticle);

    return res.json(updatedArticle);
  } catch (err) {
    console.error("Error updating article:", err);
    return res.status(500).json({ error: "Failed to update article" });
  }
};

export const deleteArticle = (req, res) => {
  const { id } = req.params;
  const filePath = path.join(dataDir, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Article not found" });
  }

  try {
    fs.unlinkSync(filePath);
    return res.json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error("Error deleting article:", err);
    return res.status(500).json({ error: "Failed to delete article" });
  }
};

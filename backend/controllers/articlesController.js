import db from "../models/index.js";
import { notifyArticleCreated, notifyArticleUpdated } from "../server.js";

const Article = db.Article;

// GET /api/articles
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      attributes: ["id", "title"]
    });

    res.json(articles);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

// GET /api/articles/:id
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) return res.status(404).json({ error: "Not found" });

    res.json(article);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to fetch article" });
  }
};

// POST /api/articles
export const createArticle = async (req, res) => {
  const { title, content, workspaceId = 1 } = req.body;

  try {
    const article = await Article.create({ title, content, workspaceId });

    notifyArticleCreated(article);

    res.json(article);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to create article" });
  }
};

// PUT /api/articles/:id
export const updateArticle = async (req, res) => {
  const { title, content } = req.body;

  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) return res.status(404).json({ error: "Not found" });

    article.title = title;
    article.content = content;

    await article.save();

    notifyArticleUpdated(article);

    res.json(article);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to update article" });
  }
};

// DELETE /api/articles/:id
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) return res.status(404).json({ error: "Not found" });

    await article.destroy();

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to delete article" });
  }
};

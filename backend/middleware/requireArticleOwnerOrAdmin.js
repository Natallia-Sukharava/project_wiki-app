import db from "../models/index.js";

export async function requireArticleOwnerOrAdmin(req, res, next) {
  try {
    const article = await db.Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const isOwner = article.userId === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: "You do not have permission to edit this article",
      });
    }

    req.article = article; 
    next();
  } catch (error) {
    console.error("RBAC error:", error);
    res.status(500).json({ error: "Permission check failed" });
  }
}

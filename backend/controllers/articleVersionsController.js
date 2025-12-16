import db from "../models/index.js";

const ArticleVersion = db.ArticleVersion;

// GET /api/articles/:id/versions
export const getArticleVersions = async (req, res) => {
  try {
    const versions = await ArticleVersion.findAll({
      where: { articleId: req.params.id },
      attributes: ["id", "versionNumber", "createdAt"],
      order: [["versionNumber", "DESC"]],
    });

    res.json(versions);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to fetch versions" });
  }
};

// GET /api/article-versions/:versionId
export const getArticleVersionById = async (req, res) => {
    try {
      const version = await ArticleVersion.findByPk(req.params.versionId);
  
      if (!version) {
        return res.status(404).json({ error: "Version not found" });
      }
  
      res.json(version);
    } catch (err) {
      console.error("DB error:", err);
      res.status(500).json({ error: "Failed to fetch version" });
    }
  };
  
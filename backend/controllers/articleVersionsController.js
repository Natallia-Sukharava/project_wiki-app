import db from "../models/index.js";

const ArticleVersion = db.ArticleVersion;
const Article = db.Article;

/**
 * GET /api/article-versions/:id
 * Получить список версий статьи (БЕЗ currentVersion, как было)
 */
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

/**
 * GET /api/article-versions/article/:id/with-current
 * Получить версии + currentVersion + isLatest
 */
export const getArticleVersionsWithCurrent = async (req, res) => {
  try {
    const { id } = req.params;

    // существует ли статья
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const versions = await ArticleVersion.findAll({
      where: { articleId: id },
      attributes: ["id", "versionNumber", "createdAt"],
      order: [["versionNumber", "ASC"]],
    });

    if (!versions.length) {
      return res.json({
        currentVersion: null,
        versions: [],
      });
    }

    const currentVersionNumber =
      versions[versions.length - 1].versionNumber;

    // isLatest
    const versionsWithFlag = versions.map((version) => ({
      id: version.id,
      versionNumber: version.versionNumber,
      createdAt: version.createdAt,
      isLatest: version.versionNumber === currentVersionNumber,
    }));

    res.json({
      currentVersion: currentVersionNumber,
      versions: versionsWithFlag,
    });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to fetch versions with current" });
  }
};

/**
 * GET /api/article-versions/version/:versionId
 * Получить конкретную версию статьи
 */
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

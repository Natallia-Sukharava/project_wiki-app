import db from '../models/index.js';
import { notifyArticleCreated, notifyArticleUpdated } from '../server.js';
import { Op } from 'sequelize';
import { writeArticlePdfToResponse } from '../utils/pdf.js';

const Article = db.Article;
const ArticleVersion = db.ArticleVersion;

// GET /api/articles
export const getAllArticles = async (req, res) => {
  const { search } = req.query;
  try {
    const whereCondition = {};

    if (search && search.trim() !== '') {
      whereCondition[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          content: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const articles = await Article.findAll({
      attributes: ['id', 'title', 'workspaceId'],
      where: whereCondition,
      include: [
        {
          model: db.Workspace,
          as: 'workspace',
          attributes: ['name'],
        },
        {
          model: db.User,
          as: 'author',
          attributes: ['id', 'email', 'role'],
        },
      ],
    });

    res.json(articles);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// GET /api/articles/:id
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [
        {
          model: db.Workspace,
          as: 'workspace',
          attributes: ['name'],
        },
        {
          model: db.Comment,
          as: 'comments',
        },
        {
          model: db.User,
          as: 'author',
          attributes: ['id', 'email', 'role'],
        },
      ],
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// POST /api/articles
export const createArticle = async (req, res) => {
  const { title, content, workspaceId } = req.body;

  if (!workspaceId) {
    return res.status(400).json({ error: 'workspaceId is required' });
  }

  try {
    const article = await Article.create({
      title,
      content,
      workspaceId,
      userId: req.user.id,
    });

    // создаём первую версию статьи
    await ArticleVersion.create({
      articleId: article.id,
      title,
      content,
      workspaceId,
      versionNumber: 1,
    });

    notifyArticleCreated(article);

    res.json(article);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to create article' });
  }
};

// PUT /api/articles/:id VERSIONING
export const updateArticle = async (req, res) => {
  const { title, content } = req.body;

  try {
    const article = req.article;

    if (!article) {
      return res.status(404).json({ error: 'Not found' });
    }

    // последняя версия
    const lastVersion = await ArticleVersion.findOne({
      where: { articleId: article.id },
      order: [['versionNumber', 'DESC']],
    });

    const nextVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

    // сохраняем текущую статью как версию
    await ArticleVersion.create({
      articleId: article.id,
      title,
      content,
      workspaceId: article.workspaceId,
      versionNumber: nextVersionNumber,
    });

    // обновляем текущую статью
    article.title = title;
    article.content = content;
    await article.save();

    notifyArticleUpdated(article);

    res.json(article);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to update article' });
  }
};

// DELETE /api/articles/:id
export const deleteArticle = async (req, res) => {
  try {
    const article = req.article;

    if (!article) {
      return res.status(404).json({ error: 'Not found' });
    }

    await article.destroy();

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
};

export const getArticleVersions = async (req, res) => {
  try {
    const article = req.article; // requireArticleOwnerOrAdmin

    const versions = await db.ArticleVersion.findAll({
      where: { articleId: article.id },
      order: [['versionNumber', 'DESC']],
    });

    res.json(versions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load versions' });
  }
};

// GET /api/articles/:id/pdf
export const exportArticlePdf = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [
        { model: db.Workspace, as: 'workspace', attributes: ['name'] },
        { model: db.User, as: 'author', attributes: ['email'] },
      ],
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // PDF стримится в ответ
    writeArticlePdfToResponse(res, article);
  } catch (err) {
    console.error('PDF export error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

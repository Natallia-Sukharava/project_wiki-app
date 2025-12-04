import db from '../models/index.js';

const { Article, Comment } = db;

export const getCommentsForArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const comments = await Comment.findAll({
      where: { articleId },
      order: [['createdAt', 'ASC']],
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCommentForArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const comment = await Comment.create({
      articleId,
      content,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (content !== undefined) {
      comment.content = content;
    }

    await comment.save();

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  getCommentsForArticle,
  createCommentForArticle,
  updateComment,
  deleteComment,
};

import { Router } from 'express';
import {
  getCommentsForArticle,
  createCommentForArticle,
  updateComment,
  deleteComment,
} from '../controllers/commentsController.js';

const router = Router();

router.get('/articles/:articleId/comments', getCommentsForArticle);
router.post('/articles/:articleId/comments', createCommentForArticle);

router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

export default router;

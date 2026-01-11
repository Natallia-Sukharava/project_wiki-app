import express from "express";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleVersions
} from "../controllers/articlesController.js";
import attachmentsRouter from "./attachments.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireArticleOwnerOrAdmin } from "../middleware/requireArticleOwnerOrAdmin.js";

const router = express.Router();

router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.post("/", createArticle);
router.put("/:id", requireArticleOwnerOrAdmin, updateArticle);
router.delete("/:id", requireArticleOwnerOrAdmin, deleteArticle);
router.use("/:id/attachments", attachmentsRouter);
router.get("/:id/versions", requireArticleOwnerOrAdmin, getArticleVersions);

export default router;

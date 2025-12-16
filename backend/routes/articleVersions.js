import express from "express";
import {
  getArticleVersions,
  getArticleVersionById,
} from "../controllers/articleVersionsController.js";

const router = express.Router();

router.get("/articles/:id/versions", getArticleVersions);
router.get("/article-versions/:versionId", getArticleVersionById);

export default router;

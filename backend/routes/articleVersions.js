import express from "express";
import {
  getArticleVersions,
  getArticleVersionById,
  getArticleVersionsWithCurrent,
} from "../controllers/articleVersionsController.js";

const router = express.Router();

router.get("/:articleId", getArticleVersions);
router.get("/article/:id/with-current", getArticleVersionsWithCurrent);
router.get("/version/:versionId", getArticleVersionById);

export default router;
import express from "express";
import {
  createWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceArticles
} from "../controllers/workspacesController.js";

const router = express.Router();

router.get("/", getAllWorkspaces);
router.get("/:id", getWorkspaceById);
router.get("/:id/articles", getWorkspaceArticles);
router.post("/", createWorkspace);
router.put("/:id", updateWorkspace);
router.delete("/:id", deleteWorkspace);

export default router;

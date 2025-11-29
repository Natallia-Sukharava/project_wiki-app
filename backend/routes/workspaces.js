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

// Get all workspaces
router.get("/", getAllWorkspaces);

// Get one workspace + its articles
router.get("/:id", getWorkspaceById);

// Get only articles of workspace (optional separate endpoint)
router.get("/:id/articles", getWorkspaceArticles);

// Create workspace
router.post("/", createWorkspace);

// Update workspace
router.put("/:id", updateWorkspace);

// Delete workspace
router.delete("/:id", deleteWorkspace);

export default router;

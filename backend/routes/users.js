import express from "express";
import db from "../models/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

// All routes here require login + admin
router.use(authMiddleware);
router.use(requireAdmin);

// GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ["id", "email", "role", "createdAt"],
      order: [["id", "ASC"]],
    });

    res.json(users);
  } catch (error) {
    console.error("Users fetch error:", error);
    res.status(500).json({ error: "Failed to load users" });
  }
});

// PATCH /api/users/:id/role
router.patch("/:id/role", async (req, res) => {
  const { role } = req.body;

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Invalid role value" });
  }

  try {
    const user = await db.User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Role update error:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
});

export default router;

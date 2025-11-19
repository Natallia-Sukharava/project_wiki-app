import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { notifyAttachmentAdded } from "../server.js";

const router = express.Router({ mergeParams: true });

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const uploadsRoot = path.join(process.cwd(), "uploads");

const ALLOWED = new Set(["image/jpeg", "image/png", "application/pdf"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { id } = req.params;
    const dir = path.join(uploadsRoot, id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/[^\w.\-]+/g, "_");
    cb(null, safeName);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED.has(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, or PDF allowed"));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", upload.single("file"), (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const url = `/uploads/${id}/${file.filename}`;

  notifyAttachmentAdded(id, file);

  res.json({
    fileName: file.originalname,
    storedAs: file.filename,
    url,
    mimetype: file.mimetype,
    size: file.size,
  });
});

router.delete("/:filename", (req, res) => {
  const { id, filename } = req.params;

  const filePath = path.join(uploadsRoot, id, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  try {
    fs.unlinkSync(filePath);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete file" });
  }
});

router.get("/", (req, res) => {
  const { id } = req.params;
  const dir = path.join(uploadsRoot, id);

  if (!fs.existsSync(dir)) return res.json([]);

  const list = fs.readdirSync(dir).map((name) => ({
    storedAs: name,
    url: `/uploads/${id}/${name}`,
  }));

  res.json(list);
});

export default router;

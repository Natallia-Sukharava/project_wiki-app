import express from "express";
import bcrypt from "bcrypt";
import db from "../models/index.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const User = db.User;

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // simple validation: required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

     // simple validation: email format
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    
    // simple validation: password length
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // check if user exists
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      email,
      passwordHash,
    });

    res.json({
      id: user.id,
      email: user.email,
      message: "User registered successfully",
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Configure it in .env");
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // create token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );    

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }      
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;

const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const router = express.Router();

// 1. Mulai proses login Google (redirect user ke halaman Google)
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Callback dari Google setelah user login
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failed",
    session: true,
  }),
  (req, res) => {
    const { displayName, emails, photos } = req.user;

    const email = emails?.[0]?.value || req.user.email || "noemail@example.com";
    const photo = photos?.[0]?.value || req.user.photo || "";

    res.redirect(
      `${process.env.FRONTEND_URL}/auth-success?email=${encodeURIComponent(email)}&displayName=${encodeURIComponent(displayName)}&photo=${encodeURIComponent(photo)}`
    );
  }
);

// 3. Endpoint untuk cek status user yang sedang login
router.get("/user", (req, res) => {
  if (req.user) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
});

// 4. Logout user
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.FRONTEND_URL}/login`);
  });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0 || rows[0].provider !== "local") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      username: user.username,
      nama_lengkap: user.nama_lengkap,
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Register with MysQl
router.post("/register", async (req, res) => {
  const { username, password, email, nama_lengkap } = req.body;

  if (!username || !password || !email || !nama_lengkap) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, password, email, nama_lengkap, provider) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, email, nama_lengkap, "local"]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

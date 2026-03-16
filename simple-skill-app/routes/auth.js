// routes/auth.js

const express = require("express");
const router = express.Router();

// LOGOUT ROUTE
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // clear the session cookie
    res.json({ message: "Logged out successfully" });
  });
});

// Check if user is authenticated
router.get("/session", (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
    
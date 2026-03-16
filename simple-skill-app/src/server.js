const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const skillProfileRoutes = require("../routes/skillProfile");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("./user");
const SkillProfileModel = require("../models/SkillProfile");
const authRoutes = require("../routes/auth");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true                // ⬅️ Important!
}));
app.use(bodyParser.json());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/skillswap", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Session setup with FileStore
app.use(
  session({
    store: new FileStore({
      path: "./sessions", // Folder to save sessions
      ttl: 3600,           // Session time-to-live in seconds
    }),
    secret: "skill-secret",   // Change in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Register
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
  req.session.userId = user._id;
  console.log("User ID stored in session:", req.session.userId);
  res.status(200).json({ message: "Login successful " });
});

// Check Session
app.get("/api/session", (req, res) => {
  console.dir(req.session);
  console.log("User ID stored in session:", req.session.userId);
  if (req.session.userId) {
    res.json({ loggedIn: true, userId: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
});

app.use("/api/skill-profile", skillProfileRoutes);
app.use("/api", authRoutes); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

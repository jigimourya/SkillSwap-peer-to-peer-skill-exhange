const express = require("express");
const router = express.Router();
const SkillProfileModel = require("../models/SkillProfile");
const { spawn } = require("child_process");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
// Middleware to check if user is authenticated via session
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
}
router.use(isAuthenticated); // applies to all routes below it

// Make sure uploads directory exists
const uploadPath = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Multer setup to store uploaded files locally in /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Upload endpoint for profile picture
router.post("/upload-image", upload.single("profilePic"), async (req, res) => {
  try {
    // const userId = req.user.id; // Assuming you have auth middleware
    const userId = req.session.userId; // Get userId from session
    const filename = req.file.filename;
    console.log("Upload image userId:", userId);
    // Optionally delete old image
    const user = await SkillProfileModel.findOne({ userId });

    if (user && user.imageUrl) {
      const oldPath = path.join(__dirname, "..","public/uploads", path.basename(user.imageUrl));
      console.log("Old image path:", oldPath);
      if (fs.existsSync(oldPath)) {
        console.log("Deleting old image:", oldPath);
        fs.unlinkSync(oldPath); // delete old file
      }
    }

    const imageUrl = `/uploads/${filename}`;

    res.json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});
// POST /api/explore/matches
router.post("/explore/matches", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const currentUser = await SkillProfileModel.findOne({ userId });
    if (!currentUser) return res.status(404).json({ message: "Your profile not found" });

    const allUsers = await SkillProfileModel.find({ userId: { $ne: userId } });

    const matches = allUsers.map(user => {
      const matchScore =
        user.skills.filter(skill => currentUser.learningInterests.includes(skill)).length +
        user.learningInterests.filter(skill => currentUser.skills.includes(skill)).length;

      return {
        userId: user.userId,
        fullName: user.fullName,
        bio: user.bio,
        skills: user.skills,
        learningInterests: user.learningInterests,
        score: matchScore,
      };
    });

    matches.sort((a, b) => b.score - a.score);

    res.json({ matches });
  } catch (err) {
    console.error("Explore Matches Error:", err);
    res.status(500).json({ message: "Failed to fetch matches" });
  }
});

// Get current user's skill profile
router.get("/me", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const profile = await SkillProfileModel.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Get all skill profiles (with optional skill filtering)
router.get("/", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const skillFilter = req.query.skill;

    let profiles;
    if (skillFilter) {
      profiles = await SkillProfileModel.find({
        skills: { $regex: new RegExp(skillFilter, "i") }
      });
    } else {
      profiles = await SkillProfileModel.find({});
    }

    res.json(profiles);
  } catch (err) {
    console.error("Explore Profiles Error:", err);
    res.status(500).json({ message: "Failed to fetch profiles" });
  }
});

// Create skill profile
router.post("/", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { fullName, skills, learningInterests, bio, imageUrl } = req.body;

    const existing = await SkillProfileModel.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = new SkillProfileModel({
      userId,
      fullName,
      skills,
      learningInterests,
      bio,
      imageUrl,
    });

    await profile.save();

    res.status(201).json({ message: "Profile created", profile });
  } catch (err) {
    console.error("Create Profile Error:", err);
    res.status(500).json({ message: "Failed to create profile" });
  }
});


// Update profile
router.put("/", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { fullName, skills, learningInterests, bio, imageUrl } = req.body;

    // Get the current profile to check for old image
    const existingProfile = await SkillProfileModel.findOne({ userId });

    // Delete old image if it exists and a new image is being uploaded
    if (
      existingProfile &&
      existingProfile.imageUrl &&
      existingProfile.imageUrl !== imageUrl
    ) {
      const oldImagePath = path.join(__dirname, "..", "uploads", path.basename(existingProfile.imageUrl));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // delete old file
      }
    }

    const profile = await SkillProfileModel.findOneAndUpdate(
      { userId },
      { fullName, skills, learningInterests, bio, imageUrl },
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({ message: "Profile updated", profile });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// Delete profile
router.delete("/", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const profile = await SkillProfileModel.findOneAndDelete({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({ message: "Profile deleted" });
  } catch (err) {
    console.error("Delete Profile Error:", err);
    res.status(500).json({ message: "Failed to delete profile" });
  }
});

// Get AI-generated recommendations
router.get("/recommendations/:userId", async (req, res) => {
  const userId = req.params.userId;
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
  });
  const pythonScriptPath = path.join(__dirname, "../AI-model/test_run.py");

  const pyProcess = spawn("python", ["-u", pythonScriptPath, userId]);

  let output = "";
  pyProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pyProcess.stderr.on("data", (err) => {
    console.error("Python error:", err.toString());
  });

  pyProcess.on("close", () => {
    try {
      const recommendations = JSON.parse(output);
      if (Array.isArray(recommendations)) {
        res.json({ matches: recommendations });
      } else {
        res.json({ matches: recommendations ? [recommendations] : [] });
      }
    } catch (e) {
      res.status(500).json({ error: "Failed to parse Python output." });
    }
  });
});

module.exports = router;

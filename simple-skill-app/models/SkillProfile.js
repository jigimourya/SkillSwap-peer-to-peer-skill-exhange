// import SkillProfile from "../src/SkillProfile";

const mongoose = require("mongoose");

const SkillProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Referencing the User collection
    required: true
  },
  fullName: { type: String, required: true },
  skills: [String],
  learningInterests: [String],
  bio: String,
  imageUrl: String,
});

module.exports = mongoose.model("skill_profile", SkillProfileSchema);


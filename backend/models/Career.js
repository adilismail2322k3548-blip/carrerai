const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Career title is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    // Keywords used during weighted scoring (interests, skills, subjects, etc.)
    keywords: {
      type: [String],
      default: [],
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    futureScope: {
      type: String,
      default: '',
    },
    // Base weight applied in scoring algorithm (1–10)
    weight: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Career', CareerSchema);

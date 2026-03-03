const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Interests: list of areas the student enjoys
    interests: {
      type: [String],
      required: true,
    },
    // Skills: technical or soft skills the student possesses
    skills: {
      type: [String],
      required: true,
    },
    // Strengths selected from predefined options
    strengths: {
      type: [String],
      default: [],
    },
    // Weaknesses acknowledged by the student
    weaknesses: {
      type: [String],
      default: [],
    },
    // Academic performance as a GPA or percentage string
    academicPerformance: {
      type: String,
      default: '',
    },
    // Personality traits (e.g., introverted, creative)
    personalityTraits: {
      type: [String],
      default: [],
    },
    // Preferred subjects
    preferredSubjects: {
      type: [String],
      default: [],
    },
    // Raw numeric scores computed by the scoring service
    scores: {
      type: Map,
      of: Number,
      default: {},
    },
    // Top career recommendations returned by the AI
    recommendations: {
      type: [
        {
          careerTitle: String,
          matchPercentage: Number,
          confidenceScore: Number,
          reasoning: String,
          requiredSkills: [String],
          skillGapAnalysis: String,
          learningRoadmap: [String],
          futureScope: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', AssessmentSchema);

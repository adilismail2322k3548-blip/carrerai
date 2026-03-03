const Assessment = require('../models/Assessment');
const Career = require('../models/Career');
const { computeCareerScores } = require('../services/scoringService');
const { getCareerRecommendations } = require('../services/groqService');

// POST /api/assessment  – submit assessment and get recommendations
const submitAssessment = async (req, res) => {
  try {
    const {
      interests,
      skills,
      strengths,
      weaknesses,
      academicPerformance,
      personalityTraits,
      preferredSubjects,
    } = req.body;

    if (!interests || !skills) {
      return res.status(400).json({ message: 'Interests and skills are required' });
    }

    // 1. Load active careers from database
    const careers = await Career.find({ isActive: true });
    if (careers.length === 0) {
      return res.status(503).json({ message: 'No career data available. Ask admin to seed careers.' });
    }

    const assessmentData = {
      interests: Array.isArray(interests) ? interests : [interests],
      skills: Array.isArray(skills) ? skills : [skills],
      strengths: Array.isArray(strengths) ? strengths : strengths ? [strengths] : [],
      weaknesses: Array.isArray(weaknesses) ? weaknesses : weaknesses ? [weaknesses] : [],
      academicPerformance: academicPerformance || '',
      personalityTraits: Array.isArray(personalityTraits) ? personalityTraits : personalityTraits ? [personalityTraits] : [],
      preferredSubjects: Array.isArray(preferredSubjects) ? preferredSubjects : preferredSubjects ? [preferredSubjects] : [],
    };

    // 2. Compute weighted scores
    const careerScores = computeCareerScores(assessmentData, careers);

    // 3. Get AI recommendations from Groq
    const recommendations = await getCareerRecommendations(assessmentData, careerScores);

    // 4. Persist to database
    const scoresMap = {};
    careerScores.forEach((c) => { scoresMap[c.title] = c.score; });

    const assessment = await Assessment.create({
      user: req.user._id,
      ...assessmentData,
      scores: scoresMap,
      recommendations,
    });

    return res.status(201).json({ assessment });
  } catch (err) {
    console.error('Assessment error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/assessment/my  – get authenticated user's assessments
const getMyAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(assessments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/assessment/:id  – get single assessment by id
const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('user', 'name email');
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    // Students can only view their own assessment
    if (
      req.user.role !== 'admin' &&
      assessment.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    return res.json(assessment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { submitAssessment, getMyAssessments, getAssessmentById };

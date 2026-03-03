const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Career = require('../models/Career');

// GET /api/admin/stats  – overview statistics
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalAssessments, totalCareers] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Assessment.countDocuments(),
      Career.countDocuments({ isActive: true }),
    ]);

    // Recent assessments (last 10)
    const recentAssessments = await Assessment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email');

    return res.json({ totalUsers, totalAssessments, totalCareers, recentAssessments });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/careers  – all careers (including inactive)
const getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    return res.json(careers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/careers  – add a new career
const addCareer = async (req, res) => {
  try {
    const { title, description, keywords, requiredSkills, futureScope, weight } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const career = await Career.create({
      title,
      description,
      keywords: keywords || [],
      requiredSkills: requiredSkills || [],
      futureScope,
      weight: weight || 5,
    });

    return res.status(201).json(career);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/careers/:id  – update a career
const updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!career) return res.status(404).json({ message: 'Career not found' });
    return res.json(career);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/careers/:id  – soft-delete (set isActive=false)
const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!career) return res.status(404).json({ message: 'Career not found' });
    return res.json({ message: 'Career deactivated', career });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/users  – list all students
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/assessments  – list all assessments
const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    return res.json(assessments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getStats,
  getAllCareers,
  addCareer,
  updateCareer,
  deleteCareer,
  getUsers,
  getAllAssessments,
};

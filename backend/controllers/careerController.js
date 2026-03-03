const Career = require('../models/Career');

// GET /api/careers  – public list of active careers
const getCareers = async (req, res) => {
  try {
    const careers = await Career.find({ isActive: true }).select('-__v');
    return res.json(careers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/careers/:id
const getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Career not found' });
    return res.json(career);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getCareers, getCareerById };

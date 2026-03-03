const express = require('express');
const {
  getStats,
  getAllCareers,
  addCareer,
  updateCareer,
  deleteCareer,
  getUsers,
  getAllAssessments,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly); // all admin routes require admin role

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/assessments', getAllAssessments);
router.get('/careers', getAllCareers);
router.post('/careers', addCareer);
router.put('/careers/:id', updateCareer);
router.delete('/careers/:id', deleteCareer);

module.exports = router;

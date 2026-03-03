const express = require('express');
const {
  submitAssessment,
  getMyAssessments,
  getAssessmentById,
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // all assessment routes require authentication

router.post('/', submitAssessment);
router.get('/my', getMyAssessments);
router.get('/:id', getAssessmentById);

module.exports = router;

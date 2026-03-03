const express = require('express');
const { getCareers, getCareerById } = require('../controllers/careerController');

const router = express.Router();

router.get('/', getCareers);
router.get('/:id', getCareerById);

module.exports = router;

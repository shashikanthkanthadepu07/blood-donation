const express = require('express');
const router = express.Router();
const { getDonors, getDonorById, toggleAvailability } = require('../controllers/donorController');
const { requireAuth } = require('../middleware/auth');

router.get('/', getDonors);
router.get('/:id', getDonorById);
router.patch('/:id/availability', requireAuth, toggleAvailability);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getCamps, createCamp, registerForCamp } = require('../controllers/campController');
const { optionalAuth, requireAuth } = require('../middleware/auth');

router.get('/', getCamps);
router.post('/', requireAuth, createCamp);
router.post('/:id/register', optionalAuth, registerForCamp);

module.exports = router;

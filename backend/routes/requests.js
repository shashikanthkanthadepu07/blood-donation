const express = require('express');
const router = express.Router();
const {
  getRequests,
  getRequestById,
  createRequest,
  pledgeDonation,
  updateRequestStatus
} = require('../controllers/requestController');
const { optionalAuth, requireAuth } = require('../middleware/auth');

router.get('/', getRequests);
router.get('/:id', getRequestById);
router.post('/', optionalAuth, createRequest);
router.post('/:id/pledge', optionalAuth, pledgeDonation);
router.patch('/:id/status', requireAuth, updateRequestStatus);

module.exports = router;

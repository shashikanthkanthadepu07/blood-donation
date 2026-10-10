const express = require('express');
const router = express.Router();
const { getInventory, updateInventory } = require('../controllers/inventoryController');
const { requireAuth } = require('../middleware/auth');

router.get('/', getInventory);
router.put('/:bloodGroup', requireAuth, updateInventory);

module.exports = router;

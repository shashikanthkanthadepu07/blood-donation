const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const BloodInventory = require('../models/BloodInventory');
const { mockUsers, mockRequests, mockInventory } = require('../data/mockData');
const { isDbConnected } = require('../config/db');

// @desc    Get dashboard metrics & statistical overview
// @route   GET /api/stats
const getStats = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const [totalDonors, activeRequests, fulfilledRequests, inventoryItems] = await Promise.all([
        User.countDocuments({ role: 'donor' }),
        BloodRequest.countDocuments({ status: { $in: ['Pending', 'In Progress'] } }),
        BloodRequest.countDocuments({ status: 'Fulfilled' }),
        BloodInventory.find()
      ]);

      const totalUnitsInBank = inventoryItems.reduce((acc, curr) => acc + (curr.unitsAvailable || 0), 0);
      const livesSaved = (fulfilledRequests * 3) + Math.floor(totalUnitsInBank * 1.5);

      return res.json({
        success: true,
        stats: {
          totalDonors,
          activeRequests,
          fulfilledRequests,
          totalUnitsInBank,
          livesSaved,
          isLiveMongo: true
        }
      });
    } else {
      const totalDonors = mockUsers.filter((u) => u.role === 'donor').length;
      const activeRequests = mockRequests.filter((r) => ['Pending', 'In Progress'].includes(r.status)).length;
      const fulfilledRequests = mockRequests.filter((r) => r.status === 'Fulfilled').length;
      const totalUnitsInBank = mockInventory.reduce((acc, curr) => acc + (curr.unitsAvailable || 0), 0);
      const livesSaved = (fulfilledRequests * 3) + Math.floor(totalUnitsInBank * 1.5);

      return res.json({
        success: true,
        stats: {
          totalDonors,
          activeRequests,
          fulfilledRequests,
          totalUnitsInBank,
          livesSaved,
          isLiveMongo: false
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats
};

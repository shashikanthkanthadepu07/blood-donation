const BloodInventory = require('../models/BloodInventory');
const { mockInventory } = require('../data/mockData');
const { isDbConnected } = require('../config/db');

const calculateStatus = (units) => {
  if (units <= 5) return 'Critical';
  if (units <= 15) return 'Low';
  return 'Adequate';
};

// @desc    Get blood bank inventory levels
// @route   GET /api/inventory
const getInventory = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      let inventory = await BloodInventory.find().sort({ bloodGroup: 1 });

      // If empty, initialize standard blood groups
      if (!inventory || inventory.length === 0) {
        const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const initial = groups.map((bg) => {
          const match = mockInventory.find((m) => m.bloodGroup === bg);
          return {
            bloodGroup: bg,
            unitsAvailable: match ? match.unitsAvailable : 20,
            status: match ? match.status : 'Adequate',
            lastUpdated: new Date()
          };
        });
        inventory = await BloodInventory.insertMany(initial);
      }

      const totalUnits = inventory.reduce((sum, item) => sum + item.unitsAvailable, 0);

      return res.json({
        success: true,
        totalUnits,
        inventory
      });
    } else {
      const totalUnits = mockInventory.reduce((sum, item) => sum + item.unitsAvailable, 0);
      return res.json({
        success: true,
        totalUnits,
        inventory: mockInventory
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update units for a blood group (Hospital / Admin)
// @route   PUT /api/inventory/:bloodGroup
const updateInventory = async (req, res, next) => {
  try {
    const { bloodGroup } = req.params;
    const { unitsAvailable } = req.body;

    if (unitsAvailable === undefined || unitsAvailable < 0) {
      return res.status(400).json({ success: false, message: 'Invalid unitsAvailable value.' });
    }

    const units = Number(unitsAvailable);
    const status = calculateStatus(units);

    if (isDbConnected()) {
      const updated = await BloodInventory.findOneAndUpdate(
        { bloodGroup: decodeURIComponent(bloodGroup) },
        { unitsAvailable: units, status, lastUpdated: new Date() },
        { new: true, upsert: true }
      );

      return res.json({
        success: true,
        message: `Inventory updated for ${bloodGroup}`,
        item: updated
      });
    } else {
      const item = mockInventory.find((i) => i.bloodGroup === decodeURIComponent(bloodGroup));
      if (item) {
        item.unitsAvailable = units;
        item.status = status;
        item.lastUpdated = new Date().toISOString();
        return res.json({
          success: true,
          message: `Inventory updated for ${bloodGroup}`,
          item
        });
      }
      return res.status(404).json({ success: false, message: 'Blood group item not found.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  updateInventory
};

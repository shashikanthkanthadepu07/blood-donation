const User = require('../models/User');
const { mockUsers } = require('../data/mockData');
const { isDbConnected } = require('../config/db');

// Blood Compatibility Map: Recipient Group -> Array of compatible Donor Groups
const COMPATIBILITY_MAP = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Universal Donor
};

// @desc    Get donors with filters (bloodGroup, city, availableOnly, compatibleWith)
// @route   GET /api/donors
const getDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city, availableOnly, compatibleWith, search } = req.query;

    if (isDbConnected()) {
      const query = { role: 'donor' };

      if (availableOnly === 'true') {
        query.isAvailable = true;
      }

      if (compatibleWith && COMPATIBILITY_MAP[compatibleWith]) {
        query.bloodGroup = { $in: COMPATIBILITY_MAP[compatibleWith] };
      } else if (bloodGroup) {
        query.bloodGroup = bloodGroup;
      }

      if (city) {
        query.city = { $regex: city, $options: 'i' };
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ];
      }

      const donors = await User.find(query).select('-password').sort({ isAvailable: -1, donationsCount: -1 });
      return res.json({
        success: true,
        count: donors.length,
        donors
      });
    } else {
      // In-Memory Fallback
      let donors = mockUsers.filter((u) => u.role === 'donor');

      if (availableOnly === 'true') {
        donors = donors.filter((u) => u.isAvailable === true);
      }

      if (compatibleWith && COMPATIBILITY_MAP[compatibleWith]) {
        const allowed = COMPATIBILITY_MAP[compatibleWith];
        donors = donors.filter((u) => allowed.includes(u.bloodGroup));
      } else if (bloodGroup) {
        donors = donors.filter((u) => u.bloodGroup.toLowerCase() === bloodGroup.toLowerCase());
      }

      if (city) {
        donors = donors.filter((u) => u.city.toLowerCase().includes(city.toLowerCase()));
      }

      if (search) {
        const s = search.toLowerCase();
        donors = donors.filter(
          (u) =>
            u.name.toLowerCase().includes(s) ||
            u.city.toLowerCase().includes(s) ||
            (u.address && u.address.toLowerCase().includes(s))
        );
      }

      const donorsSafe = donors.map(({ password, ...rest }) => rest);

      return res.json({
        success: true,
        count: donorsSafe.length,
        donors: donorsSafe
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donor details by ID
// @route   GET /api/donors/:id
const getDonorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const donor = await User.findById(id).select('-password');
      if (!donor || donor.role !== 'donor') {
        return res.status(404).json({ success: false, message: 'Donor not found.' });
      }
      return res.json({ success: true, donor });
    } else {
      const donor = mockUsers.find((u) => u._id === id);
      if (!donor) {
        return res.status(404).json({ success: false, message: 'Donor not found.' });
      }
      const { password, ...donorSafe } = donor;
      return res.json({ success: true, donor: donorSafe });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle donor availability status
// @route   PATCH /api/donors/:id/availability
const toggleAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (isDbConnected()) {
      const donor = await User.findByIdAndUpdate(
        id,
        { isAvailable },
        { new: true }
      ).select('-password');

      return res.json({ success: true, message: 'Availability status updated', donor });
    } else {
      const donor = mockUsers.find((u) => u._id === id);
      if (donor) {
        donor.isAvailable = typeof isAvailable === 'boolean' ? isAvailable : !donor.isAvailable;
        const { password, ...donorSafe } = donor;
        return res.json({ success: true, message: 'Availability status updated', donor: donorSafe });
      }
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDonors,
  getDonorById,
  toggleAvailability,
  COMPATIBILITY_MAP
};

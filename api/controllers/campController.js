const BloodCamp = require('../models/BloodCamp');
const { mockCamps } = require('../data/mockData');
const { isDbConnected } = require('../config/db');

// @desc    Get all donation camps
// @route   GET /api/camps
const getCamps = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (city) query.city = { $regex: city, $options: 'i' };

      let camps = await BloodCamp.find(query).sort({ date: 1 });

      if (camps.length === 0 && !city) {
        camps = await BloodCamp.insertMany(mockCamps);
      }

      return res.json({
        success: true,
        count: camps.length,
        camps
      });
    } else {
      let camps = [...mockCamps];
      if (city) {
        camps = camps.filter((c) => c.city.toLowerCase().includes(city.toLowerCase()));
      }
      return res.json({
        success: true,
        count: camps.length,
        camps
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new donation camp
// @route   POST /api/camps
const createCamp = async (req, res, next) => {
  try {
    const {
      title,
      organizedBy,
      location,
      city,
      date,
      startTime,
      endTime,
      contactPhone,
      description,
      bannerUrl
    } = req.body;

    if (!title || !organizedBy || !location || !city || !date || !startTime || !endTime || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required camp details.'
      });
    }

    if (isDbConnected()) {
      const camp = await BloodCamp.create({
        title,
        organizedBy,
        location,
        city,
        date,
        startTime,
        endTime,
        contactPhone,
        description: description || '',
        bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
        registeredAttendees: []
      });

      return res.status(201).json({
        success: true,
        message: 'Donation camp created successfully!',
        camp
      });
    } else {
      const camp = {
        _id: 'camp_' + Date.now(),
        title,
        organizedBy,
        location,
        city,
        date,
        startTime,
        endTime,
        contactPhone,
        description: description || '',
        bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
        registeredAttendees: [],
        createdAt: new Date().toISOString()
      };

      mockCamps.push(camp);

      return res.status(201).json({
        success: true,
        message: 'Donation camp created successfully! (Demo mode)',
        camp
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register to attend a donation camp
// @route   POST /api/camps/:id/register
const registerForCamp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const attendeeName = name || (req.user && req.user.name);
    const attendeeEmail = email || (req.user && req.user.email);
    const attendeePhone = phone || (req.user && req.user.phone);

    if (!attendeeName || !attendeeEmail || !attendeePhone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone number are required to register.'
      });
    }

    const attendeeRecord = {
      userId: req.user ? req.user.id || req.user._id : null,
      name: attendeeName,
      email: attendeeEmail,
      phone: attendeePhone,
      registeredAt: new Date()
    };

    if (isDbConnected()) {
      const camp = await BloodCamp.findById(id);
      if (!camp) {
        return res.status(404).json({ success: false, message: 'Camp not found' });
      }

      const already = camp.registeredAttendees.some((a) => a.email === attendeeEmail);
      if (already) {
        return res.status(400).json({ success: false, message: 'You have already registered for this camp!' });
      }

      camp.registeredAttendees.push(attendeeRecord);
      await camp.save();

      return res.json({
        success: true,
        message: 'Successfully registered for the blood donation camp!',
        camp
      });
    } else {
      const camp = mockCamps.find((c) => c._id === id);
      if (!camp) {
        return res.status(404).json({ success: false, message: 'Camp not found' });
      }

      if (!camp.registeredAttendees) camp.registeredAttendees = [];
      const already = camp.registeredAttendees.some((a) => a.email === attendeeEmail);
      if (already) {
        return res.status(400).json({ success: false, message: 'You have already registered for this camp!' });
      }

      camp.registeredAttendees.push(attendeeRecord);
      return res.json({
        success: true,
        message: 'Successfully registered for the blood donation camp!',
        camp
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCamps,
  createCamp,
  registerForCamp
};

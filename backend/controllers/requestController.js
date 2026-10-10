const BloodRequest = require('../models/BloodRequest');
const { mockRequests } = require('../data/mockData');
const { isDbConnected } = require('../config/db');

// @desc    Get all blood requests with filters
// @route   GET /api/requests
const getRequests = async (req, res, next) => {
  try {
    const { bloodGroup, urgency, status, city, search } = req.query;

    if (isDbConnected()) {
      const query = {};

      if (bloodGroup) query.bloodGroup = bloodGroup;
      if (urgency) query.urgency = urgency;
      if (status) query.status = status;
      if (city) query.city = { $regex: city, $options: 'i' };
      if (search) {
        query.$or = [
          { patientName: { $regex: search, $options: 'i' } },
          { hospitalName: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } }
        ];
      }

      const requests = await BloodRequest.find(query).sort({
        urgency: 1, // Emergency first
        createdAt: -1
      });

      return res.json({
        success: true,
        count: requests.length,
        requests
      });
    } else {
      let filtered = [...mockRequests];

      if (bloodGroup) {
        filtered = filtered.filter((r) => r.bloodGroup === bloodGroup);
      }
      if (urgency) {
        filtered = filtered.filter((r) => r.urgency === urgency);
      }
      if (status) {
        filtered = filtered.filter((r) => r.status === status);
      }
      if (city) {
        filtered = filtered.filter((r) => r.city.toLowerCase().includes(city.toLowerCase()));
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.patientName.toLowerCase().includes(s) ||
            r.hospitalName.toLowerCase().includes(s) ||
            r.city.toLowerCase().includes(s)
        );
      }

      return res.json({
        success: true,
        count: filtered.length,
        requests: filtered
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request by ID
// @route   GET /api/requests/:id
const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const request = await BloodRequest.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Blood request not found.' });
      }
      return res.json({ success: true, request });
    } else {
      const request = mockRequests.find((r) => r._id === id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Blood request not found.' });
      }
      return res.json({ success: true, request });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blood request
// @route   POST /api/requests
const createRequest = async (req, res, next) => {
  try {
    const {
      patientName,
      hospitalName,
      city,
      bloodGroup,
      unitsRequired,
      urgency = 'Urgent',
      contactPerson,
      contactPhone,
      notes = ''
    } = req.body;

    if (!patientName || !hospitalName || !city || !bloodGroup || !unitsRequired || !contactPerson || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patientName, hospitalName, city, bloodGroup, unitsRequired, contactPerson, and contactPhone.'
      });
    }

    const requestedBy = req.user ? req.user.name || req.user.email : 'Public User';

    if (isDbConnected()) {
      const newRequest = await BloodRequest.create({
        patientName,
        hospitalName,
        city,
        bloodGroup,
        unitsRequired: Number(unitsRequired),
        unitsFulfilled: 0,
        urgency,
        contactPerson,
        contactPhone,
        notes,
        status: 'Pending',
        requestedBy,
        pledges: []
      });

      return res.status(201).json({
        success: true,
        message: 'Blood request submitted successfully!',
        request: newRequest
      });
    } else {
      const newRequest = {
        _id: 'req_' + Date.now(),
        patientName,
        hospitalName,
        city,
        bloodGroup,
        unitsRequired: Number(unitsRequired),
        unitsFulfilled: 0,
        urgency,
        contactPerson,
        contactPhone,
        notes,
        status: 'Pending',
        requestedBy,
        pledges: [],
        createdAt: new Date().toISOString()
      };

      mockRequests.unshift(newRequest);

      return res.status(201).json({
        success: true,
        message: 'Blood request submitted successfully! (Demo mode)',
        request: newRequest
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Pledge to donate blood for a request
// @route   POST /api/requests/:id/pledge
const pledgeDonation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { donorName, donorPhone, unitsPledged = 1 } = req.body;

    const donorId = req.user ? req.user.id || req.user._id : 'guest_' + Date.now();
    const finalDonorName = donorName || (req.user && req.user.name) || 'Anonymous Donor';
    const finalDonorPhone = donorPhone || (req.user && req.user.phone) || 'Contact on file';

    if (isDbConnected()) {
      const request = await BloodRequest.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Blood request not found.' });
      }

      request.pledges.push({
        donorId,
        donorName: finalDonorName,
        donorPhone: finalDonorPhone,
        unitsPledged: Number(unitsPledged),
        pledgedAt: new Date()
      });

      request.unitsFulfilled = (request.unitsFulfilled || 0) + Number(unitsPledged);
      if (request.unitsFulfilled >= request.unitsRequired) {
        request.status = 'Fulfilled';
      } else {
        request.status = 'In Progress';
      }

      await request.save();

      return res.json({
        success: true,
        message: 'Thank you! Your pledge to donate has been recorded.',
        request
      });
    } else {
      const request = mockRequests.find((r) => r._id === id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Blood request not found.' });
      }

      if (!request.pledges) request.pledges = [];
      request.pledges.push({
        donorId,
        donorName: finalDonorName,
        donorPhone: finalDonorPhone,
        unitsPledged: Number(unitsPledged),
        pledgedAt: new Date().toISOString()
      });

      request.unitsFulfilled = (request.unitsFulfilled || 0) + Number(unitsPledged);
      if (request.unitsFulfilled >= request.unitsRequired) {
        request.status = 'Fulfilled';
      } else {
        request.status = 'In Progress';
      }

      return res.json({
        success: true,
        message: 'Thank you! Your pledge to donate has been recorded.',
        request
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update blood request status (Hospital/Admin)
// @route   PATCH /api/requests/:id/status
const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Fulfilled', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    if (isDbConnected()) {
      const request = await BloodRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!request) {
        return res.status(404).json({ success: false, message: 'Blood request not found.' });
      }
      return res.json({ success: true, message: `Status updated to ${status}`, request });
    } else {
      const request = mockRequests.find((r) => r._id === id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Blood request not found.' });
      }
      request.status = status;
      return res.json({ success: true, message: `Status updated to ${status}`, request });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  pledgeDonation,
  updateRequestStatus
};

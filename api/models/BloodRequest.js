const mongoose = require('mongoose');

const pledgeSchema = new mongoose.Schema({
  donorId: { type: String, required: true },
  donorName: { type: String, required: true },
  donorPhone: { type: String, required: true },
  unitsPledged: { type: Number, default: 1 },
  pledgedAt: { type: Date, default: Date.now }
});

const bloodRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'Blood group is required']
    },
    unitsRequired: {
      type: Number,
      required: [true, 'Number of units is required'],
      min: 1
    },
    unitsFulfilled: {
      type: Number,
      default: 0
    },
    urgency: {
      type: String,
      enum: ['Emergency', 'Urgent', 'Standard'],
      default: 'Urgent'
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required']
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone number is required']
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Fulfilled', 'Cancelled'],
      default: 'Pending'
    },
    requestedBy: {
      type: String,
      default: 'Anonymous'
    },
    pledges: [pledgeSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.BloodRequest || mongoose.model('BloodRequest', bloodRequestSchema);

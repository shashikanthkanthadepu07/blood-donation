const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  userId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
});

const bloodCampSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    organizedBy: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    contactPhone: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    bannerUrl: {
      type: String,
      default: ''
    },
    registeredAttendees: [attendeeSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.BloodCamp || mongoose.model('BloodCamp', bloodCampSchema);

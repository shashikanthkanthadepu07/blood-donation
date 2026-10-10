const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema(
  {
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
      unique: true
    },
    unitsAvailable: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['Adequate', 'Low', 'Critical'],
      default: 'Adequate'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.BloodInventory || mongoose.model('BloodInventory', bloodInventorySchema);

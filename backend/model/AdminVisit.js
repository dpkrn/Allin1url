const mongoose = require('mongoose');

const adminVisitSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },
    ip: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    device: {
      type: {
        type: String,
        enum: ['mobile', 'desktop', 'tablet', 'unknown'],
        default: 'unknown',
      },
      brand: { type: String, default: null },
      model: { type: String, default: null },
    },
    os: {
      name:    { type: String, default: null },
      version: { type: String, default: null },
    },
    browser: {
      name:    { type: String, default: null },
      version: { type: String, default: null },
    },
    referrer:  { type: String, default: 'direct' },
    userAgent: { type: String, default: null },
  },
  { timestamps: true }
);

adminVisitSchema.index({ createdAt: -1 });
adminVisitSchema.index({ username: 1, createdAt: -1 });
adminVisitSchema.index({ country: 1 });

const AdminVisit = mongoose.model('adminVisit', adminVisitSchema);
module.exports = AdminVisit;

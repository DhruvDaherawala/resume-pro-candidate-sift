
const mongoose = require('mongoose');

const JobOpeningSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'remote'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  candidateCount: {
    type: Number,
    default: 0
  },
  shortlistedCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('JobOpening', JobOpeningSchema);

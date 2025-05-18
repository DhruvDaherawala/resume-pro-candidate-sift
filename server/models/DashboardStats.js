
const mongoose = require('mongoose');

const DashboardStatsSchema = new mongoose.Schema({
  openPositions: {
    type: Number,
    default: 0
  },
  totalCandidates: {
    type: Number,
    default: 0
  },
  shortlistedCandidates: {
    type: Number,
    default: 0
  },
  newCandidates: {
    type: Number,
    default: 0
  },
  hiringRate: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DashboardStats', DashboardStatsSchema);


const express = require('express');
const router = express.Router();
const DashboardStats = require('../models/DashboardStats');
const JobOpening = require('../models/JobOpening');
const Candidate = require('../models/Candidate');

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get the most recent stats document or create default stats if none exists
    let stats = await DashboardStats.findOne().sort({ lastUpdated: -1 });
    
    if (!stats) {
      // If no stats exist, calculate them from the current data
      const openPositions = await JobOpening.countDocuments({ status: 'active' });
      const totalCandidates = await Candidate.countDocuments();
      const shortlistedCandidates = await Candidate.countDocuments({ status: 'shortlisted' });
      const newCandidates = await Candidate.countDocuments({ status: 'new' });
      
      // Calculate hiring rate (example: shortlisted candidates / total candidates)
      const hiringRate = totalCandidates > 0 
        ? ((shortlistedCandidates / totalCandidates) * 100).toFixed(1) 
        : 0;
      
      stats = {
        openPositions,
        totalCandidates,
        shortlistedCandidates,
        newCandidates,
        hiringRate: parseFloat(hiringRate),
      };
      
      // Save the calculated stats
      await DashboardStats.create(stats);
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
  }
});

// Update dashboard stats (this would typically be triggered by a cron job)
router.post('/stats/update', async (req, res) => {
  try {
    const openPositions = await JobOpening.countDocuments({ status: 'active' });
    const totalCandidates = await Candidate.countDocuments();
    const shortlistedCandidates = await Candidate.countDocuments({ status: 'shortlisted' });
    const newCandidates = await Candidate.countDocuments({ status: 'new' });
    
    // Calculate hiring rate
    const hiringRate = totalCandidates > 0 
      ? ((shortlistedCandidates / totalCandidates) * 100).toFixed(1) 
      : 0;
    
    const updatedStats = await DashboardStats.create({
      openPositions,
      totalCandidates,
      shortlistedCandidates,
      newCandidates,
      hiringRate: parseFloat(hiringRate),
      lastUpdated: new Date()
    });
    
    res.json(updatedStats);
  } catch (error) {
    res.status(500).json({ message: "Error updating dashboard stats", error: error.message });
  }
});

module.exports = { dashboardRoutes: router };

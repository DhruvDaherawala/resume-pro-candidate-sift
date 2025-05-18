
const express = require('express');
const router = express.Router();
const JobOpening = require('../models/JobOpening');
const Candidate = require('../models/Candidate');

// Get all job openings
router.get('/', async (req, res) => {
  try {
    const jobOpenings = await JobOpening.find().sort({ createdAt: -1 });
    
    // Format the createdAt date to match our frontend expectations
    const formattedJobs = jobOpenings.map(job => ({
      id: job._id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      description: job.description,
      requirements: job.requirements,
      createdAt: job.createdAt.toISOString().split('T')[0],
      candidateCount: job.candidateCount,
      shortlistedCount: job.shortlistedCount
    }));
    
    res.json(formattedJobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job openings", error: error.message });
  }
});

// Get job opening by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await JobOpening.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job opening not found" });
    }
    
    res.json({
      id: job._id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      description: job.description,
      requirements: job.requirements,
      createdAt: job.createdAt.toISOString().split('T')[0],
      candidateCount: job.candidateCount,
      shortlistedCount: job.shortlistedCount
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching job opening", error: error.message });
  }
});

// Create a new job opening
router.post('/', async (req, res) => {
  try {
    const newJob = new JobOpening(req.body);
    const savedJob = await newJob.save();
    
    res.status(201).json({
      id: savedJob._id,
      title: savedJob.title,
      department: savedJob.department,
      location: savedJob.location,
      type: savedJob.type,
      status: savedJob.status,
      description: savedJob.description,
      requirements: savedJob.requirements,
      createdAt: savedJob.createdAt.toISOString().split('T')[0],
      candidateCount: 0,
      shortlistedCount: 0
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating job opening", error: error.message });
  }
});

// Update job opening status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedJob = await JobOpening.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedJob) {
      return res.status(404).json({ message: "Job opening not found" });
    }
    
    res.json({
      id: updatedJob._id,
      status: updatedJob.status
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating job status", error: error.message });
  }
});

module.exports = { jobOpeningRoutes: router };

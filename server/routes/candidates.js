
const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const JobOpening = require('../models/JobOpening');
const mongoose = require('mongoose');

// Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    
    const formattedCandidates = candidates.map(candidate => ({
      id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      skills: candidate.skills,
      experience: candidate.experience,
      education: candidate.education,
      resumeUrl: candidate.resumeUrl,
      matchScore: candidate.matchScore,
      status: candidate.status,
      jobId: candidate.jobId
    }));
    
    res.json(formattedCandidates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates", error: error.message });
  }
});

// Get candidates for a specific job
router.get('/job/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }
    
    const candidates = await Candidate.find({ jobId });
    
    const formattedCandidates = candidates.map(candidate => ({
      id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      skills: candidate.skills,
      experience: candidate.experience,
      education: candidate.education,
      resumeUrl: candidate.resumeUrl,
      matchScore: candidate.matchScore,
      status: candidate.status
    }));
    
    res.json(formattedCandidates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates for job", error: error.message });
  }
});

// Shortlist a candidate
router.patch('/:id/shortlist', async (req, res) => {
  try {
    const { jobId } = req.body;
    
    // Update candidate status to shortlisted
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status: 'shortlisted' },
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    
    // Update shortlisted count for the job
    if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
      await JobOpening.findByIdAndUpdate(
        jobId,
        { $inc: { shortlistedCount: 1 } }
      );
    }
    
    res.json({ success: true, candidate });
  } catch (error) {
    res.status(400).json({ message: "Error shortlisting candidate", error: error.message });
  }
});

// Upload resumes and process them
router.post('/upload-resumes', async (req, res) => {
  try {
    const { jobId, count } = req.body;
    
    // In a real implementation, this would process file uploads
    // For this example, we'll just update the job's candidate count
    
    if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
      await JobOpening.findByIdAndUpdate(
        jobId,
        { $inc: { candidateCount: count || 1 } }
      );
    }
    
    res.json({ 
      uploaded: count || 1, 
      processed: count || 1 
    });
  } catch (error) {
    res.status(400).json({ message: "Error uploading resumes", error: error.message });
  }
});

module.exports = { candidateRoutes: router };

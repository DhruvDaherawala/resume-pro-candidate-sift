
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
    const { jobId, count, resumeData } = req.body;
    
    // In a real implementation, this would process file uploads and extract data
    // For this example, we'll simulate the process with sample data
    
    let createdCandidates = [];
    let candidateCount = 0;
    
    // If we have actual resume data (which would come from file processing)
    if (resumeData && Array.isArray(resumeData)) {
      const candidatesToCreate = resumeData.map(data => ({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        skills: data.skills || [],
        experience: data.experience || [],
        education: data.education || [],
        resumeUrl: data.resumeUrl || "",
        matchScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
        status: 'new',
        jobId: jobId || null
      }));
      
      createdCandidates = await Candidate.create(candidatesToCreate);
      candidateCount = createdCandidates.length;
    } else {
      // Simulate processing by creating mock candidates
      const mockCandidateCount = count || 1;
      const mockCandidates = [];
      
      for (let i = 0; i < mockCandidateCount; i++) {
        const mockCandidate = {
          name: `Candidate ${Date.now()}-${i}`,
          email: `candidate${Date.now()}-${i}@example.com`,
          phone: `+1-555-${Math.floor(1000 + Math.random() * 9000)}`,
          skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"].sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 2)),
          experience: [
            {
              role: "Software Developer",
              company: "Tech Company",
              duration: "2020-2023",
              description: "Developed web applications using modern technologies"
            }
          ],
          education: [
            {
              degree: "Bachelor of Science in Computer Science",
              institution: "University of Technology",
              year: "2019"
            }
          ],
          resumeUrl: "",
          matchScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
          status: 'new',
          jobId: jobId || null
        };
        
        mockCandidates.push(mockCandidate);
      }
      
      createdCandidates = await Candidate.create(mockCandidates);
      candidateCount = createdCandidates.length;
    }
    
    // Update job candidate count
    if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
      await JobOpening.findByIdAndUpdate(
        jobId,
        { $inc: { candidateCount: candidateCount } }
      );
    }
    
    res.json({ 
      uploaded: candidateCount, 
      processed: candidateCount,
      candidates: createdCandidates.map(c => c._id)
    });
  } catch (error) {
    res.status(400).json({ message: "Error uploading and processing resumes", error: error.message });
  }
});

// Add a new endpoint to extract information from a resume
// This is a mock implementation that would be replaced with ML processing
router.post('/extract-resume-info', async (req, res) => {
  try {
    // In a real implementation, this would use ML to extract data from the resume
    // For this example, we'll just return mock data
    
    setTimeout(() => {
      res.json({
        name: `John Smith`,
        email: `john.smith${Date.now()}@example.com`,
        phone: `+1-555-${Math.floor(1000 + Math.random() * 9000)}`,
        skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"].sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 2)),
        experience: [
          {
            role: "Full Stack Developer",
            company: "Tech Solutions Inc.",
            duration: "2020-2023",
            description: "Led development of web applications using MERN stack"
          },
          {
            role: "Junior Developer",
            company: "StartUp Co.",
            duration: "2018-2020",
            description: "Assisted in frontend development using React"
          }
        ],
        education: [
          {
            degree: "Master of Science in Computer Science",
            institution: "Tech University",
            year: "2018"
          },
          {
            degree: "Bachelor of Science in Computer Engineering",
            institution: "State University",
            year: "2016"
          }
        ]
      });
    }, 1500); // Simulate processing delay
  } catch (error) {
    res.status(400).json({ message: "Error extracting resume information", error: error.message });
  }
});

module.exports = { candidateRoutes: router };


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

// Upload resumes and process them - enhanced to handle file metadata
router.post('/upload-resumes', async (req, res) => {
  try {
    const { jobId, files, count } = req.body;
    
    console.log(`Received request to process ${count} resumes for job ${jobId || 'general pool'}`);
    
    // In a real implementation, file uploads would be processed here
    // For this demo, we'll create mock candidates based on the file metadata
    
    let createdCandidates = [];
    let candidateCount = 0;
    
    // If we have file metadata (which would come from frontend)
    if (files && Array.isArray(files)) {
      // Create candidates from the "processed" resumes
      const mockCandidates = files.map(file => {
        // Simulate extracting information from the resume
        const nameParts = file.name.split('.')[0].split('_');
        const mockName = nameParts.map(part => 
          part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        ).join(' ');
        
        // Generate randomized skills based on common tech stacks
        const allSkills = [
          "JavaScript", "TypeScript", "React", "Angular", "Vue.js", 
          "Node.js", "Express", "MongoDB", "SQL", "Python", "Django",
          "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD",
          "Git", "GraphQL", "REST API", "Java", "Spring Boot", "C#",
          "ASP.NET", "PHP", "Laravel", "Ruby", "Rails", "Swift", "Kotlin"
        ];
        
        // Select 3-6 random skills
        const skillCount = 3 + Math.floor(Math.random() * 4);
        const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
        const selectedSkills = shuffled.slice(0, skillCount);
        
        // Generate random experience (1-10 years)
        const yearsExp = 1 + Math.floor(Math.random() * 10);
        const endYear = new Date().getFullYear();
        const startYear = endYear - yearsExp;
        
        return {
          name: mockName || `Candidate ${Date.now()}`,
          email: `${mockName.toLowerCase().replace(/\s/g, '.')}@example.com` || `candidate${Date.now()}@example.com`,
          phone: `+1-555-${Math.floor(1000 + Math.random() * 9000)}`,
          skills: selectedSkills,
          experience: [
            {
              role: selectedSkills.includes("React") ? "Frontend Developer" : 
                    selectedSkills.includes("Node.js") ? "Backend Developer" : "Software Engineer",
              company: ["TechCorp", "InnovateX", "CodeWorks", "DevSolutions", "ByteLogic"][Math.floor(Math.random() * 5)],
              duration: `${startYear}-${endYear}`,
              description: "Developed and maintained applications using modern technologies"
            }
          ],
          education: [
            {
              degree: "Bachelor of Science in Computer Science",
              institution: ["MIT", "Stanford University", "University of California", "Georgia Tech", "Purdue University"][Math.floor(Math.random() * 5)],
              year: `${startYear - 4}`
            }
          ],
          resumeUrl: "",
          matchScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
          status: 'new',
          jobId: jobId || null
        };
      });
      
      createdCandidates = await Candidate.create(mockCandidates);
      candidateCount = createdCandidates.length;
      
      console.log(`Created ${candidateCount} candidate records from uploaded resumes`);
    } else {
      // Fallback to create a single mock candidate
      const mockCandidate = {
        name: `Candidate ${Date.now()}`,
        email: `candidate${Date.now()}@example.com`,
        phone: `+1-555-${Math.floor(1000 + Math.random() * 9000)}`,
        skills: ["JavaScript", "React", "Node.js"].sort(() => 0.5 - Math.random()),
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
        matchScore: Math.floor(Math.random() * 40) + 60,
        status: 'new',
        jobId: jobId || null
      };
      
      const createdCandidate = await Candidate.create(mockCandidate);
      createdCandidates = [createdCandidate];
      candidateCount = 1;
      
      console.log(`Created 1 fallback candidate record`);
    }
    
    // Update job candidate count if jobId is provided
    if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
      await JobOpening.findByIdAndUpdate(
        jobId,
        { $inc: { candidateCount: candidateCount } }
      );
      
      console.log(`Updated job ${jobId} with ${candidateCount} new candidates`);
    }
    
    res.json({ 
      uploaded: candidateCount, 
      processed: candidateCount,
      candidates: createdCandidates.map(c => c._id)
    });
  } catch (error) {
    console.error("Error processing resumes:", error);
    res.status(400).json({ message: "Error uploading and processing resumes", error: error.message });
  }
});

module.exports = { candidateRoutes: router };

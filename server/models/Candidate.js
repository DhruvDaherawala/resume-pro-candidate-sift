
const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

const EducationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  }
});

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  skills: {
    type: [String],
    required: true
  },
  experience: {
    type: [ExperienceSchema],
    default: []
  },
  education: {
    type: [EducationSchema],
    default: []
  },
  resumeUrl: {
    type: String
  },
  matchScore: {
    type: Number
  },
  status: {
    type: String,
    enum: ['new', 'shortlisted', 'interviewing', 'rejected', 'hired'],
    default: 'new'
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobOpening'
  }
});

module.exports = mongoose.model('Candidate', CandidateSchema);

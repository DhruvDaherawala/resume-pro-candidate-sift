
const mongoose = require('mongoose');
const JobOpening = require('./models/JobOpening');
const Candidate = require('./models/Candidate');
const DashboardStats = require('./models/DashboardStats');

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://dhruvkhatri460:D88v0s6TUy1uKXoL@ai-hr-cluster.huc2t6h.mongodb.net/hr_management";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample data
const jobOpenings = [
  {
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "full-time",
    status: "active",
    description: "We are looking for a skilled frontend developer...",
    requirements: ["React", "TypeScript", "CSS/Tailwind", "3+ years experience"],
    candidateCount: 45,
    shortlistedCount: 8,
  },
  {
    title: "UX Designer",
    department: "Design",
    location: "New York, NY",
    type: "full-time",
    status: "active",
    description: "We need a talented UX designer to join our team...",
    requirements: ["Figma", "User Research", "Prototyping", "2+ years experience"],
    candidateCount: 32,
    shortlistedCount: 6,
  },
  {
    title: "Data Scientist",
    department: "Data",
    location: "Remote",
    type: "contract",
    status: "active",
    description: "Looking for a data scientist with ML experience...",
    requirements: ["Python", "Machine Learning", "Data Analysis", "5+ years experience"],
    candidateCount: 28,
    shortlistedCount: 4,
  },
];

const candidates = [
  {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "555-123-4567",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    experience: [
      {
        role: "Senior Frontend Developer",
        company: "Tech Co",
        duration: "2020-2023",
        description: "Led frontend development for multiple products",
      },
      {
        role: "Frontend Developer",
        company: "StartUp Inc",
        duration: "2018-2020",
        description: "Built responsive web applications",
      },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "University of Technology",
        year: "2018",
      },
    ],
    matchScore: 92,
    status: "shortlisted",
  },
  {
    name: "Sam Wilson",
    email: "sam.w@example.com",
    skills: ["JavaScript", "React", "CSS", "HTML"],
    experience: [
      {
        role: "Frontend Developer",
        company: "Web Solutions",
        duration: "2019-2023",
      },
    ],
    education: [
      {
        degree: "B.A. Design",
        institution: "Creative Arts University",
        year: "2019",
      },
    ],
    matchScore: 78,
    status: "new",
  },
  {
    name: "Jamie Lee",
    email: "jamie.l@example.com",
    phone: "555-987-6543",
    skills: ["React", "Redux", "TypeScript", "Node.js", "MongoDB"],
    experience: [
      {
        role: "Full Stack Developer",
        company: "Global Tech",
        duration: "2017-2023",
        description: "Developed full stack applications with React and Node.js",
      },
    ],
    education: [
      {
        degree: "M.S. Computer Engineering",
        institution: "Tech Institute",
        year: "2017",
      },
    ],
    matchScore: 95,
    status: "shortlisted",
  },
];

const dashboardStats = {
  openPositions: 12,
  totalCandidates: 256,
  shortlistedCandidates: 42,
  newCandidates: 28,
  hiringRate: 15.4,
  lastUpdated: new Date(),
};

// Seed the database
async function seedDatabase() {
  try {
    // Clear existing data
    await JobOpening.deleteMany({});
    await Candidate.deleteMany({});
    await DashboardStats.deleteMany({});

    console.log('Previous data cleared');

    // Insert job openings
    const insertedJobs = await JobOpening.insertMany(jobOpenings);
    console.log('Job openings seeded');

    // Assign job IDs to candidates
    const jobIds = insertedJobs.map(job => job._id);
    const candidatesWithJobIds = candidates.map((candidate, index) => ({
      ...candidate,
      jobId: jobIds[index % jobIds.length] // Distribute candidates among jobs
    }));

    // Insert candidates
    await Candidate.insertMany(candidatesWithJobIds);
    console.log('Candidates seeded');

    // Insert dashboard stats
    await DashboardStats.create(dashboardStats);
    console.log('Dashboard stats seeded');

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected after seeding');
  }
}

seedDatabase();

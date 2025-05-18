
import { Candidate, JobOpening, DashboardStats } from "../types";

// Mock API service (to be replaced with actual API calls)
class ApiService {
  // Dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    // In a real app, this would fetch from your backend
    return {
      openPositions: 12,
      totalCandidates: 256,
      shortlistedCandidates: 42,
      newCandidates: 28,
      hiringRate: 15.4,
    };
  }

  // Job openings
  async getJobOpenings(): Promise<JobOpening[]> {
    // In a real app, this would fetch from your backend
    return [
      {
        id: "1",
        title: "Frontend Developer",
        department: "Engineering",
        location: "Remote",
        type: "full-time",
        status: "active",
        description: "We are looking for a skilled frontend developer...",
        requirements: ["React", "TypeScript", "CSS/Tailwind", "3+ years experience"],
        createdAt: "2025-04-01",
        candidateCount: 45,
        shortlistedCount: 8,
      },
      {
        id: "2",
        title: "UX Designer",
        department: "Design",
        location: "New York, NY",
        type: "full-time",
        status: "active",
        description: "We need a talented UX designer to join our team...",
        requirements: ["Figma", "User Research", "Prototyping", "2+ years experience"],
        createdAt: "2025-04-10",
        candidateCount: 32,
        shortlistedCount: 6,
      },
      {
        id: "3",
        title: "Data Scientist",
        department: "Data",
        location: "Remote",
        type: "contract",
        status: "active",
        description: "Looking for a data scientist with ML experience...",
        requirements: ["Python", "Machine Learning", "Data Analysis", "5+ years experience"],
        createdAt: "2025-04-15",
        candidateCount: 28,
        shortlistedCount: 4,
      },
    ];
  }

  async createJobOpening(jobOpening: Omit<JobOpening, "id" | "createdAt" | "candidateCount" | "shortlistedCount">): Promise<JobOpening> {
    // In a real app, this would post to your backend
    const newJob: JobOpening = {
      ...jobOpening,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split("T")[0],
      candidateCount: 0,
      shortlistedCount: 0,
    };
    console.log("Created new job opening:", newJob);
    return newJob;
  }

  // Candidates
  async getCandidates(jobId?: string): Promise<Candidate[]> {
    // In a real app, this would fetch filtered candidates from your backend
    const candidates: Candidate[] = [
      {
        id: "1",
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
        id: "2",
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
        id: "3",
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
    
    return jobId ? candidates.filter(c => Math.random() > 0.3) : candidates;
  }

  // File upload with resume processing
  async uploadResumes(files: File[], jobId: string): Promise<{ uploaded: number; processed: number }> {
    // In a real app, this would upload files to your backend
    console.log(`Uploading ${files.length} resumes for job ${jobId}`);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          uploaded: files.length,
          processed: files.length,
        });
      }, 2000);
    });
  }

  // Shortlist candidates
  async shortlistCandidate(candidateId: string, jobId: string): Promise<boolean> {
    // In a real app, this would update the candidate status in your backend
    console.log(`Shortlisting candidate ${candidateId} for job ${jobId}`);
    return true;
  }
}

export const apiService = new ApiService();

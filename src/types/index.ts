
// Type definitions for the HR Management System

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  resumeUrl?: string;
  matchScore?: number;
  status: 'new' | 'shortlisted' | 'interviewing' | 'rejected' | 'hired';
}

export interface Experience {
  role: string;
  company: string;
  duration: string; // e.g., "2019-2022"
  description?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  status: 'active' | 'closed';
  description: string;
  requirements: string[];
  createdAt: string;
  candidateCount?: number;
  shortlistedCount?: number;
}

export interface DashboardStats {
  openPositions: number;
  totalCandidates: number;
  shortlistedCandidates: number;
  newCandidates: number;
  hiringRate: number;
}

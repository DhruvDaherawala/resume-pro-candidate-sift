
import { Candidate, JobOpening, DashboardStats } from "../types";

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Real API service connecting to MongoDB backend
class ApiService {
  // Dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to mock data if the API request fails
      return {
        openPositions: 0,
        totalCandidates: 0,
        shortlistedCandidates: 0,
        newCandidates: 0,
        hiringRate: 0,
      };
    }
  }

  // Job openings
  async getJobOpenings(): Promise<JobOpening[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`);
      if (!response.ok) {
        throw new Error('Failed to fetch job openings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching job openings:', error);
      return [];
    }
  }

  async createJobOpening(jobOpening: Omit<JobOpening, "id" | "createdAt" | "candidateCount" | "shortlistedCount">): Promise<JobOpening> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobOpening),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create job opening');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating job opening:', error);
      throw error;
    }
  }

  // Candidates
  async getCandidates(jobId?: string): Promise<Candidate[]> {
    try {
      const url = jobId 
        ? `${API_BASE_URL}/candidates/job/${jobId}`
        : `${API_BASE_URL}/candidates`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return [];
    }
  }

  // File upload with resume processing
  async uploadResumes(files: File[], jobId: string): Promise<{ uploaded: number; processed: number }> {
    try {
      // In a real implementation, this would use FormData to upload actual files
      // For this example, we'll just send the count of files
      const response = await fetch(`${API_BASE_URL}/candidates/upload-resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          count: files.length,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload resumes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading resumes:', error);
      throw error;
    }
  }

  // Shortlist candidates
  async shortlistCandidate(candidateId: string, jobId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/shortlist`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to shortlist candidate');
      }
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error shortlisting candidate:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();

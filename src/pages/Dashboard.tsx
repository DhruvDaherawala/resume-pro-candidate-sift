
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '@/components/dashboard/StatCard';
import JobOpeningCard from '@/components/dashboard/JobOpeningCard';
import { apiService } from '@/services/api';
import { DashboardStats, JobOpening } from '@/types';
import { FileUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats
        const dashboardStats = await apiService.getDashboardStats();
        setStats(dashboardStats);
        
        // Fetch jobs
        const jobs = await apiService.getJobOpenings();
        setRecentJobs(jobs.slice(0, 3)); // Only show the 3 most recent jobs
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome to your HR management dashboard</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="h-24 bg-white rounded-lg p-6 animate-pulse-light"
            />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Open Positions"
            value={stats.openPositions}
            trend={{ value: 5.2, positive: true }}
          />
          <StatCard
            title="Total Candidates"
            value={stats.totalCandidates}
            trend={{ value: 12.3, positive: true }}
          />
          <StatCard
            title="Shortlisted"
            value={stats.shortlistedCandidates}
            description={`${Math.round((stats.shortlistedCandidates / stats.totalCandidates) * 100)}% of total candidates`}
          />
          <StatCard
            title="Hiring Rate"
            value={`${stats.hiringRate}%`}
            trend={{ value: 2.1, positive: false }}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Job Openings</h2>
            <Link to="/jobs" className="text-sm font-medium text-hr-blue hover:text-hr-darkBlue">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-40 bg-white rounded-lg p-6 animate-pulse-light"
                />
              ))}
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <JobOpeningCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100">
              <p className="text-gray-600">No active job openings</p>
              <Link 
                to="/jobs/new" 
                className="mt-2 inline-block text-sm font-medium text-hr-blue hover:text-hr-darkBlue"
              >
                Create your first job opening
              </Link>
            </div>
          )}
        </div>
        
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              <Link
                to="/jobs/new"
                className="block w-full text-center px-4 py-3 border border-hr-blue rounded-md text-hr-blue hover:bg-hr-lightBlue transition-colors"
              >
                Create New Job Opening
              </Link>
              
              <Link
                to="/upload-resumes"
                className="flex items-center justify-center w-full px-4 py-3 bg-hr-blue rounded-md text-white hover:bg-hr-darkBlue transition-colors"
              >
                <FileUp className="mr-2" size={18} />
                Upload New Resumes
              </Link>
              
              <Link
                to="/candidates"
                className="block w-full text-center px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View All Candidates
              </Link>
              
              <Link
                to="/jobs"
                className="block w-full text-center px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Manage Job Openings
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-medium text-gray-900 mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ML Model Status:</span>
                  <span className="font-medium text-green-600">Operational</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Resume Processing:</span>
                  <span className="font-medium text-green-600">Ready</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

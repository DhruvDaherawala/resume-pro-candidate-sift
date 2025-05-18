
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { JobOpening } from '@/types';
import { apiService } from '@/services/api';
import JobOpeningCard from '@/components/dashboard/JobOpeningCard';

const JobOpenings = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const fetchedJobs = await apiService.getJobOpenings();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching job openings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  // Filter jobs based on selected filter
  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Openings</h1>
          <p className="mt-1 text-gray-600">Manage your company's open positions</p>
        </div>
        <Link 
          to="/jobs/new" 
          className="px-4 py-2 bg-hr-blue text-white rounded-md hover:bg-hr-darkBlue transition-colors"
        >
          Create New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium ${
            filter === 'all' 
              ? 'text-hr-blue border-b-2 border-hr-blue' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Jobs
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 text-sm font-medium ${
            filter === 'active' 
              ? 'text-hr-blue border-b-2 border-hr-blue' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-4 py-2 text-sm font-medium ${
            filter === 'closed' 
              ? 'text-hr-blue border-b-2 border-hr-blue' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Closed
        </button>
      </div>

      {/* Job listings */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="h-64 bg-white rounded-lg p-6 animate-pulse-light"
            />
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobOpeningCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900">No job openings found</h2>
          <p className="text-gray-600 mt-1">
            {filter !== 'all' 
              ? `There are no ${filter} job openings.` 
              : "You haven't created any job openings yet."}
          </p>
          {filter !== 'all' && (
            <button 
              onClick={() => setFilter('all')} 
              className="mt-3 text-hr-blue hover:text-hr-darkBlue font-medium"
            >
              View all jobs
            </button>
          )}
          <div className="mt-4">
            <Link 
              to="/jobs/new" 
              className="px-4 py-2 bg-hr-blue text-white rounded-md hover:bg-hr-darkBlue transition-colors"
            >
              Create New Job
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOpenings;

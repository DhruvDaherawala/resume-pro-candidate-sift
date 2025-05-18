
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { JobOpening, Candidate } from '@/types';
import { apiService } from '@/services/api';
import ResumeUploader from '@/components/resumes/ResumeUploader';
import CandidateCard from '@/components/candidates/CandidateCard';
import CandidateDetail from '@/components/candidates/CandidateDetail';
import { useToast } from '@/hooks/use-toast';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [job, setJob] = useState<JobOpening | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'candidates' | 'upload'>('details');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Fetch job details
        const jobs = await apiService.getJobOpenings();
        const jobData = jobs.find(j => j.id === id) || null;
        setJob(jobData);
        
        // Fetch candidates for this job
        const jobCandidates = await apiService.getCandidates(id);
        setCandidates(jobCandidates);
      } catch (error) {
        console.error('Error fetching job data:', error);
        toast({
          title: "Error loading job data",
          description: "Failed to load job details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobData();
  }, [id, toast]);

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleShortlistCandidate = async (candidate: Candidate) => {
    if (!id) return;
    
    try {
      await apiService.shortlistCandidate(candidate.id, id);
      
      // Update local state
      setCandidates(candidates.map(c => 
        c.id === candidate.id ? { ...c, status: 'shortlisted' } : c
      ));
      
      // Update selected candidate if it's the one being shortlisted
      if (selectedCandidate && selectedCandidate.id === candidate.id) {
        setSelectedCandidate({ ...selectedCandidate, status: 'shortlisted' });
      }
      
      toast({
        title: "Candidate shortlisted",
        description: `${candidate.name} has been shortlisted for this position.`,
      });
    } catch (error) {
      console.error('Error shortlisting candidate:', error);
      toast({
        title: "Failed to shortlist candidate",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleRejectCandidate = async (candidate: Candidate) => {
    // In a real app, this would call an API to update the candidate status
    setCandidates(candidates.map(c => 
      c.id === candidate.id ? { ...c, status: 'rejected' } : c
    ));
    
    // Update selected candidate if it's the one being rejected
    if (selectedCandidate && selectedCandidate.id === candidate.id) {
      setSelectedCandidate({ ...selectedCandidate, status: 'rejected' });
    }
    
    toast({
      title: "Candidate rejected",
      description: `${candidate.name} has been rejected for this position.`,
    });
  };

  const handleUploadComplete = (result: { uploaded: number; processed: number }) => {
    // Refresh candidates after upload
    if (id) {
      apiService.getCandidates(id).then(setCandidates);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-white rounded-lg animate-pulse-light" />
        <div className="h-64 bg-white rounded-lg animate-pulse-light" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
        <p className="mt-2 text-gray-600">The job opening you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/jobs" 
          className="mt-6 inline-block px-4 py-2 bg-hr-blue text-white rounded-md hover:bg-hr-darkBlue"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Link 
            to="/jobs"
            className="text-sm font-medium text-hr-blue hover:text-hr-darkBlue mb-2 inline-block"
          >
            ← Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <p className="mt-1 text-gray-600">
            {job.department} • {job.location} • 
            <span className="ml-1 capitalize">{job.type.replace('-', ' ')}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {job.status === 'active' ? 'Active' : 'Closed'}
          </span>
          <span className="text-sm text-gray-500">
            Posted on {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'details'
                  ? 'border-b-2 border-hr-blue text-hr-blue'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Job Details
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'candidates'
                  ? 'border-b-2 border-hr-blue text-hr-blue'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Candidates ({candidates.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'upload'
                  ? 'border-b-2 border-hr-blue text-hr-blue'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload Resumes
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-4">
                  <div className="min-w-[150px]">
                    <h3 className="text-sm font-medium text-gray-500">Total Candidates</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{job.candidateCount || 0}</p>
                  </div>
                  <div className="min-w-[150px]">
                    <h3 className="text-sm font-medium text-gray-500">Shortlisted</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{job.shortlistedCount || 0}</p>
                  </div>
                  <div className="min-w-[150px]">
                    <h3 className="text-sm font-medium text-gray-500">Match Rate</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {job.candidateCount ? Math.round((job.shortlistedCount || 0) / job.candidateCount * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`${selectedCandidate ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {candidates.length > 0 ? 'Candidates' : 'No Candidates Yet'}
                  </h2>
                  {selectedCandidate && (
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="text-sm text-hr-blue hover:text-hr-darkBlue lg:hidden"
                    >
                      Back to list
                    </button>
                  )}
                </div>
                
                {candidates.length > 0 ? (
                  <div className={`space-y-4 ${selectedCandidate ? 'hidden lg:block' : ''}`}>
                    {candidates.map((candidate) => (
                      <CandidateCard 
                        key={candidate.id} 
                        candidate={candidate}
                        onSelect={handleCandidateSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-3">
                      No candidates have been added for this position yet.
                    </p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-4 py-2 bg-hr-blue text-white rounded-md hover:bg-hr-darkBlue"
                    >
                      Upload Resumes
                    </button>
                  </div>
                )}
              </div>
              
              {selectedCandidate && (
                <div className="lg:col-span-2">
                  <CandidateDetail 
                    candidate={selectedCandidate}
                    onShortlist={handleShortlistCandidate}
                    onReject={handleRejectCandidate}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Resumes</h2>
              <p className="text-gray-600 mb-6">
                Upload candidate resumes for this job opening. Our AI will analyze each resume and match candidates to the job requirements.
              </p>
              
              <ResumeUploader 
                jobId={job.id}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

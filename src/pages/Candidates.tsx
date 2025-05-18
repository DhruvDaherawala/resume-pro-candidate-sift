
import React, { useEffect, useState } from 'react';
import { Candidate } from '@/types';
import { apiService } from '@/services/api';
import CandidateCard from '@/components/candidates/CandidateCard';
import CandidateDetail from '@/components/candidates/CandidateDetail';
import { useToast } from '@/hooks/use-toast';

const Candidates = () => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'shortlisted' | 'new' | 'rejected'>('all');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const allCandidates = await apiService.getCandidates();
        setCandidates(allCandidates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidates();
  }, []);

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleShortlistCandidate = async (candidate: Candidate) => {
    try {
      await apiService.shortlistCandidate(candidate.id, '');
      
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
        description: `${candidate.name} has been shortlisted.`,
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
      description: `${candidate.name} has been rejected.`,
    });
  };

  // Filter candidates based on selected filter
  const filteredCandidates = candidates.filter(candidate => {
    if (filter === 'all') return true;
    return candidate.status === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
        <p className="mt-1 text-gray-600">View and manage all candidates</p>
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
          All
        </button>
        <button
          onClick={() => setFilter('shortlisted')}
          className={`px-4 py-2 text-sm font-medium ${
            filter === 'shortlisted' 
              ? 'text-hr-blue border-b-2 border-hr-blue' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Shortlisted
        </button>
        <button
          onClick={() => setFilter('new')}
          className={`px-4 py-2 text-sm font-medium ${
            filter === 'new' 
              ? 'text-hr-blue border-b-2 border-hr-blue' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          New
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 text-sm font-medium ${
            filter === 'rejected' 
              ? 'text-hr-blue border-b-2 border-hr-blue' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Rejected
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="h-40 bg-white rounded-lg p-6 animate-pulse-light"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${selectedCandidate ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredCandidates.length > 0 
                  ? `${filteredCandidates.length} Candidates`
                  : 'No Candidates Found'}
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
            
            {filteredCandidates.length > 0 ? (
              <div className={`space-y-4 ${selectedCandidate ? 'hidden lg:block' : ''}`}>
                {filteredCandidates.map((candidate) => (
                  <CandidateCard 
                    key={candidate.id} 
                    candidate={candidate}
                    onSelect={handleCandidateSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No candidates found</h3>
                <p className="mt-1 text-gray-500">
                  {filter !== 'all' 
                    ? `There are no ${filter} candidates.` 
                    : "No candidates have been added yet."}
                </p>
                {filter !== 'all' && (
                  <button 
                    onClick={() => setFilter('all')} 
                    className="mt-4 text-hr-blue hover:text-hr-darkBlue font-medium"
                  >
                    View all candidates
                  </button>
                )}
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
    </div>
  );
};

export default Candidates;

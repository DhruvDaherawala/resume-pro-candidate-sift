
import React from 'react';
import { Candidate } from '@/types';

interface CandidateCardProps {
  candidate: Candidate;
  onSelect?: (candidate: Candidate) => void;
}

const CandidateCard = ({ candidate, onSelect }: CandidateCardProps) => {
  // Get the initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Format the match score for display
  const formatMatchScore = (score?: number) => {
    if (score === undefined) return null;
    return `${score}%`;
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'interviewing': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      onClick={() => onSelect?.(candidate)}
      className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-hr-lightBlue text-hr-blue flex items-center justify-center font-medium">
            {getInitials(candidate.name)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 truncate">{candidate.name}</h3>
            {candidate.matchScore !== undefined && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hr-blue text-white">
                {formatMatchScore(candidate.matchScore)} match
              </span>
            )}
          </div>
          
          <p className="mt-1 text-sm text-gray-500 truncate">{candidate.email}</p>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {candidate.skills.slice(0, 4).map((skill, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
            {candidate.skills.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +{candidate.skills.length - 4}
              </span>
            )}
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">
                Experience: {candidate.experience.length > 0 ? `${candidate.experience[0].role} at ${candidate.experience[0].company}` : 'N/A'}
              </span>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;

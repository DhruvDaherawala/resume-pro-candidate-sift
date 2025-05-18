
import React from 'react';
import { Candidate } from '@/types';

interface CandidateDetailProps {
  candidate: Candidate;
  onShortlist?: (candidate: Candidate) => void;
  onReject?: (candidate: Candidate) => void;
}

const CandidateDetail = ({ candidate, onShortlist, onReject }: CandidateDetailProps) => {
  // Get the initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-full bg-hr-lightBlue text-hr-blue flex items-center justify-center text-xl font-medium">
            {getInitials(candidate.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
            <p className="text-gray-600">{candidate.email}</p>
            {candidate.phone && <p className="text-gray-600">{candidate.phone}</p>}
            
            {candidate.matchScore !== undefined && (
              <div className="mt-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">Match Score:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5 max-w-xs">
                    <div 
                      className="bg-hr-blue h-2.5 rounded-full" 
                      style={{ width: `${candidate.matchScore}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-hr-blue">{candidate.matchScore}%</span>
                </div>
              </div>
            )}
            
            <div className="mt-4 flex space-x-2">
              {candidate.status !== 'shortlisted' && candidate.status !== 'hired' && onShortlist && (
                <button 
                  onClick={() => onShortlist(candidate)}
                  className="px-3 py-1.5 bg-hr-blue text-white text-sm font-medium rounded hover:bg-hr-darkBlue"
                >
                  Shortlist Candidate
                </button>
              )}
              
              {candidate.status !== 'rejected' && onReject && (
                <button 
                  onClick={() => onReject(candidate)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Experience</h3>
        <div className="space-y-4">
          {candidate.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-hr-lightBlue pl-4">
              <h4 className="font-medium text-gray-900">{exp.role}</h4>
              <div className="text-sm text-gray-600">{exp.company}</div>
              <div className="text-sm text-gray-500">{exp.duration}</div>
              {exp.description && (
                <p className="mt-1 text-sm text-gray-600">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Education</h3>
        <div className="space-y-4">
          {candidate.education.map((edu, index) => (
            <div key={index}>
              <h4 className="font-medium text-gray-900">{edu.degree}</h4>
              <div className="text-sm text-gray-600">{edu.institution}</div>
              <div className="text-sm text-gray-500">{edu.year}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;

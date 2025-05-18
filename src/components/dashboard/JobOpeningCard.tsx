
import React from 'react';
import { JobOpening } from '@/types';
import { Link } from 'react-router-dom';

interface JobOpeningCardProps {
  job: JobOpening;
}

const JobOpeningCard = ({ job }: JobOpeningCardProps) => {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.department} • {job.location}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hr-lightBlue text-hr-blue">
          {job.type}
        </span>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-1">
        {job.requirements.slice(0, 3).map((req, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
          >
            {req}
          </span>
        ))}
        {job.requirements.length > 3 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            +{job.requirements.length - 3} more
          </span>
        )}
      </div>
      
      <div className="mt-5 flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex space-x-4">
          <div className="text-sm">
            <span className="text-gray-500">Candidates: </span>
            <span className="font-medium text-gray-900">{job.candidateCount}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Shortlisted: </span>
            <span className="font-medium text-gray-900">{job.shortlistedCount}</span>
          </div>
        </div>
        <Link 
          to={`/jobs/${job.id}`}
          className="inline-flex items-center px-3 py-1.5 border border-hr-blue rounded-md text-sm font-medium text-hr-blue bg-white hover:bg-hr-lightBlue"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobOpeningCard;

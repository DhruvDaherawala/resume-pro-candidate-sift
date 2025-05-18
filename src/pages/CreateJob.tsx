
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '@/components/jobs/JobForm';

const CreateJob = () => {
  const navigate = useNavigate();
  
  const handleComplete = () => {
    navigate('/jobs');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Job Opening</h1>
        <p className="mt-1 text-gray-600">Post a new position and start receiving candidates</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <JobForm onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default CreateJob;


import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface JobFormProps {
  onComplete: () => void;
}

const JobForm = ({ onComplete }: JobFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time' as const,
    description: '',
    requirements: [''] // Start with one empty requirement
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.department || !formData.location || !formData.description) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty requirements
    const validRequirements = formData.requirements.filter(req => req.trim() !== '');
    if (validRequirements.length === 0) {
      toast({
        title: "Please add at least one job requirement",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create the job opening
      await apiService.createJobOpening({
        ...formData,
        status: 'active',
        requirements: validRequirements
      });
      
      toast({
        title: "Job opening created successfully",
        description: "Candidates can now apply for this position."
      });
      
      onComplete();
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Failed to create job opening",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-hr-blue focus:outline-none focus:ring-1 focus:ring-hr-blue"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department *
          </label>
          <input
            id="department"
            name="department"
            type="text"
            required
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-hr-blue focus:outline-none focus:ring-1 focus:ring-hr-blue"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-hr-blue focus:outline-none focus:ring-1 focus:ring-hr-blue"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Employment Type *
          </label>
          <select
            id="type"
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-hr-blue focus:outline-none focus:ring-1 focus:ring-hr-blue"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Job Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-hr-blue focus:outline-none focus:ring-1 focus:ring-hr-blue"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Requirements *
          </label>
          <button
            type="button"
            onClick={addRequirement}
            className="text-sm text-hr-blue hover:text-hr-darkBlue"
          >
            + Add Requirement
          </button>
        </div>

        <div className="mt-2 space-y-2">
          {formData.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={requirement}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                placeholder="e.g., 3+ years experience in React"
                className="flex-1 rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-hr-blue focus:outline-none focus:ring-1 focus:ring-hr-blue"
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hr-blue hover:bg-hr-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hr-blue disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Job Opening"}
        </button>
      </div>
    </form>
  );
};

export default JobForm;


import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ResumeUploader from '@/components/resumes/ResumeUploader';
import { FileText } from 'lucide-react';

const ResumeUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') || '';
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = (result: { uploaded: number; processed: number }) => {
    toast({
      title: "Resume upload complete",
      description: `${result.uploaded} resumes uploaded and ${result.processed} processed successfully.`,
    });
    
    // Navigate back after successful upload
    setTimeout(() => {
      if (jobId) {
        navigate(`/jobs/${jobId}`);
      } else {
        navigate('/candidates');
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText size={32} className="text-hr-blue" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Resumes</h1>
          <p className="mt-1 text-gray-600">
            Upload candidate resumes for processing and matching
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <ResumeUploader 
          jobId={jobId}
          onUploadComplete={handleUploadComplete}
        />

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold mb-2">How it works</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-hr-blue text-white text-xs">1</span>
              <p>Upload PDF or Word document resumes (docx, doc, pdf).</p>
            </li>
            <li className="flex items-start">
              <span className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-hr-blue text-white text-xs">2</span>
              <p>Our AI processing will extract key information like skills, experience, and education.</p>
            </li>
            <li className="flex items-start">
              <span className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-hr-blue text-white text-xs">3</span>
              <p>Candidates are automatically matched to relevant job openings based on their qualifications.</p>
            </li>
            <li className="flex items-start">
              <span className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-hr-blue text-white text-xs">4</span>
              <p>Review candidates on the Candidates page or within specific job openings.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;

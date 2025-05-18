
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { Upload, FileText } from 'lucide-react';

interface ResumeUploaderProps {
  jobId: string;
  onUploadComplete?: (result: { uploaded: number; processed: number }) => void;
}

const ResumeUploader = ({ jobId, onUploadComplete }: ResumeUploaderProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handles drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type === "application/pdf" || 
              file.type === "application/msword" ||
              file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      
      if (newFiles.length === 0) {
        toast({
          title: "Invalid files",
          description: "Only PDF and Word documents are accepted.",
          variant: "destructive"
        });
        return;
      }
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Trigger input click
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.type === "application/pdf" || 
              file.type === "application/msword" ||
              file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      
      if (newFiles.length === 0) {
        toast({
          title: "Invalid files",
          description: "Only PDF and Word documents are accepted.",
          variant: "destructive"
        });
        return;
      }
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Remove file from list
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Simulate progress for better UX
  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 5;
      if (currentProgress > 90) {
        clearInterval(interval);
        setProgress(90); // Hold at 90% until complete
      } else {
        setProgress(currentProgress);
      }
    }, 500);
    
    return () => clearInterval(interval);
  };

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one resume to upload.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setUploading(true);
      setProgress(0);
      
      // Start progress simulation
      const stopProgress = simulateProgress();
      
      const result = await apiService.uploadResumes(files, jobId);
      
      // Complete progress
      setProgress(100);
      stopProgress();
      
      toast({
        title: "Resumes uploaded successfully",
        description: `${result.uploaded} resumes uploaded and ${result.processed} processed.`,
      });
      
      setFiles([]);
      
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the resumes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 ${
          dragActive ? "border-hr-blue bg-hr-lightBlue/30" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload 
            className="mx-auto h-12 w-12 text-gray-400" 
            size={48}
            strokeWidth={1.5}
          />
          <div className="mt-4 flex text-sm text-gray-600 justify-center">
            <div className="relative cursor-pointer rounded-md font-medium text-hr-blue hover:text-hr-darkBlue focus-within:outline-none">
              <span onClick={onButtonClick}>Upload a file</span>
              <input
                ref={inputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                multiple
              />
            </div>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PDF, DOC, DOCX up to 10MB each
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="border border-gray-200 rounded-md">
          <div className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-200">
            {files.length} {files.length === 1 ? 'file' : 'files'} selected
          </div>
          <ul className="divide-y divide-gray-200">
            {files.map((file, index) => (
              <li key={index} className="px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 bg-gray-50">
            {uploading && (
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div className="bg-hr-blue h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 text-right">{progress}% complete</p>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hr-blue hover:bg-hr-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hr-blue disabled:opacity-50 flex items-center"
              >
                {uploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Resumes...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload and Process Resumes
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;

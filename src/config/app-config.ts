
// Application configuration with environment variables
interface AppConfig {
  apiBaseUrl: string;
  appName: string;
  version: string;
  environment: string;
  routes: {
    dashboard: string;
    jobs: string;
    candidates: string;
    resumeUpload: string;
    createJob: string;
  };
}

// Default configuration with environment variable fallbacks
const appConfig: AppConfig = {
  // API configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // Application metadata
  appName: import.meta.env.VITE_APP_NAME || 'HR AI Platform',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.MODE || 'development',
  
  // Application routes
  routes: {
    dashboard: '/',
    jobs: '/jobs',
    candidates: '/candidates',
    resumeUpload: '/upload-resumes',
    createJob: '/create-job'
  }
};

export default appConfig;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import JobOpenings from "./pages/JobOpenings";
import CreateJob from "./pages/CreateJob";
import JobDetail from "./pages/JobDetail";
import Candidates from "./pages/Candidates";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={
            <MainLayout>
              <JobOpenings />
            </MainLayout>
          } />
          <Route path="/jobs/new" element={
            <MainLayout>
              <CreateJob />
            </MainLayout>
          } />
          <Route path="/jobs/:id" element={
            <MainLayout>
              <JobDetail />
            </MainLayout>
          } />
          <Route path="/candidates" element={
            <MainLayout>
              <Candidates />
            </MainLayout>
          } />
          <Route path="/upload-resumes" element={
            <MainLayout>
              <ResumeUpload />
            </MainLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

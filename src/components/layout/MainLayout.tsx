
import React from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="py-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} HR.ai - AI-Powered HR Management System
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

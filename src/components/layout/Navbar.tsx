
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16 mx-auto max-w-7xl">
        <Link to="/" className="flex items-center space-x-2">
          <Briefcase className="w-6 h-6 text-hr-blue" />
          <span className="font-bold text-xl text-hr-darkBlue">HR.ai</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-hr-blue flex items-center space-x-1">
            <span>Dashboard</span>
          </Link>
          <Link to="/jobs" className="text-gray-600 hover:text-hr-blue flex items-center space-x-1">
            <span>Job Openings</span>
          </Link>
          <Link to="/candidates" className="text-gray-600 hover:text-hr-blue flex items-center space-x-1">
            <span>Candidates</span>
          </Link>
          <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
              <Search className="w-5 h-5" />
            </button>
            <div className="p-1 rounded-full bg-hr-lightBlue">
              <User className="w-5 h-5 text-hr-blue" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

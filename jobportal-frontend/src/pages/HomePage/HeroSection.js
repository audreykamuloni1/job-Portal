import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, UserPlusIcon } from '@heroicons/react/24/solid'; // Example Heroicons

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Find Your <span className="text-yellow-300">Dream Job</span> Today
        </h1>
        <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Connecting talent with opportunity. Explore thousands of job listings from top companies in Malawi and beyond.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition duration-150 ease-in-out shadow-lg transform hover:scale-105"
          >
            <BriefcaseIcon className="h-6 w-6 mr-2" />
            Browse Jobs
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition duration-150 ease-in-out shadow-lg transform hover:scale-105"
          >
            <UserPlusIcon className="h-6 w-6 mr-2" />
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

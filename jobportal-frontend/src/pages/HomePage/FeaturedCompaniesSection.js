import React, { useState, useEffect } from 'react';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline'; // Example icon

const FeaturedCompaniesSection = () => {
  const [companies, setCompanies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Simulated featured companies data with more generic placeholder style
  const initialCompanies = [
    { id: 1, name: 'Tech Solutions Inc.', logoUrl: 'https://placehold.co/150x75/007bff/ffffff?text=TechCo&font=sans-serif' },
    { id: 2, name: 'Innovate Hub', logoUrl: 'https://placehold.co/150x75/28a745/ffffff?text=Innovate&font=sans-serif' },
    { id: 3, name: 'Future Systems Ltd.', logoUrl: 'https://placehold.co/150x75/ffc107/000000?text=FutureSys&font=sans-serif' },
    { id: 4, name: 'Global Connect', logoUrl: 'https://placehold.co/150x75/dc3545/ffffff?text=GlobalConnect&font=sans-serif' },
    { id: 5, name: 'Alpha Corp', logoUrl: 'https://placehold.co/150x75/17a2b8/ffffff?text=AlphaCorp&font=sans-serif' },
  ];

  useEffect(() => {
    setCompanies(initialCompanies);
  }, []);

  useEffect(() => {
    if (companies.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % companies.length);
    }, 3000); // Change company every 3 seconds

    return () => clearInterval(intervalId);
  }, [companies]);

  return (
    <div className="py-16 bg-gray-50 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Featured Companies
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            We partner with leading companies to bring you the best opportunities.
          </p>
        </div>

        {companies.length > 0 ? (
          <div className="relative h-48 flex items-center justify-center"> {/* Container for the sliding effect if re-added */}
            {companies.map((company, index) => (
              <div
                key={company.id}
                className={`absolute transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out w-64 h-auto">
                  <img 
                    src={company.logoUrl} 
                    alt={`${company.name} logo`}
                    className="h-16 object-contain mb-4 rounded" // Adjusted size and added rounded
                  />
                  <p className="text-xl font-semibold text-gray-800">{company.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <BuildingOffice2Icon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Loading featured companies...</p>
          </div>
        )}
        
        <div className="mt-12 text-center">
           <p className="text-sm text-gray-600">New companies featured weekly. Stay tuned!</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCompaniesSection;

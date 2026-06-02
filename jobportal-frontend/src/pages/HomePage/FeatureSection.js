import React from 'react';
import { MagnifyingGlassIcon, DocumentTextIcon, ChartBarIcon, BellIcon } from '@heroicons/react/24/outline'; // Using outline icons for a lighter feel

const FeaturesSection = () => {
  const features = [
    { title: 'Wide Range of Jobs', description: 'Access a diverse selection of job opportunities across various industries.', icon: MagnifyingGlassIcon },
    { title: 'Easy Application Process', description: 'Apply to jobs seamlessly with our user-friendly interface.', icon: DocumentTextIcon },
    { title: 'Career Growth Resources', description: 'Utilize our resources and tools to advance your career.', icon: ChartBarIcon },
    { title: 'Personalized Job Alerts', description: 'Get notified about new job postings that match your preferences.', icon: BellIcon },
  ];

  return (
    <div className="py-16 bg-gray-100 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Our Advantages</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose Our Platform?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Designed for Malawi's unique employment landscape, providing tools and resources for both job seekers and employers.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-6">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../../components/homepage/HeroSection';
import FeaturesSection from '../../components/homepage/FeaturesSection';
import FeaturedCompaniesSection from '../../components/homepage/FeaturedCompaniesSection';
import { MapPinIcon, EnvelopeIcon, PhoneIcon, BuildingLibraryIcon, ShieldCheckIcon, DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// Styles are now handled by Tailwind CSS, so HomePage.css is no longer needed.

const HomePage = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about', icon: BuildingLibraryIcon },
    { name: 'Privacy Policy', href: '/privacy', icon: ShieldCheckIcon },
    { name: 'Terms of Service', href: '/terms', icon: DocumentTextIcon },
  ];

  const socialLinks = [ // Placeholder social links
    { name: 'Facebook', href: '#', icon: 'f_logo' }, // Replace with actual SVG or component
    { name: 'Twitter', href: '#', icon: 't_logo' },
    { name: 'LinkedIn', href: '#', icon: 'l_logo' },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans"> {/* Ensure footer sticks to bottom */}
      <main className="flex-grow"> {/* All content except footer */}
        <HeroSection />
        <FeaturesSection />
        <FeaturedCompaniesSection />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Contact Us */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
              <p className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-2 mt-1 text-indigo-400 flex-shrink-0" />
                <span>Lilongwe 3, Malawi</span>
              </p>
              <a href="mailto:contact@malawijobs.mw" className="flex items-center hover:text-indigo-300 transition-colors">
                <EnvelopeIcon className="h-5 w-5 mr-2 text-indigo-400 flex-shrink-0" />
                <span>contact@malawijobs.mw</span>
              </a>
              <a href="tel:+265992005615" className="flex items-center hover:text-indigo-300 transition-colors">
                <PhoneIcon className="h-5 w-5 mr-2 text-indigo-400 flex-shrink-0" />
                <span>+265 992 005 615</span>
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="flex items-center hover:text-indigo-300 transition-colors group">
                      <link.icon className="h-5 w-5 mr-2 text-indigo-400 group-hover:text-indigo-300 flex-shrink-0" />
                      <span>{link.name}</span>
                      <ArrowRightIcon className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stay Connected / Newsletter (Example) */}
            <div className="lg:col-span-2"> {/* Spans 2 columns on larger screens */}
              <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
              <p className="mb-3">Subscribe to our newsletter for the latest job postings and career tips.</p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow px-4 py-2.5 rounded-md bg-slate-700 text-slate-200 border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder-slate-400"
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  Subscribe
                </button>
              </form>
              {/* Placeholder for social media icons - requires actual icons/components */}
              <div className="mt-6">
                <h5 className="text-md font-semibold text-white mb-2">Follow Us:</h5>
                <div className="flex space-x-4">
                  {/* Example: <a href="#" className="text-slate-400 hover:text-indigo-300"><FacebookIcon /></a> */}
                  <p className="text-sm text-slate-500">(Social media icons coming soon)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center border-t border-slate-700 pt-8 mt-8">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Malawi Job Portal. All rights reserved.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Built with React & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
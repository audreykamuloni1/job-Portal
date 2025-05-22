import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  

  // Malawian-focused features
  const features = [
    {
      icon: '🔍',
      title: 'Easy Job Search',
      description: 'Find opportunities across Malawi with our localized filters'
    },
    {
      icon: '⚡',
      title: 'Quick Apply',
      description: 'Submit applications using your Malawian digital CV'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your applications with Malawian employers'
    }
  ];

  // Simulated API call for featured companies
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        // TODO: Replace with actual API call
        const malawianCompanies = [
          {
            id: 1,
            logo: '🏦',
            title: 'Banking Officer',
            
          },
          {
            id: 2,
            logo: '🏥',
            title: 'Nurse Practitioner',
           
          },
          {
            id: 3,
            logo: '🌱',
            title: 'Agriculture Expert',
            
          }
        ];

        setFeaturedCompanies(malawianCompanies);
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your <span className="highlight">Opportunity</span> in Malawi
            </h1>
            <p className="hero-description">
              Connect with Malawian employers and discover roles that match your skills. 
              Your next career move starts here.
            </p>
            <div className="hero-actions">
              <Link to="/jobs" className="btn-primary">
                Browse Jobs
              </Link>
              <Link to="/register" className="btn-secondary">
                Get Started
              </Link>
            </div>
          </div>

          {/* Animated Company Cards */}
          <div className="hero-image">
            <div className="hero-graphic">
              {isLoading ? (
                <div className="loading-jobs">Loading opportunities...</div>
              ) : (
                featuredCompanies.map((company, index) => (
                  <div 
                    key={company.id} 
                    className={`floating-card card-${index + 1}`}
                  >
                    <div className="card-content">
                      <div className="company-logo">{company.logo}</div>
                      <div className="job-info">
                        <h4>{company.title}</h4>
                        
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Platform?</h2>
            <p>Designed for Malawi's unique employment landscape</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h4>Contact Us</h4>
              <p>Lilongwe 3, Malawi</p>
              <p>📧 contact@malawijobs.mw</p>
              <p>📞 +265 992 005 615</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link to="/about">About Us</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Malawi Job Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
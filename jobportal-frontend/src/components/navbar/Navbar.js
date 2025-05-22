import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💼</span>
          <span className="brand-text">JobPortal</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/jobs" className="nav-link">Jobs</Link>
            {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
          </div>

          <div className="auth-section">
            {user ? (
              <div className="user-menu">
                <span className="user-welcome">
                  {user.role === 'employer' ? user.company : user.name}
                </span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn-login">Login</Link>
                <Link to="/register" className="btn-register">Register</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={toggleMobileMenu}>Home</Link>
          <Link to="/jobs" className="mobile-link" onClick={toggleMobileMenu}>Jobs</Link>
          {user && <Link to="/dashboard" className="mobile-link" onClick={toggleMobileMenu}>Dashboard</Link>}
          
          <div className="mobile-auth-section">
            {user ? (
              <>
                <span className="mobile-user-info">
                  {user.role === 'employer' ? user.company : user.name}
                </span>
                <button onClick={handleLogout} className="mobile-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-link" onClick={toggleMobileMenu}>Login</Link>
                <Link to="/register" className="mobile-register" onClick={toggleMobileMenu}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
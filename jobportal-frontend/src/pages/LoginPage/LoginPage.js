import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Footer from '../../components/Footer/Footer';


const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'jobSeeker'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulated API call
      const mockUser = {
        id: 1,
        email: formData.email,
        name: 'John Doe',
        role: formData.role
      };
      
      onLogin(mockUser, 'mock-token');
      navigate(formData.role === 'employer' ? '/employer-dashboard' : '/dashboard');
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    }
    setIsLoading(false);
  };

  return (
   
    <div className="login-page">
      <div className="login-container">
        <div className="form-card">
          <div className="form-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {errors.submit && <div className="error-alert">{errors.submit}</div>}

            <div className="form-group">
              <label>Account Type</label>
              <div className="role-selection">
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="jobSeeker"
                    checked={formData.role === 'jobSeeker'}
                    onChange={handleChange}
                  />
                  <span className="role-label">Job Seeker</span>
                </label>
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    checked={formData.role === 'employer'}
                    onChange={handleChange}
                  />
                  <span className="role-label">Employer</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="form-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="signup-link">
                  Create account
                </Link>
              </p>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
   
  );
};

export default LoginPage;
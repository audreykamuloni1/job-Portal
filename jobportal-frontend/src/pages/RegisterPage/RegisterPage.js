import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'JOB_SEEKER', // default selection
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1800);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <div className="user-type-select">
          <label>
            <input
              type="radio"
              name="userType"
              value="JOB_SEEKER"
              checked={formData.userType === 'JOB_SEEKER'}
              onChange={handleChange}
            />
            Job Seeker
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="EMPLOYER"
              checked={formData.userType === 'EMPLOYER'}
              onChange={handleChange}
            />
            Employer
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default RegisterPage;
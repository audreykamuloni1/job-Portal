import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.roles?.includes('ROLE_EMPLOYER')) {
      navigate('/dashboard/employer');
    } else {
      navigate('/dashboard/job-seeker');
    }
  }, [user, loading, navigate]);

  // Optionally, display a loader
  return <div>Loading dashboard...</div>;
};

export default DashboardRedirect;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import JobListPage from './pages/JobListPage/JobListPage';

import JobSeekerDashboardLayout from './pages/Dashboard/JobSeeker/JobSeekerDashboardLayout';
import JobSeekerProfilePage from './pages/Dashboard/JobSeeker/JobSeekerProfilePage';
import MyApplicationsPage from './pages/Dashboard/JobSeeker/MyApplicationPage';
import JobSeekerHome from './pages/Dashboard/JobSeeker/JobSeekerHome'; // Import JobSeekerHome
import EmployerDashboard from './pages/Dashboard/EmployerDashboard';
import DashboardRedirect from './pages/Dashboard/DashboardRedirect';
import RoleProtectedRoute from './components/RoleProtectedRoute';
// Employer Pages
import EmployerProfilePage from './pages/Dashboard/Employer/EmployerProfilePage';
import PostJobPage from './pages/Dashboard/Employer/PostJobPage';
import ManageJobsPage from './pages/Dashboard/Employer/ManageJobsPage';
import EmployerHome from './pages/Dashboard/Employer/EmployerHome'; // Import EmployerHome
import './App.css';

// ProtectedRoute for general authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<JobListPage />} />

              {/* Central dashboard route: redirects based on role */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                }
              />
              {/* Job Seeker Dashboard (only for job seekers) - Now with nested routes */}
              <Route
                path="/dashboard/job-seeker"
                element={
                  <RoleProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <JobSeekerDashboardLayout />
                  </RoleProtectedRoute>
                }
              >
                <Route index element={<JobSeekerHome />} /> {/* This is the new default */}
                <Route path="profile" element={<JobSeekerProfilePage />} />
                <Route path="my-applications" element={<MyApplicationsPage />} />
                {/* The "Browse Jobs" link in JobSeekerDashboardLayout points to /jobs, which is a top-level route */}
              </Route>
              
              {/* Employer Dashboard (only for employers) - Now with nested routes */}
              <Route
                path="/dashboard/employer"
                element={
                  <RoleProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                    <EmployerDashboard /> 
                  </RoleProtectedRoute>
                }
              >
                <Route index element={<EmployerHome />} /> {/* This is the new default */}
                <Route path="profile" element={<EmployerProfilePage />} />
                <Route path="post-job" element={<PostJobPage />} />
                <Route path="manage-jobs" element={<ManageJobsPage />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
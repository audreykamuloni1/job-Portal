import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import JobListPage from './pages/JobListPage/JobListPage';
// Use these imports for dashboards and redirector:
import JobSeekerDashboard from './pages/Dashboard/JobSeekerDashboard';
import EmployerDashboard from './pages/Dashboard/EmployerDashboard';
import DashboardRedirect from './pages/Dashboard/DashboardRedirect';
import RoleProtectedRoute from './components/RoleProtectedRoute';
// Employer Pages
import EmployerProfilePage from './pages/Dashboard/Employer/EmployerProfilePage';
import PostJobPage from './pages/Dashboard/Employer/PostJobPage';
import ManageJobsPage from './pages/Dashboard/Employer/ManageJobsPage';
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
              {/* Job Seeker Dashboard (only for job seekers) */}
              <Route
                path="/dashboard/job-seeker"
                element={
                  <RoleProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <JobSeekerDashboard />
                  </RoleProtectedRoute>
                }
              />
              {/* Employer Dashboard (only for employers) */}
              {/* Employer Dashboard (only for employers) - Now with nested routes */}
              <Route
                path="/dashboard/employer"
                element={
                  <RoleProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                    <EmployerDashboard /> 
                  </RoleProtectedRoute>
                }
              >
                {/* Default content for /dashboard/employer is handled within EmployerDashboard.js */}
                {/* Child routes will be rendered by the <Outlet /> in EmployerDashboard */}
                <Route path="profile" element={<EmployerProfilePage />} />
                <Route path="post-job" element={<PostJobPage />} />
                <Route path="manage-jobs" element={<ManageJobsPage />} />
                {/* An index route could be added here if EmployerDashboard itself shouldn't show default content */}
                {/* <Route index element={<SomeEmployerWelcomeComponent />} /> */}
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
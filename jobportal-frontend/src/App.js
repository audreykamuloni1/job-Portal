import React from 'react';
import MainLayout from './components/layout/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingProvider } from './contexts/LoadingContext'; // Adjust path as needed
import GlobalLoadingIndicator from './components/common/GlobalLoadingIndicator'; // Adjust path as needed
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Typography from '@mui/material/Typography'; // For placeholder - can be removed if HomePage/JobsPage don't use it directly
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import HomePage from './pages/HomePage/HomePage';
import JobListPage from './pages/JobListPage/JobListPage';
import JobDetailsPage from './pages/JobDetailsPage/JobDetailsPage';
import JobSeekerDashboard from './pages/Dashboard/JobSeekerDashboard';
import JobSeekerProfilePage from './pages/Dashboard/JobSeeker/JobSeekerProfilePage';
import MyApplicationsPage from './pages/Dashboard/JobSeeker/MyApplicationPage';
import EmployerDashboard from './pages/Dashboard/EmployerDashboard';
import EmployerProfilePage from './pages/Dashboard/Employer/EmployerProfilePage';
import PostJobPage from './pages/Dashboard/Employer/PostJobPage'; 
import ViewApplicantsPage from './pages/Dashboard/Employer/ViewApplicantsPage'; 
import AdminDashboard from './pages/Dashboard/Admin/AdminDashboard';
import UserManagementPage from './pages/Dashboard/Admin/UserManagementPage';
import JobApprovalPage from './pages/Dashboard/Admin/JobApprovalPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import RoleProtectedRoute from './components/RoleProtectedRoute'; // Import RoleProtectedRoute
import UnauthorizedPage from './pages/UnauthorizedPage'; // Import UnauthorizedPage

// LoginPage and RegisterPage are now imported from their respective files
// HomePage and JobListPage are now imported from their respective files
// JobDetailsPage is imported
// Job Seeker Dashboard pages are imported
// Employer Dashboard pages are imported
// Admin Dashboard pages are imported
import ManageJobsPage from './pages/Dashboard/Employer/ManageJobsPage'; // Import actual ManageJobsPage

// Placeholder components for Employer routes not yet created
// const ManageJobsPagePlaceholder = () => <Typography variant="h4" sx={{p:3}}>Employer - Manage Jobs Page (Placeholder)</Typography>; // Replaced

function App() {
  return (
    <Router>
      <LoadingProvider> {/* LoadingProvider wraps everything that might need loading state or trigger loading */}
        <GlobalLoadingIndicator /> {/* Render the indicator globally */}
        <MainLayout>
          <ToastContainer /> {/* ToastContainer added here */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes - Require Authentication */}
          <Route element={<ProtectedRoute />}>
            {/* Job Seeker Specific Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']} />}>
              <Route path="/dashboard/job-seeker" element={<JobSeekerDashboard />} />
              <Route path="/profile/job-seeker" element={<JobSeekerProfilePage />} />
              <Route path="/my-applications" element={<MyApplicationsPage />} />
            </Route>

            {/* Employer Specific Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={['ROLE_EMPLOYER']} />}>
              <Route path="/dashboard/employer" element={<EmployerDashboard />} />
              <Route path="/profile/employer" element={<EmployerProfilePage />} />
              <Route path="/employer/post-job" element={<PostJobPage />} />
              <Route path="/employer/manage-jobs" element={<ManageJobsPage />} /> {/* Use actual component */}
              <Route path="/employer/jobs/:jobId/applicants" element={<ViewApplicantsPage />} />
            </Route>

            {/* Admin Specific Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/user-management" element={<UserManagementPage />} />
              <Route path="/admin/job-approvals" element={<JobApprovalPage />} />
            </Route>
            
            {/* Routes accessible by any authenticated user if not fitting specific roles above, e.g. a generic /dashboard */}
            {/* <Route path="/dashboard" element={<GenericDashboard />} /> */}
          </Route>
          
          </Routes>
        </MainLayout>
      </LoadingProvider>
    </Router>
  );
}

export default App;
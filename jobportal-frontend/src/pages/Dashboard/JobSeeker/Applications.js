import React, { useEffect, useState } from 'react';
import applicationService from '../../services/applicationService';
import authService from '../../services/authService';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const user = authService.getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await applicationService.getApplicationsByUser(user.id);
        setApplications(res.data);
      } catch (err) {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <div>Loading applications...</div>;
  if (!applications.length) return <div>No applications found.</div>;

  return (
    <div>
      <h2>My Applications</h2>
      <table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Status</th>
            <th>Date Applied</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.jobTitle || app.job?.title}</td>
              <td>{app.status}</td>
              <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Applications;
import React from 'react';

const JobDetailsModal = ({ job, onClose, onApply }) => (
  <div className="modal">
    <div className="modal-content">
      <h2>{job.title}</h2>
      <p><b>Company:</b> {job.employerName}</p>
      <p><b>Description:</b> {job.description}</p>
      <p><b>Location:</b> {job.location}</p>
      <p><b>Type:</b> {job.jobType}</p>
      <p><b>Salary:</b> {job.salary || 'N/A'}</p>
      <p><b>Deadline:</b> {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'N/A'}</p>
      {onApply && <button onClick={onApply}>Apply</button>}
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

export default JobDetailsModal;
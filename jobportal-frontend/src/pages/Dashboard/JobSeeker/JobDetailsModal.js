import React from "react";
import "./JobDetailsModal.css";

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>{job.title}</h2>
        <p><strong>Company:</strong> {job.employerName}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Type:</strong> {job.jobType}</p>
        <p><strong>Salary:</strong> {job.salary || "N/A"}</p>
        <p><strong>Deadline:</strong> {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "N/A"}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <p><strong>Requirements:</strong> {job.requirements}</p>
        {/* Placeholder for Apply button */}
        <button className="apply-btn" disabled>Apply (coming soon)</button>
      </div>
    </div>
  );
};

export default JobDetailsModal;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jobService from '../../services/jobService';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const data = await jobService.getJobById(id);
      setJob(data);
    };
    fetchJob();
  }, [id]);

  if (!job) {
    return <p>Loading job details...</p>;
  }

  return (
    <div className="job-details">
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Requirements:</strong> {job.requirements}</p>
    </div>
  );
};

export default JobDetails;

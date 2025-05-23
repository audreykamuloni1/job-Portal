import React, { useState, useEffect, useContext } from 'react';
import profileService from '../../../services/profileService';
import { AuthContext } from '../../../contexts/AuthContext'; // To get user info if needed

const EmployerProfilePage = () => {
    const [profile, setProfile] = useState({
        companyName: '',
        companyDescription: '',
        companyWebsite: '',
        companyContactPhone: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { user } = useContext(AuthContext); // Get user from AuthContext

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await profileService.getEmployerProfile();
                if (data) {
                    setProfile({
                        companyName: data.companyName || '',
                        companyDescription: data.companyDescription || '',
                        companyWebsite: data.companyWebsite || '',
                        companyContactPhone: data.companyContactPhone || ''
                    });
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch company profile. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            setSuccessMessage('');
            await profileService.updateEmployerProfile(profile);
            setSuccessMessage('Company profile updated successfully!');
        } catch (err) {
            setError(err.message || 'Failed to update company profile. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile.companyName) { // Show loading only on initial load
        return <p>Loading company profile...</p>;
    }

    return (
        <div>
            <h2>Company Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <form onSubmit={handleSubmitProfile}>
                <h3>Update Company Information</h3>
                <div>
                    <label htmlFor="companyName">Company Name:</label>
                    <input type="text" name="companyName" value={profile.companyName} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="companyContactPhone">Company Contact Phone:</label>
                    <input type="text" name="companyContactPhone" value={profile.companyContactPhone} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="companyWebsite">Company Website:</label>
                    <input type="url" name="companyWebsite" value={profile.companyWebsite} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="companyDescription">Company Description:</label>
                    <textarea name="companyDescription" value={profile.companyDescription} onChange={handleChange}></textarea>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Company Profile'}
                </button>
            </form>
        </div>
    );
};

export default EmployerProfilePage;

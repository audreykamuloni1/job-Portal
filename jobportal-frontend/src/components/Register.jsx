
import React, { useState } from 'react'; // Imports the React library and the useState hook for managing component state.
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// Defines a functional React component named 'Register'
const Register = () => {
     // It's an object that will hold the values of the registration form fields.
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        userType: 'JOB_SEEKER' // Initial state for the user type selection, defaulting to 'JOB_SEEKER'.
    });

     // This will be used to display any registration errors to the user.
    const [error, setError] = useState('');

    // This function will be used to redirect the user to a different page after successful registration.
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        // Prevents the default form submission behavior, which would cause a page reload.
        e.preventDefault();
        try {
             // It sends the 'formData' object as the request body.
            const response = await axios.post(
                'http://localhost:8088/api/auth/register',
                formData
            );
            
            if (response.status === 201) {
                 // If registration is successful, navigates the user to the '/login' route.
                navigate('/login');
            }
        } catch (err) {
            // If an error occurs during the API call, this block will be executed.
            setError(err.response?.data || 'Registration failed');
        }
    };

    return (
        <div className="register-container">
            <h2>Create Account</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required // Makes this field mandatory.
                        minLength="4" // Sets the minimum length requirement for the username.
                        maxLength="20" // sets the maximum length requirement for the username
                    />
                </div>
                

                <div className="form-group">
                    <label>Register as:</label>
                    <select
                        value={formData.userType}
                        onChange={(e) => setFormData({...formData, userType: e.target.value})}
                    >
                        <option value="JOB_SEEKER">Job Seeker</option>
                        <option value="EMPLOYER">Employer</option>
                    </select>
                </div>

                <button type="submit" className="btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;
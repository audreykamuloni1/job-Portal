import React from 'react';
import { Link } from 'react-router-dom';

function Home() { // Defines a functional React component named 'Home'
    return (
        <div>
        <h1>Welcome to Job Portal</h1>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </div>
    );
}

// exports the Home component to make it available for use in other parts of the application
export default Home; 
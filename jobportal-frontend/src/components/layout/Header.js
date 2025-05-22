import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated, handleLogout }) => (
  <header className="bg-blue-800 text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">JobPortal</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/jobs" className="hover:underline">Jobs</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
              <li><button onClick={handleLogout} className="hover:underline">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:underline">Login</Link></li>
              <li><Link to="/register" className="hover:underline">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
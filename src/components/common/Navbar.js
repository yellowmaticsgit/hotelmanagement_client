import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHotel, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FaHotel /> Hotel Management
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/rooms" className="nav-link">
              Rooms
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <li className="nav-item">
                  <Link to="/admin/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link to="/my-bookings" className="nav-link">
                    My Bookings
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <span className="nav-link user-info">
                  <FaUser /> {user?.firstName || user?.name}
                </span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-btn logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-btn">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-btn register-btn">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

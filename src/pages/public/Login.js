import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { login, loginAsAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isAdminLogin) {
        await loginAsAdmin({ email, password });
        navigate('/admin/dashboard');
      } else {
        await login({ email, password });
        navigate(from);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isAdminLogin ? 'Admin Login' : 'User Login'}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isAdminLogin}
                onChange={(e) => setIsAdminLogin(e.target.checked)}
              />
              Login as Admin
            </label>
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        {!isAdminLogin && (
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        )}

        {isAdminLogin && (
          <p className="admin-note">
            Demo Admin: admin@hotel.com / admin123
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

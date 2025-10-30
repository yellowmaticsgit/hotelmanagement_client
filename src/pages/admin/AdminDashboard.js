import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getDashboardStats } from '../../services/bookingService';
import { 
  FaHotel, 
  FaCalendarCheck, 
  FaDollarSign, 
  FaUsers,
  FaChartLine,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  // Calculate additional statistics
  const occupancyRate = stats.totalRooms > 0 
    ? ((stats.totalRooms - stats.availableRooms) / stats.totalRooms * 100).toFixed(1)
    : 0;

  const averageBookingValue = stats.totalBookings > 0
    ? (stats.totalRevenue / stats.totalBookings).toFixed(2)
    : 0;

  // Survey data (mock data - can be replaced with real survey data)
  const surveyData = [
    { category: 'Excellent', percentage: 65, count: 130 },
    { category: 'Good', percentage: 25, count: 50 },
    { category: 'Average', percentage: 7, count: 14 },
    { category: 'Poor', percentage: 3, count: 6 }
  ];

  // Monthly income data (mock - can be replaced with real data)
  const monthlyIncome = [
    { month: 'Jan', income: 12500 },
    { month: 'Feb', income: 15800 },
    { month: 'Mar', income: 18200 },
    { month: 'Apr', income: 16500 },
    { month: 'May', income: 19800 },
    { month: 'Jun', income: 22400 }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening with your hotel.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <FaHotel />
          </div>
          <div className="stat-details">
            <h3>{stats.totalRooms}</h3>
            <p>Total Rooms</p>
            <span className="stat-sub">{stats.availableRooms} Available</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <FaCalendarCheck />
          </div>
          <div className="stat-details">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
            <span className="stat-sub">{stats.pendingBookings} Pending</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-details">
            <h3>${stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className="stat-sub">All Time</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-details">
            <h3>{occupancyRate}%</h3>
            <p>Occupancy Rate</p>
            <span className="stat-sub">Current Status</span>
          </div>
        </div>
      </div>

      {/* Income & Survey Section */}
      <div className="dashboard-content">
        {/* Income Details */}
        <div className="income-section">
          <div className="section-header">
            <h2><FaDollarSign /> Income Overview</h2>
          </div>

          <div className="income-cards">
            <div className="income-card">
              <div className="income-label">Monthly Revenue</div>
              <div className="income-value">${monthlyIncome[monthlyIncome.length - 1].income.toLocaleString()}</div>
              <div className="income-change positive">+12.5% from last month</div>
            </div>

            <div className="income-card">
              <div className="income-label">Average Booking</div>
              <div className="income-value">${averageBookingValue}</div>
              <div className="income-change neutral">Per reservation</div>
            </div>

            <div className="income-card">
              <div className="income-label">Confirmed Bookings</div>
              <div className="income-value">{stats.confirmedBookings}</div>
              <div className="income-change positive">Revenue generating</div>
            </div>
          </div>

          <div className="income-chart">
            <h3>Monthly Income Trend</h3>
            <div className="chart-bars">
              {monthlyIncome.map((data, index) => (
                <div key={index} className="chart-bar-item">
                  <div className="bar-container">
                    <div 
                      className="bar"
                      style={{ height: `${(data.income / 25000) * 100}%` }}
                    >
                      <span className="bar-value">${(data.income / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                  <div className="bar-label">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Survey/Ratings Section */}
        <div className="survey-section">
          <div className="section-header">
            <h2><FaUsers /> Customer Satisfaction Survey</h2>
          </div>

          <div className="survey-summary">
            <div className="overall-rating">
              <div className="rating-score">4.5</div>
              <div className="rating-stars">★★★★☆</div>
              <div className="rating-count">Based on 200 reviews</div>
            </div>
          </div>

          <div className="survey-breakdown">
            {surveyData.map((item, index) => (
              <div key={index} className="survey-item">
                <div className="survey-label">
                  <span>{item.category}</span>
                  <span className="survey-count">{item.count}</span>
                </div>
                <div className="survey-bar-container">
                  <div 
                    className={`survey-bar ${item.category.toLowerCase()}`}
                    style={{ width: `${item.percentage}%` }}
                  >
                    <span className="percentage">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="satisfaction-metrics">
            <div className="metric">
              <FaCheckCircle className="icon success" />
              <div>
                <div className="metric-value">92%</div>
                <div className="metric-label">Would Recommend</div>
              </div>
            </div>
            <div className="metric">
              <FaClock className="icon warning" />
              <div>
                <div className="metric-value">24min</div>
                <div className="metric-label">Avg Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="recent-bookings-section">
        <div className="section-header">
          <h2>Recent Bookings</h2>
        </div>

        <div className="bookings-table-container">
          {stats.recentBookings && stats.recentBookings.length > 0 ? (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div className="guest-info">
                        <strong>{booking.user?.firstName} {booking.user?.lastName}</strong>
                        <small>{booking.user?.email}</small>
                      </div>
                    </td>
                    <td>
                      <span className="room-badge">
                        {booking.room?.roomType} #{booking.room?.roomNumber}
                      </span>
                    </td>
                    <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                    <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="amount">${booking.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-bookings">
              <p>No recent bookings to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

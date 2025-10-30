import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserBookings, cancelBooking } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { FaCalendarAlt, FaBed, FaUsers, FaDollarSign, FaTimesCircle } from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import './MyBookings.css';

const MyBookings = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please login to view your bookings');
      navigate('/login');
      return;
    }
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      const response = await getUserBookings(user._id);
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="my-bookings-page">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>View and manage your hotel reservations</p>
      </div>

      <div className="bookings-container">
        {bookings.length === 0 ? (
          <div className="no-bookings-message">
            <FaBed className="no-bookings-icon" />
            <h2>No bookings yet</h2>
            <p>You haven't made any reservations yet.</p>
            <button onClick={() => navigate('/rooms')} className="browse-rooms-btn">
              Browse Rooms
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="room-info">
                    <h3>
                      <FaBed /> {booking.room?.roomType?.charAt(0).toUpperCase() + booking.room?.roomType?.slice(1)} Room
                    </h3>
                    <span className="room-number">Room #{booking.room?.roomNumber}</span>
                  </div>
                  <span className={`status-badge ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div>
                      <span className="detail-label">Check-in</span>
                      <span className="detail-value">{formatDate(booking.checkInDate)}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div>
                      <span className="detail-label">Check-out</span>
                      <span className="detail-value">{formatDate(booking.checkOutDate)}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaUsers className="detail-icon" />
                    <div>
                      <span className="detail-label">Guests</span>
                      <span className="detail-value">{booking.numberOfGuests}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaDollarSign className="detail-icon" />
                    <div>
                      <span className="detail-label">Total Price</span>
                      <span className="detail-value">${booking.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="special-requests">
                    <strong>Special Requests:</strong>
                    <p>{booking.specialRequests}</p>
                  </div>
                )}

                <div className="booking-footer">
                  <span className="booking-date">
                    Booked on {formatDate(booking.createdAt)}
                  </span>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="cancel-booking-btn"
                    >
                      <FaTimesCircle /> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

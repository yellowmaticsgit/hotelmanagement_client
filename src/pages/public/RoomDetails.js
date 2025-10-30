import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getRoom } from '../../services/roomService';
import { createBooking } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBed, 
  FaUsers, 
  FaWifi, 
  FaTv, 
  FaSnowflake, 
  FaSwimmingPool,
  FaParking,
  FaDumbbell,
  FaConciergeBell,
  FaCoffee,
  FaUtensils,
  FaStar,
  FaArrowLeft,
  FaCalendarAlt
} from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import './RoomDetails.css';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    loadRoomDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadRoomDetails = async () => {
    try {
      const response = await getRoom(id);
      setRoom(response.data);
    } catch (error) {
      toast.error('Failed to load room details');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <FaWifi />;
    if (amenityLower.includes('tv')) return <FaTv />;
    if (amenityLower.includes('air') || amenityLower.includes('conditioning')) return <FaSnowflake />;
    if (amenityLower.includes('pool')) return <FaSwimmingPool />;
    if (amenityLower.includes('parking')) return <FaParking />;
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <FaDumbbell />;
    if (amenityLower.includes('service')) return <FaConciergeBell />;
    if (amenityLower.includes('coffee') || amenityLower.includes('breakfast')) return <FaCoffee />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return <FaUtensils />;
    return <FaStar />;
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const calculateNights = () => {
    if (bookingData.checkInDate && bookingData.checkOutDate) {
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    return nights * room.price;
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.info('Please login to make a reservation');
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }
    setShowBookingForm(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to make a reservation');
      navigate('/login');
      return;
    }

    // Validate dates
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    if (checkOut <= checkIn) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (bookingData.numberOfGuests > room.capacity) {
      toast.error(`This room can accommodate maximum ${room.capacity} guest(s)`);
      return;
    }

    setBookingLoading(true);

    try {
      const bookingPayload = {
        room: room._id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: parseInt(bookingData.numberOfGuests),
        totalPrice: calculateTotalPrice(),
        specialRequests: bookingData.specialRequests
      };

      await createBooking(bookingPayload);
      toast.success('Booking request submitted successfully!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!room) {
    return (
      <div className="room-not-found">
        <h2>Room not found</h2>
        <button onClick={() => navigate('/rooms')} className="back-btn">
          <FaArrowLeft /> Back to Rooms
        </button>
      </div>
    );
  }

  const nights = calculateNights();
  const totalPrice = calculateTotalPrice();

  return (
    <div className="room-details-page">
      {/* Header */}
      <div className="room-details-header">
        <button onClick={() => navigate('/rooms')} className="back-button">
          <FaArrowLeft /> Back to Rooms
        </button>
      </div>

      {/* Room Images */}
      <div className="room-images-section">
        {room.images && room.images.length > 0 ? (
          <div className="images-grid">
            <div className="main-image">
              <img src={room.images[0]} alt={room.roomType} />
              {room.featured && (
                <span className="featured-badge">
                  <FaStar /> Featured Room
                </span>
              )}
            </div>
            {room.images.length > 1 && (
              <div className="thumbnail-images">
                {room.images.slice(1, 4).map((image, index) => (
                  <img key={index} src={image} alt={`${room.roomType} ${index + 1}`} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="no-image-large">
            <FaBed />
            <p>No images available</p>
          </div>
        )}
      </div>

      {/* Room Content */}
      <div className="room-details-content">
        <div className="room-main-info">
          {/* Room Header */}
          <div className="room-title-section">
            <div>
              <h1>{room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)} Room</h1>
              <p className="room-number-badge">Room #{room.roomNumber}</p>
            </div>
            <div className="price-display">
              <span className="price-amount">${room.price}</span>
              <span className="price-period">/ night</span>
            </div>
          </div>

          {/* Availability Status */}
          <div className={`availability-status ${room.isAvailable ? 'available' : 'unavailable'}`}>
            {room.isAvailable ? '✓ Available for Booking' : '✗ Currently Unavailable'}
          </div>

          {/* Description */}
          <div className="description-section">
            <h2>About This Room</h2>
            <p>{room.description}</p>
          </div>

          {/* Room Features */}
          <div className="features-section">
            <h2>Room Features</h2>
            <div className="features-grid">
              <div className="feature-item">
                <FaBed className="feature-icon" />
                <div>
                  <h3>Room Type</h3>
                  <p>{room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}</p>
                </div>
              </div>
              <div className="feature-item">
                <FaUsers className="feature-icon" />
                <div>
                  <h3>Capacity</h3>
                  <p>{room.capacity} Guest{room.capacity > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="amenities-section">
            <h2>Amenities & Services</h2>
            <div className="amenities-grid">
              {room.amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <span className="amenity-icon">{getAmenityIcon(amenity)}</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="info-section">
            <h2>Important Information</h2>
            <div className="info-list">
              <div className="info-item">
                <strong>Check-in:</strong> After 2:00 PM
              </div>
              <div className="info-item">
                <strong>Check-out:</strong> Before 11:00 AM
              </div>
              <div className="info-item">
                <strong>Cancellation:</strong> Free cancellation up to 24 hours before check-in
              </div>
              <div className="info-item">
                <strong>Payment:</strong> Payment required at time of booking
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="booking-sidebar">
          <div className="booking-card">
            <h3>Reserve This Room</h3>
            <div className="price-summary">
              <span className="price">${room.price}</span>
              <span className="period">per night</span>
            </div>

            {!showBookingForm ? (
              <button 
                onClick={handleBookNow} 
                className="book-now-btn"
                disabled={!room.isAvailable}
              >
                <FaCalendarAlt /> {room.isAvailable ? 'Book Now' : 'Unavailable'}
              </button>
            ) : (
              <form onSubmit={handleSubmitBooking} className="booking-form">
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={bookingData.checkInDate}
                    onChange={handleBookingChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={bookingData.checkOutDate}
                    onChange={handleBookingChange}
                    min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Number of Guests</label>
                  <select
                    name="numberOfGuests"
                    value={bookingData.numberOfGuests}
                    onChange={handleBookingChange}
                    required
                  >
                    {[...Array(room.capacity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Guest{i + 1 > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Requests (Optional)</label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleBookingChange}
                    rows="3"
                    placeholder="Any special requests or requirements..."
                  />
                </div>

                {nights > 0 && (
                  <div className="price-breakdown">
                    <div className="breakdown-item">
                      <span>${room.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="breakdown-total">
                      <strong>Total</strong>
                      <strong>${totalPrice}</strong>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="confirm-booking-btn"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </button>
              </form>
            )}

            {!isAuthenticated && !showBookingForm && (
              <p className="login-notice">
                You need to <span onClick={() => navigate('/login')}>login</span> to make a reservation
              </p>
            )}
          </div>

          {/* Contact Support */}
          <div className="support-card">
            <h4>Need Help?</h4>
            <p>Contact our support team</p>
            <button onClick={() => navigate('/contact')} className="contact-btn">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;

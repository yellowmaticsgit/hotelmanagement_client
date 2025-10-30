import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getFeaturedRooms } from '../../services/roomService';
import { FaBed, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaConciergeBell } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedRooms();
  }, []);

  const loadFeaturedRooms = async () => {
    try {
      const response = await getFeaturedRooms();
      setFeaturedRooms(response.data);
    } catch (error) {
      toast.error('Failed to load featured rooms');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Luxury Hotel Management</h1>
          <p>Experience comfort and elegance in every stay</p>
          <Link to="/rooms" className="hero-btn">Explore Rooms</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Our Hotel Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaBed className="feature-icon" />
            <h3>Luxury Rooms</h3>
            <p>Comfortable and spacious rooms with modern amenities</p>
          </div>
          <div className="feature-card">
            <FaWifi className="feature-icon" />
            <h3>Free WiFi</h3>
            <p>High-speed internet access throughout the hotel</p>
          </div>
          <div className="feature-card">
            <FaParking className="feature-icon" />
            <h3>Free Parking</h3>
            <p>Complimentary parking for all our guests</p>
          </div>
          <div className="feature-card">
            <FaSwimmingPool className="feature-icon" />
            <h3>Swimming Pool</h3>
            <p>Relax in our beautiful outdoor pool</p>
          </div>
          <div className="feature-card">
            <FaDumbbell className="feature-icon" />
            <h3>Fitness Center</h3>
            <p>Stay fit with our state-of-the-art gym equipment</p>
          </div>
          <div className="feature-card">
            <FaConciergeBell className="feature-icon" />
            <h3>24/7 Service</h3>
            <p>Round-the-clock concierge and room service</p>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="featured-rooms-section">
        <h2>Featured Rooms</h2>
        {loading ? (
          <div className="loading">Loading rooms...</div>
        ) : (
          <div className="rooms-grid">
            {featuredRooms.map((room) => (
              <div key={room._id} className="room-card">
                <div className="room-image">
                  {room.images && room.images[0] ? (
                    <img src={room.images[0]} alt={room.roomType} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="room-info">
                  <h3>{room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)} Room</h3>
                  <p>{room.description}</p>
                  <div className="room-details">
                    <span className="room-price">${room.price}/night</span>
                    <span className="room-capacity">Capacity: {room.capacity}</span>
                  </div>
                  <Link to={`/rooms/${room._id}`} className="view-btn">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="view-all">
          <Link to="/rooms" className="view-all-btn">View All Rooms</Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Book Your Stay?</h2>
        <p>Experience luxury and comfort at affordable prices</p>
        <Link to="/rooms" className="cta-btn">Book Now</Link>
      </section>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getRooms } from '../../services/roomService';
import { FaBed, FaUsers, FaStar, FaWifi, FaTv, FaSnowflake } from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import './Rooms.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    roomType: '',
    minPrice: '',
    maxPrice: '',
    capacity: '',
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async (filterParams = {}) => {
    setLoading(true);
    try {
      const response = await getRooms(filterParams);
      setRooms(response.data);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const filterParams = {};
    if (filters.roomType) filterParams.roomType = filters.roomType;
    if (filters.minPrice) filterParams.minPrice = filters.minPrice;
    if (filters.maxPrice) filterParams.maxPrice = filters.maxPrice;
    if (filters.capacity) filterParams.capacity = filters.capacity;
    
    loadRooms(filterParams);
  };

  const resetFilters = () => {
    setFilters({
      roomType: '',
      minPrice: '',
      maxPrice: '',
      capacity: '',
    });
    loadRooms();
  };

  const getRoomTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <h1>Our Rooms</h1>
        <p>Find your perfect accommodation</p>
      </div>

      <div className="rooms-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <h3>Filter Rooms</h3>
          
          <div className="filter-group">
            <label>Room Type</label>
            <select name="roomType" value={filters.roomType} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
              <option value="deluxe">Deluxe</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Capacity</label>
            <select name="capacity" value={filters.capacity} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="1">1 Person</option>
              <option value="2">2 People</option>
              <option value="3">3 People</option>
              <option value="4">4+ People</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="$0"
            />
          </div>

          <div className="filter-group">
            <label>Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="$1000"
            />
          </div>

          <div className="filter-buttons">
            <button onClick={applyFilters} className="apply-btn">
              Apply Filters
            </button>
            <button onClick={resetFilters} className="reset-btn">
              Reset
            </button>
          </div>
        </aside>

        {/* Rooms Grid */}
        <div className="rooms-content">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="rooms-count">
                <p>Showing {rooms.length} room{rooms.length !== 1 ? 's' : ''}</p>
              </div>

              {rooms.length === 0 ? (
                <div className="no-rooms">
                  <p>No rooms found matching your criteria.</p>
                  <button onClick={resetFilters} className="reset-btn">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="rooms-grid">
                  {rooms.map((room) => (
                    <div key={room._id} className="room-card">
                      <div className="room-card-image">
                        {room.images && room.images[0] ? (
                          <img src={room.images[0]} alt={room.roomType} />
                        ) : (
                          <div className="no-image-placeholder">
                            <FaBed />
                          </div>
                        )}
                        {room.featured && (
                          <span className="featured-badge">
                            <FaStar /> Featured
                          </span>
                        )}
                        {!room.isAvailable && (
                          <span className="unavailable-badge">Not Available</span>
                        )}
                      </div>

                      <div className="room-card-content">
                        <div className="room-header">
                          <h3>{getRoomTypeLabel(room.roomType)} Room</h3>
                          <span className="room-number">#{room.roomNumber}</span>
                        </div>

                        <p className="room-description">{room.description}</p>

                        <div className="room-amenities">
                          {room.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className="amenity-tag">
                              {amenity === 'WiFi' && <FaWifi />}
                              {amenity === 'TV' && <FaTv />}
                              {amenity === 'Air Conditioning' && <FaSnowflake />}
                              {amenity}
                            </span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className="amenity-tag">+{room.amenities.length - 3} more</span>
                          )}
                        </div>

                        <div className="room-footer">
                          <div className="room-info">
                            <span className="capacity">
                              <FaUsers /> {room.capacity} Guest{room.capacity > 1 ? 's' : ''}
                            </span>
                            <span className="price">${room.price}<sub>/night</sub></span>
                          </div>
                          
                          <Link 
                            to={`/rooms/${room._id}`} 
                            className="view-details-btn"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;

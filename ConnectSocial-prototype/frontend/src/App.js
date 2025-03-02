import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MapView from './components/MapView';
import UserList from './components/UserList';
import Notification from './components/Notification';
import apiService from './services/api';
import socketService from './services/socket';
import './App.css';

function App() {
  const [userId] = useState(() => localStorage.getItem('userId') || uuidv4());
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const previousNearbyUsers = useRef(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    // Store userId in localStorage
    localStorage.setItem('userId', userId);

    // Connect to Socket.IO
    socketService.connect(userId);

    // Subscribe to nearby users updates
    const unsubscribe = socketService.onNearbyUsers((users) => {
      // Get current nearby user IDs
      const currentNearbyUserIds = new Set(users.map(user => user.id));
      
      // Find users who are no longer nearby
      const removedUsers = Array.from(previousNearbyUsers.current)
        .filter(id => !currentNearbyUserIds.has(id));
      
      // Emit event for removed users
      removedUsers.forEach(userId => {
        socketService.emit('userLeft', userId);
      });
      
      // Update the previous nearby users set
      previousNearbyUsers.current = currentNearbyUserIds;
      
      setNearbyUsers(users);
    });

    return () => {
      socketService.disconnect();
      unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    // Function to update location
    const updateLocation = async () => {
      try {
        const position = await apiService.getCurrentPosition();
        setUserLocation(position);
        
        // Send location to server
        await apiService.updateLocation(
          userId,
          position.latitude,
          position.longitude,
          `User ${userId.slice(0, 4)}`
        );
      } catch (err) {
        setError('Error getting location. Please enable location services.');
        console.error('Location error:', err);
      }
    };

    // Update location immediately and then every 30 seconds
    updateLocation();
    const intervalId = setInterval(updateLocation, 30000);

    return () => clearInterval(intervalId);
  }, [userId]);

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <MapView userLocation={userLocation} nearbyUsers={nearbyUsers} />
      <UserList users={nearbyUsers} />
      <Notification />
    </div>
  );
}

export default App;

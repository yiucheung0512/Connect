import React, { useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socketService from '../services/socket.js';

const Notification = ({ notifications = [] }) => {
  // Use useRef to persist the notified users set across renders
  const notifiedUsersRef = useRef(new Set());

  useEffect(() => {
    // Handle notifications for nearby users
    const unsubscribeNearby = socketService.onUserNearby((data) => {
      const { user } = data;
      
      // Check if we've already notified about this user
      if (!notifiedUsersRef.current.has(user.id)) {
        // Add user to the set of notified users
        notifiedUsersRef.current.add(user.id);
        
        toast.info(
          `${user.username} is nearby! (${user.distance.toFixed(2)}km away)`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    });

    // Handle users who are no longer nearby
    const unsubscribeLeft = socketService.onUserLeft((userId) => {
      // Remove user from notified set when they leave the area
      notifiedUsersRef.current.delete(userId);
    });

    return () => {
      unsubscribeNearby();
      unsubscribeLeft();
      // Clear the set when component unmounts
      notifiedUsersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    // Handle notifications for nearby users with shared interests
    if (notifications && notifications.length > 0) {
      notifications.forEach(notification => {
        if (notification?.userId) {
          alert(`User with shared interests nearby: ${notification.userId}`);
        }
      });
    }
  }, [notifications]);

  return ( 
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default Notification;

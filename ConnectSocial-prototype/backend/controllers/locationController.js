const User = require('../models/User');

class LocationController {
  updateLocation(req, res) {
    try {
      const { userId, latitude, longitude, username } = req.body;

      if (!userId || !latitude || !longitude) {
        return res.status(400).json({
          error: 'Missing required fields: userId, latitude, longitude'
        });
      }

      // Validate coordinates
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({
          error: 'Invalid coordinates'
        });
      }

      // Update user location
      const user = User.addOrUpdateUser(userId, {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        username: username || `User ${userId}`
      });

      // Find nearby users
      const nearbyUsers = User.findNearbyUsers(userId);

      // Emit nearby users event through Socket.IO (will be implemented in app.js)
      if (nearbyUsers.length > 0 && req.io) {
        req.io.to(userId).emit('nearbyUsers', nearbyUsers);
        
        // Notify nearby users
        nearbyUsers.forEach(nearbyUser => {
          req.io.to(nearbyUser.id).emit('userNearby', {
            user: {
              id: user.id,
              username: user.username,
              distance: nearbyUser.distance
            }
          });
        });
      }

      res.json({
        success: true,
        user,
        nearbyUsers
      });
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  getNearbyUsers(req, res) {
    try {
      const { userId } = req.params;
      const radius = parseFloat(req.query.radius) || 1; // Default 1km radius

      if (!userId) {
        return res.status(400).json({
          error: 'Missing userId parameter'
        });
      }

      const nearbyUsers = User.findNearbyUsers(userId, radius);

      res.json({
        success: true,
        users: nearbyUsers
      });
    } catch (error) {
      console.error('Error getting nearby users:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}

module.exports = new LocationController();

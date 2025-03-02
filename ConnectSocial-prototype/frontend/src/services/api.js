const API_BASE_URL = 'https://connectsocial.onrender.com/api';

class ApiService {
  async updateLocation(userId, latitude, longitude, username) {
    try {
      const response = await fetch(`${API_BASE_URL}/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          latitude,
          longitude,
          username
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  async getUserInterests(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/interests/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user interests');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user interests:', error);
      throw error;
    }
  }

  async getNearbyUsers(userId, radius) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/nearby/${userId}?radius=${radius || 1}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nearby users');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching nearby users:', error);
      throw error;
    }
  }

  async updateUserPreferences(userId, preferences) {
    try {
      const response = await fetch(`${API_BASE_URL}/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          preferences
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Helper method to get current position using Geolocation API
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }
}

// Create a singleton instance
const apiService = new ApiService();
export default apiService;

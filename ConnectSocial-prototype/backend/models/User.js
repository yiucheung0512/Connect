class User {
  constructor() {
    this.users = new Map();
  }

  addOrUpdateUser(userId, data) {
    this.users.set(userId, {
      id: userId,
      latitude: data.latitude,
      longitude: data.longitude,
      lastUpdated: new Date(),
      ...data
    });
    return this.users.get(userId);
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  removeUser(userId) {
    this.users.delete(userId);
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  // Convert degrees to radians
  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Find nearby users within specified radius (in kilometers)
  findNearbyUsers(userId, radius = 1) {
    const user = this.getUser(userId);
    if (!user) return [];

    return this.getAllUsers()
      .filter(otherUser => {
        if (otherUser.id === userId) return false;
        
        const distance = this.calculateDistance(
          user.latitude,
          user.longitude,
          otherUser.latitude,
          otherUser.longitude
        );
        
        otherUser.distance = distance; // Add distance to user object
        return distance <= radius;
      })
      .sort((a, b) => a.distance - b.distance);
  }
}

module.exports = new User();

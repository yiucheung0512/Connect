import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {
      nearbyUsers: new Set(),
      userNearby: new Set(),
      userLeft: new Set()
    };
  }

  connect(userId) {
    // Connect to the backend server
    this.socket = io('https://connectsocial.onrender.com');

    // Register user with their ID
    this.socket.on('connect', () => {
      this.socket.emit('register', userId);
    });

    // Set up event listeners
    this.socket.on('nearbyUsers', (users) => {
      this.callbacks.nearbyUsers.forEach(callback => callback(users));
      // Emit a notification for each user with shared interests
      users.forEach(user => {
        this.emit('notifyUser', { userId: user.id, interests: user.interests });
      });
    });

    this.socket.on('userNearby', (data) => {
      // Emit a notification for users with shared interests
      const { userId, interests } = data;
      this.emit('notifyUser', { userId, interests });
      this.callbacks.userNearby.forEach(callback => callback(data));
    });

    // Listen for userLeft events
    this.socket.on('userLeft', (userId) => {
      this.callbacks.userLeft.forEach(callback => callback(userId));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  onUserLeft(callback) {
    this.callbacks.userLeft.add(callback);
    return () => this.callbacks.userLeft.delete(callback);
  }

  onNearbyUsers(callback) {
    this.callbacks.nearbyUsers.add(callback);
    return () => this.callbacks.nearbyUsers.delete(callback);
  }

  onUserNearby(callback) {
    this.callbacks.userNearby.add(callback);
    return () => this.callbacks.userNearby.delete(callback);
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;

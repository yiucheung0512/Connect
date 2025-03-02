const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const locationController = require('./controllers/locationController');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO middleware to make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Associate socket with userId for private messages
  socket.on('register', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} registered`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.post('/api/location', locationController.updateLocation);
app.get('/api/nearby/:userId', locationController.getNearbyUsers);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something broke!'
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

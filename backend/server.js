require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const protect = require('./middleware/authMiddleware');
const hazardRoutes = require('./routes/hazardRoutes');
const responderRoutes = require('./routes/responderRoutes');
const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use('/api/auth',authRoutes);
app.use('/api/hazards', hazardRoutes);
app.use('/api/responders', responderRoutes);

// Test route
app.get('/', (req, res) => {
res.status(200).json({
message: 'SHOCK SHIELD API is running successfully!',
team: 'NEXVOLT'
});
});

app.get('/api/auth/profile', protect, (req, res) => {
    res.status(200).json({
        message: 'Authenticated successfully!',
        user: req.user
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log("SHOCK SHIELD server running on port" + PORT);
});
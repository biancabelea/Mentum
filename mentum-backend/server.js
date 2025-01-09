const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Routes
app.use('/', authRoutes);

// MongoDB Connection and Server Start
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
    .catch(err => console.error('MongoDB connection error:', err));

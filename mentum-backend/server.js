const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const mentorRoutes = require('./routes/mentors');
const profileRoutes = require('./routes/profile');
const userProfileRoutes = require('./routes/userProfile');


dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', authRoutes);
app.use('/', resourceRoutes);
app.use('/mentors', mentorRoutes);
app.use('/profile', profileRoutes);
app.use('/user-profile', userProfileRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
    .catch(err => console.error('MongoDB connection error:', err));

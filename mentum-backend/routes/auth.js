const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        console.log('Incoming request body:', req.body);
        const { name, email, password, userYear, userRole, userSkills } = req.body;

        if (!name || !email || !password || !userRole) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (userRole === 'Mentor' && (!userSkills || userSkills.length === 0)) {
            return res.status(400).json({ message: 'Mentors must select at least one skill' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            userYear,
            userRole,
            userSkills,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

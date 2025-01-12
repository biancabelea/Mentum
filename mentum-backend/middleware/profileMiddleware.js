const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure the correct path to your User model

const profileMiddleware = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing.' });
        }

        const token = authHeader.split(' ')[1]; // Extract the token part
        if (!token) {
            return res.status(401).json({ message: 'Token is missing from Authorization header.' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug: Log the decoded token

        // Fetch the user from the database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        console.log('User found:', user); // Debug: Log the user details

        // Attach the user to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error in profileMiddleware:', error); // Log the error for debugging

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }

        return res.status(401).json({ message: 'Invalid token. Unauthorized.' });
    }
};

module.exports = profileMiddleware;

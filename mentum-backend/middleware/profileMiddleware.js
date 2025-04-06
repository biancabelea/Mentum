const jwt = require('jsonwebtoken');
const User = require('../models/User');

const profileMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing.' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing from Authorization header.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in profileMiddleware:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }

        return res.status(401).json({ message: 'Invalid token. Unauthorized.' });
    }
};

module.exports = profileMiddleware;

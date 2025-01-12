const validateSkillsMiddleware = (req, res, next) => {
    const { skills } = req.body;

    // Ensure skills is provided and is a non-empty array
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({ message: 'Invalid or missing skills array.' });
    }

    // Pass validation
    next();
};

module.exports = validateSkillsMiddleware;

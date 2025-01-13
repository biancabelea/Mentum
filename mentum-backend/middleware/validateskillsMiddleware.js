const validateSkillsMiddleware = (req, res, next) => {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({ message: 'Invalid or missing skills array.' });
    }

    next();
};

module.exports = validateSkillsMiddleware;

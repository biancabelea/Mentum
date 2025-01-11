const validateSkills = (req, res, next) => {
    const { skills } = req.body;
  
    // Ensure skills is an array and has at least one skill
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one skill.' });
    }
  
    // Optionally, validate if all skills are part of the predefined list
    const validSkills = [
      'React', 'NodeJS', '.NET', 'Java', 'Python', 'C++', 'JavaScript', 'Ruby', 'Swift', 'HTML',
      'CSS', 'Angular', 'Vue', 'Django', 'REST API', 'Kotlin', 'Git', 'Agile', 'SQL', 'NoSQL',
      'Docker', 'Data structures', 'Cybersecurity', 'Networking', 'Unit testing', 'Physics',
      'Computer programming', 'OOP', 'Mechanics', 'Statistics', 'Digital logic',
    ];
  
    const invalidSkills = skills.filter(skill => !validSkills.includes(skill));
  
    if (invalidSkills.length > 0) {
      return res.status(400).json({ message: `Invalid skills: ${invalidSkills.join(', ')}` });
    }
  
    // If everything is valid, continue with the next middleware or route handler
    next();
  };
  
  module.exports = validateSkills;
  
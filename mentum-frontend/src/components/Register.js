import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/rest/authService';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import '../styles/Register.css';

const skills = [
  'React', 'NodeJS', '.NET', 'Java', 'Python', 'C++', 'JavaScript', 'Ruby', 'Swift', 'HTML',
  'CSS', 'Angular', 'Vue', 'Django', 'REST API', 'Kotlin', 'Git', 'Agile', 'SQL', 'NoSQL',
  'Docker', 'Data structures', 'Cybersecurity', 'Networking', 'Unit testing', 'Physics',
  'Computer programming', 'OOP', 'Mechanics', 'Statistics', 'Digital logic',
];

function Register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    userYear: '',
    userRole: '',
    userSkills: [],
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e, skills) => {
    setUser((prev) => ({ ...prev, userSkills: skills }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(user);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
      console.error('Registration failed:', error);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleGoBackClick = () => {
    navigate('/');
  };

  return (
    <div className="body-register">
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="title">Create an account</div>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="yearOfStudy">Year of Study:</label>
          <select
            id="year"
            name="userYear"
            value={user.userYear}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a year</option>
            <option value="1st Bachelor">1st Bachelor</option>
            <option value="2nd Bachelor">2nd Bachelor</option>
            <option value="3rd Bachelor">3rd Bachelor</option>
            <option value="4th Bachelor">4th Bachelor</option>
            <option value="1st Masters">1st Masters</option>
            <option value="2nd Masters">2nd Masters</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="userRole"
            value={user.userRole}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a role</option>
            <option value="Student">Student</option>
            <option value="Mentor">Mentor</option>
          </select>
        </div>

        {user.userRole === 'Mentor' && (
          <>
            <label>Skills:</label>
            <Autocomplete
              multiple
              id="skills-autocomplete"
              value={user.userSkills}
              onChange={handleSkillsChange}
              options={skills.sort()}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip key={index} label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => <TextField {...params} label="Select Skills" />}
            />
          </>
        )}

        <button type="submit">Register</button>

        <div className="prompt">
          Already have an account?{' '}
          <a className="redirect" onClick={handleLoginClick}>Login</a>
        </div>

        <button type="button" onClick={handleGoBackClick}>Back</button>
      </form>
    </div>
  );
}

export default Register;

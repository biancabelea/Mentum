import React, { useState } from 'react';
import '../styles/Register.css';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };
  

    const handleSkillsChange = (event, newSkills) => {
        setUser(prevUser => ({ ...prevUser, userSkills: newSkills }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const payload = { ...user };
      if (user.userRole === 'Mentor') {
          payload.userSkills = user.userSkills || [];
      }
  
      console.log('Submitting user data:', payload);
  
      try {
          const response = await axios.post('http://localhost:5000/register', payload, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          console.log('Registration successful:', response.data);
          navigate('/login');
      } catch (error) {
          setError(error.response?.data?.message || 'Something went wrong');
          console.error('Registration failed:', error.response || error);
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

                <div>
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
                </div>

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

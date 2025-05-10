import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import '../styles/SearchMentor.css';
import { useMentorSearch } from '../api/rest/useMentorSearch';

const skills = [
  'React', 'NodeJS', '.NET', 'Java', 'Python', 'C++', 'JavaScript', 'Ruby', 'Swift',
  'HTML', 'CSS', 'Angular', 'Vue', 'Django', 'REST API', 'Kotlin', 'Git', 'Agile',
  'SQL', 'NoSQL', 'Docker', 'Data structures', 'Cybersecurity', 'Networking',
  'Unit testing', 'Physics', 'Computer programming', 'OOP', 'Mechanics',
  'Statistics', 'Digital logic',
];

const SearchMentor = () => {
  const [userSkills, setUserSkills] = useState([]);
  const navigate = useNavigate();
  const { results: matchingMentors, loading, searched, searchMentors } = useMentorSearch();

  const handleSkillsChange = (event, newValue) => {
    setUserSkills(newValue);
  };

  const handleSearch = () => {
    searchMentors(userSkills);
  };

  const handleContactMentor = (mentor) => {
    navigate('/contact-mentor', {
      state: {
        mentorName: mentor.name,
        mentorEmail: mentor.email,
        skills: mentor.matchingSkills,
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar">
        <nav>
          <button onClick={handleLogout} className="nav-button">
            Logout
          </button>
        </nav>
      </nav>
      <div className="searchContent">
        <h1>Search for Mentors</h1>
        <div className="input-container">
          <Autocomplete
            multiple
            id="skills-autocomplete"
            value={userSkills}
            onChange={handleSkillsChange}
            options={skills.sort()}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip key={option} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Select Skills" />}
          />
          <button onClick={handleSearch} disabled={loading} className="search-button">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <div className="results">
          {searched && (
            matchingMentors.length > 0 && matchingMentors[0].name !== '' ? (
              matchingMentors.map((mentor, index) => (
                <div key={index} className="mentor-card">
                  <h3>
                    <a className="mentor-link" href={`/user-profile/${mentor._id}`}>
                      {mentor.name}
                    </a>
                  </h3>
                  <p>Matched Skills: {mentor.matchingSkills.join(', ')}</p>
                  <p>Match Percentage: {mentor.matchPercentage}%</p>
                  <a
                    className="contact-mentor"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleContactMentor(mentor);
                    }}
                  >
                    Contact Mentor
                  </a>
                </div>
              ))
            ) : (
              <div>
                <h4>No mentors match the selected skills.</h4>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchMentor;

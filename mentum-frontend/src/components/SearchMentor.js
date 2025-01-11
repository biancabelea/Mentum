import React, { useState } from 'react';
import axios from 'axios';  // Axios for making API requests
import { Autocomplete, TextField, Chip } from '@mui/material'; // Autocomplete component and Material UI components
import '../styles/SearchMentor.css';

// Define the predefined skills array
const skills = [
  'React', 'NodeJS', '.NET', 'Java', 'Python', 'C++', 'JavaScript', 'Ruby', 'Swift', 'HTML',
  'CSS', 'Angular', 'Vue', 'Django', 'REST API', 'Kotlin', 'Git', 'Agile', 'SQL', 'NoSQL',
  'Docker', 'Data structures', 'Cybersecurity', 'Networking', 'Unit testing', 'Physics',
  'Computer programming', 'OOP', 'Mechanics', 'Statistics', 'Digital logic',
];

function MentorSearchPage() {
  const [userSkills, setUserSkills] = useState([]); // To store the selected skills
  const [matchingMentors, setMatchingMentors] = useState([]); // To store the list of matching mentors
  const [loading, setLoading] = useState(false); // To track if the request is in progress

  // Handle skill change in the Autocomplete input
  const handleSkillsChange = (event, newValue) => {
    setUserSkills(newValue);
  };

  // Handle search request and mentor matching
  const handleSearch = async () => {
    if (userSkills.length < 1) {
      alert('Please select at least one skill to search.');
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      // Sending the skills array to the backend API
      const response = await axios.post('http://localhost:5000/mentors', { skills: userSkills });

      // Set the response data (matching mentors)
      setMatchingMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false); // Hide loading indicator after the request is done
    }
  };

  return (
    <div>
      <h1>Search for Mentors</h1>
      {/* Autocomplete input for skills selection */}
      <Autocomplete
        multiple
        id="skills-autocomplete"
        value={userSkills}
        onChange={handleSkillsChange}
        options={skills.sort()}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const tagProps = getTagProps({ index });
            return <Chip key={option} label={option} {...tagProps} />;
          })
        }
        renderInput={(params) => <TextField {...params} label="Select Skills" />}
      />

      {/* Search button */}
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search for Mentors'}
      </button>

      {/* Show mentor cards if results are available */}
      {matchingMentors.length > 0 && (
        <div className="mentor-cards">
          {matchingMentors.map((mentor, index) => (
            <div key={index} className="mentor-card">
              <h3>{mentor.name}</h3>
              <p>Matched Skills: {mentor.skills.join(', ')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Show message if no mentors match */}
      {matchingMentors.length === 0 && !loading && (
        <p>No mentors match the selected skills.</p>
      )}
    </div>
  );
}

export default MentorSearchPage;
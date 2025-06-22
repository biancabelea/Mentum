import { useState } from 'react';
import axios from 'axios';

export function useMentorSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const searchMentors = async (skills) => {
    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.post('http://localhost:5000/mentors/search', { skills });
      setResults(response.data);
      setError(null);
    } catch (err) {
      setResults([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, searched, error, searchMentors };
}

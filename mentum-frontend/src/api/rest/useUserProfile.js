import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Hook to fetch user profile data.
 * If id is provided, it fetches another user's profile (public view).
 * Otherwise, it fetches the currently logged-in user's profile.
 */
export function useUserProfile(id) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const endpoint = id
          ? `http://localhost:5000/user-profile/${id}`
          : `http://localhost:5000/profile`;

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(endpoint, { headers });

        setUserData(response.data);
      } catch (err) {
        setError(err);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  return { userData, loading, error };
}

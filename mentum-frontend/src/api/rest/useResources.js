import { useState, useEffect } from 'react';
import axios from 'axios';

export function useResources({ my = false, search = '' } = {}) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const endpoint = my
          ? 'http://localhost:5000/resources/my'
          : 'http://localhost:5000/resources';

        const config = {
          headers: {},
          params: {},
        };

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (!my && search) {
          config.params.search = search;
        }

        const res = await axios.get(endpoint, config);
        setResources(res.data.resources || []);
      } catch (err) {
        setError(err);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [my, search]);

  return { resources, loading, error };
}
import axios from 'axios';

/**
 * Logs in a user with email and password.
 */
export async function login(credentials) {
  const response = await axios.post('http://localhost:5000/auth/login', credentials, {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = response.data.token;
  localStorage.setItem('token', token);
  localStorage.setItem('userEmail', response.data.user.email);

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log('Auth header set:', axios.defaults.headers.common['Authorization']);

  return response.data;
}

/**
 * Registers a new user with optional skills (if Mentor).
 */
export async function register(user) {
  const payload = { ...user };

  if (user.userRole === 'Mentor') {
    payload.userSkills = user.userSkills || [];
  }

  const response = await axios.post('http://localhost:5000/register', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.reload();
  }
  
  export function isLoggedIn() {
    return !!localStorage.getItem('token');
  }
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/rest/authService';
import '../styles/Register.css';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="body-register">
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="title">Login</div>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
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
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>

        <div className="prompt">
          Don't have an account?{' '}
          <a className="redirect" onClick={handleRegisterClick}>
            Register
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;

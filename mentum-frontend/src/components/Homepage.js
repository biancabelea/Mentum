import React from 'react';
import { logout, isLoggedIn } from '../api/rest/authService';
import '../styles/Homepage.css';

function Homepage() {
  return (
    <div className="homepage">
      <nav className="navbar">
        {isLoggedIn() ? (
          <nav>
            <button onClick={logout} className="nav-button">
              Logout
            </button>
          </nav>
        ) : (
          <nav>
            <a href="/register" className="nav-button">
              Register
            </a>
            <a href="/login" className="nav-button">
              Login
            </a>
          </nav>
        )}
      </nav>
      <div className="homeContent">
        <p>Mentum: Connect, Learn, Thrive. Quality tutoring at your fingertips!</p>
        <div className="buttons">
          {isLoggedIn() && (
            <nav>
              <a href="/profile" className="profile-button">
                <button>My Profile</button>
              </a>
              <a href="/mentors-search" className="mentors-button">
                <button>Search for Mentors</button>
              </a>
              <a href="/resources" className="resources-button">
                <button>All Resources</button>
              </a>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;

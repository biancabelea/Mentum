import React from 'react';
import '../styles/Homepage.css';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const loggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <div className="homepage">
            <nav className="navbar">
                {loggedIn ? (
                    <nav>
                        <button onClick={handleLogout} className="nav-button">
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
                    {loggedIn ? (
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
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default Homepage;

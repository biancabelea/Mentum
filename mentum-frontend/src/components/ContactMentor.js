import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/ContactMentor.css';
import { contactMentor } from '../api/rest/contactMentor';

const ContactMentor = () => {
  const [formData, setFormData] = useState({
    message: '',
  });
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const userEmail = localStorage.getItem('userEmail');

  const location = useLocation();
  const { mentorName, mentorEmail, skills } = location.state || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const result = await contactMentor({
        userEmail,
        mentorName,
        mentorEmail,
        message: formData.message,
        skills,
      });

      setStatus({ success: true, message: 'Message sent successfully!' });
      setFormData({ message: '' });
      console.log('Email sent successfully:', result.text);
    } catch (error) {
      setStatus({ success: false, message: 'Failed to send the message. Please try again.' });
      console.error('EmailJS Error:', error);
    } finally {
      setIsSending(false);
    }
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
      <div className="contact-content">
        <h1>Contact {mentorName}</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            name="message"
            placeholder="Write your message here..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {status && <p>{status.message}</p>}
      </div>
    </div>
  );
};

export default ContactMentor;

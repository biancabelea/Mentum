import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import emailjs from "emailjs-com";
import '../styles/ContactMentor.css';

const ContactMentor = () => {
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState("");
    const [isSending, setIsSending] = useState(false);
    const userEmail = localStorage.getItem("userEmail");

    const location = useLocation();
    const { mentorName, mentorEmail, skills } = location.state || {};
    const skillsString = Array.isArray(skills) ? skills.join(', ') : '';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSending(true);

        const templateParams = {
            user_email: userEmail,
            mentor_name: mentorName,
            mentor_email: mentorEmail,
            message: formData.message,
            skills: skillsString,
        }

        try{
            const result = emailjs.send(
                'service_jtb5i97',
                'template_v3mo5wj',
                templateParams,
                'n57BsnxNIWol_iHXz'
            );
            setStatus({ success: true, message: "Message sent successfully!" });
            setFormData({ subject: "", message: "" });
            console.log("Email sent successfully:", result.text);
        } catch (error) {
            setStatus({ success: false, message: "Failed to send the message. Please try again." });
            console.error("EmailJS Error:", error);
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
                        {isSending ? "Sending..." : "Send Message"}</button>
                </form>
                {status && <p>{status.message}</p>}
            </div>
        </div>
    );
};

export default ContactMentor;

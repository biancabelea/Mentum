import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import emailjs from "emailjs-com";

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
            <h3>Contact {mentorName}</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    name="message"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                ></textarea>
                <button type="submit">Send Message</button>
            </form>
            {status && <p>{status.message}</p>}
        </div>
    );
};

export default ContactMentor;

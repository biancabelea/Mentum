import emailjs from 'emailjs-com';

/**
 * Sends an email to a mentor using EmailJS.
 */
export async function contactMentor({ userEmail, mentorName, mentorEmail, message, skills }) {
  const templateParams = {
    user_email: userEmail,
    mentor_name: mentorName,
    mentor_email: mentorEmail,
    message,
    skills: Array.isArray(skills) ? skills.join(', ') : '',
  };

  return emailjs.send(
    'service_jtb5i97',
    'template_v3mo5wj',
    templateParams,
    'n57BsnxNIWol_iHXz'
  );
}

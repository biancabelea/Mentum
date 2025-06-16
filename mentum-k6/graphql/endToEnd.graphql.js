import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
   stages: [
    { duration: '15s', target: 400}, 
    { duration: '15s', target: 700 },  
    { duration: '15s', target: 1000 },
    { duration: '15s', target: 0 },    
  ], 
};

const BASE_URL = 'http://localhost:5000/graphql';
const studentEmail = 'bia@email.com';
const studentPassword = 'bia';
const skills = ['Agile', 'CSS', 'Git', 'JavaScript'];

export default function () {
  // Step 1: Login
  const loginRes = http.post(BASE_URL, JSON.stringify({
    query: `
      mutation {
        login(email: "${studentEmail}", password: "${studentPassword}") {
          token
        }
      }
    `
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

  const token = loginRes.json().data?.login?.token;
  check(token, { 'login successful': () => token !== undefined });

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // Step 2: Search Mentors
  const searchRes = http.post(BASE_URL, JSON.stringify({
    query: `
      query {
        searchMentors(skills: ${JSON.stringify(skills)}) {
          _id
        }
      }
    `
  }), authHeaders);

  const mentors = searchRes.json().data?.searchMentors || [];
  check(mentors.length, { 'mentor found': len => len > 0 });

  // Step 3: Get Availability
  let foundSlot = null;
  for (const mentor of mentors) {
    const availRes = http.post(BASE_URL, JSON.stringify({
      query: `
        query {
          mentorAvailability(mentorId: "${mentor._id}") {
            _id
            isBooked
          }
        }
      `
    }), authHeaders);

    const slots = availRes.json().data?.mentorAvailability || [];
    const free = slots.find(s => s.isBooked === false);

    if (free) {
      foundSlot = free;
      break;
    }
  }

  check(foundSlot, { 'free slot found': () => foundSlot !== null });

  // Step 4: Book the Slot
  if (foundSlot) {
    const bookRes = http.post(BASE_URL, JSON.stringify({
      query: `
        mutation {
          bookSlot(input: { slotId: "${foundSlot._id}" }) {
            _id
          }
        }
      `
    }), authHeaders);

    check(bookRes, {
      'slot booked': res => res.status === 200 && res.json().data?.bookSlot?._id !== undefined,
    });
  }

  sleep(1);
}

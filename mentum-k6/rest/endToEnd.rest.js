import http from 'k6/http';
import { check, sleep, fail } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 400}, 
    { duration: '15s', target: 700 },  
    { duration: '15s', target: 1000 },
    { duration: '15s', target: 0 },    
  ], 
};

const BASE_URL = 'http://localhost:5000';
const email = 'bia@email.com';
const password = 'bia';
const skills = ['Agile', 'CSS', 'Git', 'JavaScript'];

export default function () {
  // Step 1: Login
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({ email, password }), {
    headers: { 'Content-Type': 'application/json' },
  });
  const token = loginRes.json('token');

  check(loginRes, {
    'login status is 200': r => r.status === 200,
    'token exists': r => token !== undefined && token !== '',
  }) || fail('Login failed');

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // Step 2: Search Mentors
  const searchRes = http.post(`${BASE_URL}/mentors/search`, JSON.stringify({ skills }), authHeaders);
  const mentors = searchRes.json() || [];

  check(searchRes, {
    'mentor search status is 200': r => r.status === 200,
    'mentors found': () => mentors.length > 0,
  }) || fail('No mentors found');

  // Step 3: Check availability
  let foundSlot = null;
  for (const mentor of mentors) {
    const availRes = http.get(`${BASE_URL}/availability/mentor/${mentor._id}`, authHeaders);
    const slots = availRes.json() || [];

    check(availRes, {
      'availability status is 200': r => r.status === 200,
    });

    const freeSlot = slots.find(s => !s.isBooked);
    if (freeSlot) {
      foundSlot = freeSlot;
      break;
    }
  }

  check(foundSlot, { 'free slot found': s => s !== null }) || fail('No free slot found');

  // Step 4: Book slot
  const bookRes = http.post(`${BASE_URL}/bookings`, JSON.stringify({ slotId: foundSlot._id }), authHeaders);

  if (!check(bookRes, {
    'slot booked': res => (res.status === 200 || res.status === 201) && res.json('slot._id') === foundSlot._id,
  })) {
    fail('Slot booking failed');
  }

  sleep(1);
}

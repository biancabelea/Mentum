import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 200}, 
    { duration: '15s', target: 400 },  
    { duration: '15s', target: 600 },
    { duration: '15s', target: 0 },    
  ], 
};

const BASE_URL = 'http://localhost:5000';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTYxY2QwNTYwMWYwYzJkYzE5MjJiYiIsImlhdCI6MTc0OTY3NTUxMywiZXhwIjoxNzQ5Njc5MTEzfQ.fsqaMhoGbaVms9N1uMS__JZjOWrxNA_KOiYF-PVvSu8';
const SLOT_ID = '6849f9ab8da10152d2588f96';

export default function () {
  const payload = JSON.stringify({ slotId: SLOT_ID });

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  const res = http.post(`${BASE_URL}/bookings`, payload, headers);

  check(res, {
    'is status 201': (r) => r.status === 201,
    'has slot info': (r) => r.body && r.body.includes('slot'),
  });

  sleep(1);
}

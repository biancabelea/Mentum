// mentum-k6/addAvailabilitySlot.rest.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  iterations: 2000,
};

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODQxMGU0ODI2MTY2NWE4YzcyMDMzZCIsImlhdCI6MTc0OTY4MzU2MCwiZXhwIjoxNzQ5Njg3MTYwfQ.e0LIuvd25a0QFklRgx__MlTk8xoRV0MDvi96DIE2uzw';
const BASE_URL = 'http://localhost:5000/availability';

function getRandomSlotTime() {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 30));
  date.setHours(9 + Math.floor(Math.random() * 17));
  date.setMinutes(0);
  date.setSeconds(0);
  return date.toISOString();
}

export default function () {
  const payload = {
    date: getRandomSlotTime(),
    duration: 60,
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  };

  const res = http.post(BASE_URL, JSON.stringify(payload), { headers });

  console.log(`[RES ${res.status}] ${res.body}`);
  console.log(`[SLOT] ${JSON.stringify(payload)}`);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'body has mentor': (r) => r.body && r.body.includes('mentor'),
  });

  sleep(0.1);
}

import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://localhost:5000';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTYxY2QwNTYwMWYwYzJkYzE5MjJiYiIsImlhdCI6MTc0OTY2Nzc4MCwiZXhwIjoxNzQ5NjcxMzgwfQ.VPRGOD9cK1oO0hjXpAA5deLTC90gJ-XpqsOaHTLmYBU';
const mentorId = '678410e48261665a8c72033d';

export const options = {
  stages: [
    { duration: '15s', target: 200}, 
    { duration: '15s', target: 400 },  
    { duration: '15s', target: 600 },
    { duration: '15s', target: 0 },    
  ], 
};

export default function () {
  const res = http.get(`${BASE_URL}/availability/mentor/${mentorId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'is JSON': (r) => r.headers['Content-Type'].includes('application/json'),
    'contains slots': (r) => JSON.parse(r.body).length > 0,
  });
}

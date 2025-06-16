import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://localhost:5000/graphql';
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
  const query = `
    query GetAvailability($mentorId: ID!) {
      mentorAvailability(mentorId: $mentorId) {
        _id
        date
        duration
        isBooked
        createdAt
        updatedAt
      }
    }
  `;

  const payload = JSON.stringify({
    query,
    variables: { mentorId },
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const res = http.post(BASE_URL, payload, { headers });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'is JSON': (r) => r.headers['Content-Type'].includes('application/json'),
    'contains availability slots': (r) => {
      try {
        const data = JSON.parse(r.body).data.mentorAvailability;
        return Array.isArray(data) && data.length > 0;
      } catch {
        return false;
      }
    },
  });
}

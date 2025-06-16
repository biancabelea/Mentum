import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 200}, 
    { duration: '15s', target: 400 },  
    { duration: '15s', target: 600 },
    { duration: '15s', target: 0 },    
  ], 
};

const BASE_URL = 'http://localhost:5000/graphql';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTYxY2QwNTYwMWYwYzJkYzE5MjJiYiIsImlhdCI6MTc0OTU5OTgwNCwiZXhwIjoxNzQ5NjAzNDA0fQ.tvy7-3aaBs8qswEsBHlLgHUv9CpOibE_WclNcPNa_qw';

export default function () {
  const query = `
    query {
      searchMentors(skills: ["React", "NodeJS"]) {
        _id
        name
        email
        userSkills
        matchingSkills
        matchPercentage
      }
    }
  `;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  };

  const res = http.post(BASE_URL, JSON.stringify({ query }), { headers });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'returned mentors': (r) => r.json('data.searchMentors').length >= 0,
  });
}

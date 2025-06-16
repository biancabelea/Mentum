// mentum-k6/addComment.rest.js

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

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTYxY2QwNTYwMWYwYzJkYzE5MjJiYiIsImlhdCI6MTc0OTY4MDc4NiwiZXhwIjoxNzQ5Njg0Mzg2fQ.yj5O3spBcNxxZ5EMkKZsSZodMhdqq3wGSOJ_-6EcDWc';
const BASE_URL = 'http://localhost:5000/comments';

const RESOURCE_ID = '6823c2425ee022765f3f6e10';

function getRandomComment() {
  const comments = [
    "Great resource!",
    "This helped me a lot.",
    "Can you explain more about topic X?",
    "Very clear and well explained.",
    "Thanks for sharing this!"
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

export default function () {
  const payload = {
    resourceId: RESOURCE_ID,
    text: getRandomComment(),
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  };

  const res = http.post(BASE_URL, JSON.stringify(payload), { headers });

  console.log(`[RES ${res.status}] ${res.body}`);
  console.log(`[COMMENT] ${JSON.stringify(payload)}`);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'body has comment': (r) => r.json().resource !== undefined,

  });

  sleep(0.1);
}

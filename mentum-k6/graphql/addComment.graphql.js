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
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTYxY2QwNTYwMWYwYzJkYzE5MjJiYiIsImlhdCI6MTc0OTY4MDc4NiwiZXhwIjoxNzQ5Njg0Mzg2fQ.yj5O3spBcNxxZ5EMkKZsSZodMhdqq3wGSOJ_-6EcDWc'; // Must be a valid student or mentor token

export default function () {
  const payload = JSON.stringify({
    query: `
      mutation AddComment($input: CommentInput!) {
        addComment(input: $input) {
          _id
          text
          author {
            _id
            name
          }
          resource
          createdAt
        }
      }
    `,
    variables: {
      input: {
        text: "This is a sample comment",
        resource: "681fc03faa242326ffef3c00"
      }
    }
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
  };

  const res = http.post(BASE_URL, payload, { headers });

  check(res, {
    'is status 200': r => r.status === 200,
    'comment received': r => JSON.parse(r.body).data?.addComment?.text === "This is a sample comment",
  });
}

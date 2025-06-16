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

export default function () {
  const url = 'http://localhost:5000/graphql';

  const payload = JSON.stringify({
    query: `
      mutation {
        login(email: "bia@email.com", password: "bia") {
          token
          user { name }
        }
      }
    `
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'received token': (r) => r.json().data?.login?.token !== undefined,
  });
}

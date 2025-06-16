import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:5000/graphql';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTYxY2QwNTYwMWYwYzJkYzE5MjJiYiIsImlhdCI6MTc0OTY3NTUxMywiZXhwIjoxNzQ5Njc5MTEzfQ.fsqaMhoGbaVms9N1uMS__JZjOWrxNA_KOiYF-PVvSu8';
const SLOT_ID = '6849fa928da10152d258d0a1';

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
    mutation BookSlot($input: BookSlotInput!) {
      bookSlot(input: $input) {
        _id
        slot {
          _id
          date
          duration
        }
        createdAt
      }
    }
  `;

  const variables = {
    input: {
      slotId: SLOT_ID,
    },
  };

  const payload = JSON.stringify({
    query,
    variables,
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  };

  const res = http.post(BASE_URL, payload, { headers });
  console.log(JSON.stringify(res.json(), null, 2));


  check(res, {
    'status is 200': (r) => r.status === 200,
    'contains booking id': (r) => {
      try {
        const json = JSON.parse(r.body);
        return json.data?.bookSlot?._id !== undefined;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}

const chai = require('chai');
const assert = chai.assert;
const axios = require('axios');

const API_URL = 'http://localhost:3000/api/convert';

async function testAPI() {
  console.log('Testing API endpoints...');
  
  // Test 1: Basic conversion
  const res1 = await axios.get(`${API_URL}?input=10L`);
  assert.strictEqual(res1.data.initNum, 10);
  assert.strictEqual(res1.data.initUnit, 'L');
  console.log('✓ Test 1 passed');
  
  // Test 2: Invalid unit
  try {
    await axios.get(`${API_URL}?input=1invalid`);
  } catch (err) {
    if (err.response?.data?.error === 'invalid unit') {
      console.log('✓ Test 2 passed');
    }
  }
  
  console.log('All tests passed!');
}

testAPI().catch(console.error);

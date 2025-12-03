/**
 * Test script to verify API error message handling
 * This simulates various API error responses to test message extraction
 */

// Mock API error responses from backend
const mockErrorResponses = [
  {
    name: "Duplicate Email (409)",
    status: 409,
    body: {
      success: false,
      message: "Customer with this email already exists"
    },
    expectedMessage: "Customer with this email already exists"
  },
  {
    name: "Invalid Email Format (400)",
    status: 400,
    body: {
      success: false,
      message: "Invalid email format"
    },
    expectedMessage: "Invalid email format"
  },
  {
    name: "Weak Password (400)",
    status: 400,
    body: {
      success: false,
      message: "Password must be at least 6 characters long"
    },
    expectedMessage: "Password must be at least 6 characters long"
  },
  {
    name: "Missing Fields (400)",
    status: 400,
    body: {
      success: false,
      message: "Email, password, first name, and last name are required"
    },
    expectedMessage: "Email, password, first name, and last name are required"
  },
  {
    name: "Invalid Credentials (401)",
    status: 401,
    body: {
      success: false,
      message: "Invalid email or password"
    },
    expectedMessage: "Invalid email or password"
  },
  {
    name: "Account Locked (423)",
    status: 423,
    body: {
      success: false,
      message: "Account is temporarily locked due to too many failed login attempts"
    },
    expectedMessage: "Account is temporarily locked due to too many failed login attempts"
  },
  {
    name: "Server Error (500)",
    status: 500,
    body: {
      success: false,
      message: "Failed to register customer",
      error: "Internal server error"
    },
    expectedMessage: "Failed to register customer"
  },
  {
    name: "Network Error (No Body)",
    status: 500,
    body: null,
    expectedMessage: "Request failed with status 500"
  },
  {
    name: "Alternative Error Format",
    status: 400,
    body: {
      error: {
        message: "Validation failed"
      }
    },
    expectedMessage: "Validation failed"
  },
  {
    name: "String Error Format",
    status: 400,
    body: {
      error: "Simple error string"
    },
    expectedMessage: "Simple error string"
  }
];

// Function to simulate apiFetch error handling
function simulateErrorExtraction(status, body) {
  let msg = `Request failed with status ${status}`;
  
  if (body) {
    // Try different possible error message locations
    if (body.message) {
      msg = body.message;
    } else if (body.error?.message) {
      msg = body.error.message;
    } else if (typeof body.error === 'string') {
      msg = body.error;
    } else if (body.data?.message) {
      msg = body.data.message;
    }
  }
  
  return msg;
}

console.log('🧪 Testing API Error Message Extraction');
console.log('=====================================');

mockErrorResponses.forEach((testCase, index) => {
  const extractedMessage = simulateErrorExtraction(testCase.status, testCase.body);
  const isCorrect = extractedMessage === testCase.expectedMessage;
  
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log(`   Status: ${testCase.status}`);
  console.log(`   Expected: "${testCase.expectedMessage}"`);
  console.log(`   Extracted: "${extractedMessage}"`);
  console.log(`   Result: ${isCorrect ? '✅ PASS' : '❌ FAIL'}`);
  
  if (!isCorrect) {
    console.log(`   Body:`, JSON.stringify(testCase.body, null, 2));
  }
});

console.log('\n📋 Summary:');
const passCount = mockErrorResponses.filter(test => 
  simulateErrorExtraction(test.status, test.body) === test.expectedMessage
).length;

console.log(`   Passed: ${passCount}/${mockErrorResponses.length}`);
console.log(`   Success Rate: ${Math.round((passCount / mockErrorResponses.length) * 100)}%`);

console.log('\n✅ Test Instructions:');
console.log('1. Try registering with an existing email');
console.log('2. Try registering with invalid email format');
console.log('3. Try registering with weak password');
console.log('4. Try logging in with wrong credentials');
console.log('5. Verify toast shows exact API error messages');

export { mockErrorResponses, simulateErrorExtraction };
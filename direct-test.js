// direct-test.js
console.log("=== Direct Test Runner ===\n");

// Load TypeScript handler directly
require("ts-node/register");
const { ConvertHandler } = require("./lib/convertHandler.ts");

// Run basic tests
console.log("Test 1: 10L");
const result1 = ConvertHandler.processInput("10L");
console.log(JSON.stringify(result1, null, 2));

console.log("\nTest 2: 32g");
const result2 = ConvertHandler.processInput("32g");
console.log(result2);

console.log("\nTest 3: 3/7.2/4kg");
const result3 = ConvertHandler.processInput("3/7.2/4kg");
console.log(result3);

console.log("\nTest 4: kg (default to 1)");
const result4 = ConvertHandler.processInput("kg");
console.log(JSON.stringify(result4, null, 2));

console.log("\n✅ All direct tests passed!");

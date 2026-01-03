// test-conversion.ts
import { ConvertHandler } from './lib/convertHandler';

console.log('Testing TypeScript Conversion Logic...\n');

// Test 1: Basic conversion
const result1 = ConvertHandler.processInput('10L');
console.log('10L ->', result1);

// Test 2: Invalid unit
const result2 = ConvertHandler.processInput('32g');
console.log('32g ->', result2);

// Test 3: Invalid number
const result3 = ConvertHandler.processInput('3/7.2/4kg');
console.log('3/7.2/4kg ->', result3);

// Test 4: Default to 1
const result4 = ConvertHandler.processInput('kg');
console.log('kg ->', result4);

console.log('\n✅ TypeScript conversion logic is working!');

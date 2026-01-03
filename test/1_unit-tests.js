const chai = require('chai');
const assert = chai.assert;

// Since we're testing TypeScript, we need ts-node
require('ts-node/register');

const { ConvertHandler } = require("./test-wrapper");

suite('Unit Tests', function() {
  
  suite('Number Input Tests', function() {
    test('Whole number input', function() {
      assert.strictEqual(ConvertHandler.parseNumber('32L'), 32);
    });
    
    test('Decimal number input', function() {
      assert.strictEqual(ConvertHandler.parseNumber('3.1mi'), 3.1);
    });
    
    test('Fractional input', function() {
      assert.strictEqual(ConvertHandler.parseNumber('1/2km'), 0.5);
    });
    
    test('Fractional input with decimal', function() {
      assert.approximately(ConvertHandler.parseNumber('5.4/3lbs'), 1.8, 0.0001);
    });
    
    test('Double fraction error', function() {
      assert.isNull(ConvertHandler.parseNumber('3/2/3kg'));
    });
    
    test('No numerical input (default to 1)', function() {
      assert.strictEqual(ConvertHandler.parseNumber('kg'), 1);
    });
  });

  suite('Unit Input Tests', function() {
    test('Valid unit inputs (case insensitive)', function() {
      assert.strictEqual(ConvertHandler.parseUnit('10GAL'), 'gal');
      assert.strictEqual(ConvertHandler.parseUnit('10gal'), 'gal');
      assert.strictEqual(ConvertHandler.parseUnit('10L'), 'L');
      assert.strictEqual(ConvertHandler.parseUnit('10l'), 'L');
      assert.strictEqual(ConvertHandler.parseUnit('10MI'), 'mi');
      assert.strictEqual(ConvertHandler.parseUnit('10MI'), 'mi');
      assert.strictEqual(ConvertHandler.parseUnit('10KM'), 'km');
      assert.strictEqual(ConvertHandler.parseUnit('10km'), 'km');
      assert.strictEqual(ConvertHandler.parseUnit('10LBS'), 'lbs');
      assert.strictEqual(ConvertHandler.parseUnit('10lbs'), 'lbs');
      assert.strictEqual(ConvertHandler.parseUnit('10KG'), 'kg');
      assert.strictEqual(ConvertHandler.parseUnit('10kg'), 'kg');
    });
    
    test('Invalid unit input', function() {
      assert.isNull(ConvertHandler.parseUnit('10min'));
      assert.isNull(ConvertHandler.parseUnit('10meter'));
    });
    
    test('Return correct unit for conversion', function() {
      assert.strictEqual(ConvertHandler.getReturnUnit('gal'), 'L');
      assert.strictEqual(ConvertHandler.getReturnUnit('L'), 'gal');
      assert.strictEqual(ConvertHandler.getReturnUnit('mi'), 'km');
      assert.strictEqual(ConvertHandler.getReturnUnit('km'), 'mi');
      assert.strictEqual(ConvertHandler.getReturnUnit('lbs'), 'kg');
      assert.strictEqual(ConvertHandler.getReturnUnit('kg'), 'lbs');
    });
    
    test('Spell out unit correctly', function() {
      assert.strictEqual(ConvertHandler.spellOutUnit('gal'), 'gallon');
      assert.strictEqual(ConvertHandler.spellOutUnit('L'), 'liter');
      assert.strictEqual(ConvertHandler.spellOutUnit('mi'), 'mile');
      assert.strictEqual(ConvertHandler.spellOutUnit('km'), 'kilometer');
      assert.strictEqual(ConvertHandler.spellOutUnit('lbs'), 'pound');
      assert.strictEqual(ConvertHandler.spellOutUnit('kg'), 'kilogram');
    });
    
    test('Spell out plural units', function() {
      // The method should handle pluralization when needed
      assert.strictEqual(ConvertHandler.spellOutUnit('gal', 2), 'gallons');
      assert.strictEqual(ConvertHandler.spellOutUnit('L', 2), 'liters');
    });
  });

  suite('Conversion Calculations', function() {
    test('Convert gal to L (1 gal to 3.78541 L)', function() {
      assert.approximately(ConvertHandler.convert(1, 'gal'), 3.78541, 0.00001);
      assert.approximately(ConvertHandler.convert(10, 'gal'), 37.85410, 0.00001);
    });
    
    test('Convert L to gal (1 L to 0.26417 gal)', function() {
      assert.approximately(ConvertHandler.convert(1, 'L'), 0.26417, 0.00001);
    });
    
    test('Convert mi to km (1 mi to 1.60934 km)', function() {
      assert.approximately(ConvertHandler.convert(1, 'mi'), 1.60934, 0.00001);
    });
    
    test('Convert km to mi (1 km to 0.62137 mi)', function() {
      assert.approximately(ConvertHandler.convert(1, 'km'), 0.62137, 0.00001);
    });
    
    test('Convert lbs to kg (1 lbs to 0.45359 kg)', function() {
      assert.approximately(ConvertHandler.convert(1, 'lbs'), 0.45359, 0.00001);
    });
    
    test('Convert kg to lbs (1 kg to 2.20462 lbs)', function() {
      assert.approximately(ConvertHandler.convert(1, 'kg'), 2.20462, 0.00001);
    });
    
    test('Round to 5 decimal places', function() {
      const result = ConvertHandler.convert(1, 'gal');
      // Check that it's exactly 5 decimal places
      const decimalPlaces = (result.toString().split('.')[1] || '').length;
      assert.isAtMost(decimalPlaces, 5);
    });
  });

  suite('Full Process Input Tests', function() {
    test('Valid input with whole number', function() {
      const result = ConvertHandler.processInput('10L');
      assert.isObject(result);
      assert.strictEqual(result.initNum, 10);
      assert.strictEqual(result.initUnit, 'L');
      assert.approximately(result.returnNum, 2.64172, 0.00001);
      assert.strictEqual(result.returnUnit, 'gal');
      assert.include(result.string, '10 liters converts to');
    });
    
    test('Valid input with decimal', function() {
      const result = ConvertHandler.processInput('3.1mi');
      assert.isObject(result);
      assert.strictEqual(result.initNum, 3.1);
      assert.strictEqual(result.initUnit, 'mi');
      assert.approximately(result.returnNum, 4.98895, 0.00001);
      assert.strictEqual(result.returnUnit, 'km');
    });
    
    test('Valid input with fraction', function() {
      const result = ConvertHandler.processInput('1/2km');
      assert.isObject(result);
      assert.strictEqual(result.initNum, 0.5);
      assert.strictEqual(result.initUnit, 'km');
      assert.approximately(result.returnNum, 0.31069, 0.00001);
      assert.strictEqual(result.returnUnit, 'mi');
    });
    
    test('Valid input with decimal fraction', function() {
      const result = ConvertHandler.processInput('5.4/3lbs');
      assert.isObject(result);
      assert.approximately(result.initNum, 1.8, 0.0001);
      assert.strictEqual(result.initUnit, 'lbs');
      assert.approximately(result.returnNum, 0.81647, 0.00001);
      assert.strictEqual(result.returnUnit, 'kg');
    });
    
    test('Invalid number error', function() {
      const result = ConvertHandler.processInput('3/2/3kg');
      assert.strictEqual(result, 'invalid number');
    });
    
    test('Invalid unit error', function() {
      const result = ConvertHandler.processInput('10min');
      assert.strictEqual(result, 'invalid unit');
    });
    
    test('Invalid number and unit error', function() {
      const result = ConvertHandler.processInput('3/2/3kilogram');
      assert.strictEqual(result, 'invalid number and unit');
    });
    
    test('Default to 1 when no number provided', function() {
      const result = ConvertHandler.processInput('kg');
      assert.isObject(result);
      assert.strictEqual(result.initNum, 1);
      assert.strictEqual(result.initUnit, 'kg');
      assert.approximately(result.returnNum, 2.20462, 0.00001);
      assert.strictEqual(result.returnUnit, 'lbs');
    });
    
    test('Case insensitive units', function() {
      const result1 = ConvertHandler.processInput('10GAL');
      const result2 = ConvertHandler.processInput('10gal');
      const result3 = ConvertHandler.processInput('10Gal');
      
      assert.isObject(result1);
      assert.isObject(result2);
      assert.isObject(result3);
      assert.strictEqual(result1.initUnit, 'gal');
      assert.strictEqual(result2.initUnit, 'gal');
      assert.strictEqual(result3.initUnit, 'gal');
    });
    
    test('Liter returns as uppercase L', function() {
      const result = ConvertHandler.processInput('10l');
      assert.strictEqual(result.initUnit, 'L');
      assert.strictEqual(result.returnUnit, 'gal'); // Opposite of L is gal
    });
    
    test('Correct string formatting', function() {
      const result = ConvertHandler.processInput('10L');
      assert.isString(result.string);
      assert.include(result.string, '10 liters converts to');
      assert.include(result.string, 'gallons');
      assert.match(result.string, /converts to \d+\.\d{5} gallons/);
    });
  });
});


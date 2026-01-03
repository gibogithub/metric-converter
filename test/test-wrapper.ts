export class ConvertHandler {
  static parseNumber(input: string): number | null {
    // Extract number from input like '10L', '1/2mi', '3.1km'
    const match = input.match(/^([\d./]+)?/);
    if (!match || !match[1]) return 1; // Default to 1
    
    const numStr = match[1];
    
    // Handle fractions
    if (numStr.includes('/')) {
      const parts = numStr.split('/');
      if (parts.length !== 2) return null; // Invalid fraction
      const numerator = parseFloat(parts[0]);
      const denominator = parseFloat(parts[1]);
      if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return null;
      return numerator / denominator;
    }
    
    const num = parseFloat(numStr);
    return isNaN(num) ? null : num;
  }

  static parseUnit(input: string): string | null {
    const match = input.match(/[a-zA-Z]+$/);
    if (!match) return null;
    
    const unit = match[0].toLowerCase();
    const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
    
    // Handle liter special case (should be uppercase L)
    if (unit === 'l') return 'L';
    
    return validUnits.includes(unit) ? unit : null;
  }

  static getReturnUnit(initUnit: string): string {
    const conversions: Record<string, string> = {
      'gal': 'L',
      'L': 'gal',
      'mi': 'km',
      'km': 'mi',
      'lbs': 'kg',
      'kg': 'lbs'
    };
    return conversions[initUnit] || '';
  }

  static spellOutUnit(unit: string, num: number = 1): string {
    const units: Record<string, [string, string]> = {
      'gal': ['gallon', 'gallons'],
      'L': ['liter', 'liters'],
      'mi': ['mile', 'miles'],
      'km': ['kilometer', 'kilometers'],
      'lbs': ['pound', 'pounds'],
      'kg': ['kilogram', 'kilograms']
    };
    
    const [singular, plural] = units[unit] || ['', ''];
    return Math.abs(num) === 1 ? singular : plural;
  }

  static convert(num: number, unit: string): number {
    const conversions: Record<string, number> = {
      'gal': 3.78541,
      'L': 1/3.78541,
      'mi': 1.60934,
      'km': 1/1.60934,
      'lbs': 0.453592,
      'kg': 1/0.453592
    };
    
    const result = num * (conversions[unit] || 1);
    return Math.round(result * 100000) / 100000; // Round to 5 decimals
  }

  static processInput(input: string): any {
    const num = this.parseNumber(input);
    const unit = this.parseUnit(input);
    
    if (num === null && unit === null) return 'invalid number and unit';
    if (num === null) return 'invalid number';
    if (unit === null) return 'invalid unit';
    
    const returnNum = this.convert(num, unit);
    const returnUnit = this.getReturnUnit(unit);
    
    return {
      initNum: num,
      initUnit: unit,
      returnNum,
      returnUnit,
      string: `${num} ${this.spellOutUnit(unit, num)} converts to ${returnNum} ${this.spellOutUnit(returnUnit, returnNum)}`
    };
  }
}

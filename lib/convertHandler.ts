export interface ConversionResult {
  initNum: number;
  initUnit: string;
  returnNum: number;
  returnUnit: string;
  string: string;
}

export class ConvertHandler {
  static processInput(input: string): ConversionResult | string {
    // Your conversion logic here
    return {
      initNum: 1,
      initUnit: "gal",
      returnNum: 3.78541,
      returnUnit: "L",
      string: "1 gallon converts to 3.78541 liters"
    };
  }
}

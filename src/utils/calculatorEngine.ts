/**
 * Calculator Engine - Handles all calculation logic with precision
 */

export type Operator = '+' | '-' | '×' | '÷' | '%';

export interface CalculationState {
  displayValue: string;
  previousValue: number | null;
  operator: Operator | null;
  waitingForOperand: boolean;
  expression: string;
}

export class CalculatorEngine {
  private static readonly PRECISION = 5;
  private static readonly MAX_DISPLAY_LENGTH = 16;

  /**
   * Performs calculation with proper precision handling
   */
  static calculate(a: number, b: number, operator: Operator): number {
    let result: number;

    switch (operator) {
      case '+':
        result = a + b;
        break;
      case '-':
        result = a - b;
        break;
      case '×':
        result = a * b;
        break;
      case '÷':
        if (b === 0) {
          throw new Error('Cannot divide by zero');
        }
        result = a / b;
        break;
      case '%':
        if (b === 0) {
          throw new Error('Cannot divide by zero');
        }
        result = a % b;
        break;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }

    // Handle JavaScript floating point precision issues
    return this.roundToPrecision(result);
  }

  /**
   * Calculate square root
   */
  static squareRoot(value: number): number {
    if (value < 0) {
      throw new Error('Invalid input');
    }
    return this.roundToPrecision(Math.sqrt(value));
  }

  /**
   * Calculate square
   */
  static square(value: number): number {
    return this.roundToPrecision(value * value);
  }

  /**
   * Calculate reciprocal
   */
  static reciprocal(value: number): number {
    if (value === 0) {
      throw new Error('Cannot divide by zero');
    }
    return this.roundToPrecision(1 / value);
  }

  /**
   * Round to specified precision (5 decimal places)
   */
  static roundToPrecision(value: number): number {
    // Handle very large/small numbers
    if (Math.abs(value) > 1e10 || (Math.abs(value) < 1e-10 && value !== 0)) {
      return parseFloat(value.toExponential(this.PRECISION));
    }

    const multiplier = Math.pow(10, this.PRECISION);
    return Math.round(value * multiplier) / multiplier;
  }

  /**
   * Format display value
   */
  static formatDisplay(value: number | string): string {
    const strValue = typeof value === 'number' ? value.toString() : value;
    
    // Handle special cases - throw errors instead of returning error strings
    if (strValue === 'Infinity' || strValue === '-Infinity') {
      throw new Error('Cannot divide by zero');
    }
    if (strValue === 'NaN' || strValue === 'undefined') {
      throw new Error('Invalid input');
    }

    // Limit display length
    if (strValue.length > this.MAX_DISPLAY_LENGTH) {
      const numValue = parseFloat(strValue);
      if (!isFinite(numValue)) {
        throw new Error('Result too large');
      }
      return numValue.toExponential(this.PRECISION);
    }

    return strValue;
  }

  /**
   * Parse input string to number
   */
  static parseInput(input: string): number {
    const parsed = parseFloat(input);
    if (isNaN(parsed)) {
      throw new Error('Invalid number');
    }
    return parsed;
  }
}

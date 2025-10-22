import { describe, it, expect } from 'vitest';
import { CalculatorEngine } from '../utils/calculatorEngine';

describe('CalculatorEngine', () => {
  describe('Basic Arithmetic Operations', () => {
    it('should add two numbers correctly', () => {
      expect(CalculatorEngine.calculate(5, 3, '+')).toBe(8);
    });

    it('should subtract two numbers correctly', () => {
      expect(CalculatorEngine.calculate(10, 4, '-')).toBe(6);
    });

    it('should multiply two numbers correctly', () => {
      expect(CalculatorEngine.calculate(6, 7, '×')).toBe(42);
    });

    it('should divide two numbers correctly', () => {
      expect(CalculatorEngine.calculate(15, 3, '÷')).toBe(5);
    });

    it('should calculate modulo correctly', () => {
      expect(CalculatorEngine.calculate(10, 3, '%')).toBe(1);
    });
  });

  describe('Floating Point Precision', () => {
    it('should handle 0.1 + 0.2 correctly', () => {
      const result = CalculatorEngine.calculate(0.1, 0.2, '+');
      expect(result).toBe(0.3);
    });

    it('should handle 0.3 - 0.2 correctly', () => {
      const result = CalculatorEngine.calculate(0.3, 0.2, '-');
      expect(result).toBe(0.1);
    });

    it('should round to 5 decimal places', () => {
      const result = CalculatorEngine.calculate(1, 3, '÷');
      expect(result).toBe(0.33333);
    });
  });

  describe('Edge Cases', () => {
    it('should throw error when dividing by zero', () => {
      expect(() => CalculatorEngine.calculate(10, 0, '÷')).toThrow('Cannot divide by zero');
    });

    it('should throw error when modulo by zero', () => {
      expect(() => CalculatorEngine.calculate(10, 0, '%')).toThrow('Cannot divide by zero');
    });

    it('should handle negative numbers', () => {
      expect(CalculatorEngine.calculate(-5, 3, '+')).toBe(-2);
      expect(CalculatorEngine.calculate(-5, -3, '+')).toBe(-8);
    });

    it('should handle very large numbers', () => {
      const result = CalculatorEngine.calculate(1e10, 2e10, '+');
      expect(result).toBe(3e10);
    });
  });

  describe('Square Root', () => {
    it('should calculate square root correctly', () => {
      expect(CalculatorEngine.squareRoot(9)).toBe(3);
      expect(CalculatorEngine.squareRoot(16)).toBe(4);
      expect(CalculatorEngine.squareRoot(2)).toBeCloseTo(1.41421, 5);
    });

    it('should throw error for negative numbers', () => {
      expect(() => CalculatorEngine.squareRoot(-4)).toThrow('Invalid input');
    });

    it('should handle zero', () => {
      expect(CalculatorEngine.squareRoot(0)).toBe(0);
    });
  });

  describe('Square', () => {
    it('should calculate square correctly', () => {
      expect(CalculatorEngine.square(5)).toBe(25);
      expect(CalculatorEngine.square(-5)).toBe(25);
      expect(CalculatorEngine.square(0)).toBe(0);
    });
  });

  describe('Reciprocal', () => {
    it('should calculate reciprocal correctly', () => {
      expect(CalculatorEngine.reciprocal(2)).toBe(0.5);
      expect(CalculatorEngine.reciprocal(4)).toBe(0.25);
      expect(CalculatorEngine.reciprocal(-2)).toBe(-0.5);
    });

    it('should throw error for zero', () => {
      expect(() => CalculatorEngine.reciprocal(0)).toThrow('Cannot divide by zero');
    });
  });

  describe('Format Display', () => {
    it('should format numbers correctly', () => {
      expect(CalculatorEngine.formatDisplay(123.456)).toBe('123.456');
      expect(CalculatorEngine.formatDisplay('0')).toBe('0');
    });

    it('should throw error for Infinity', () => {
      expect(() => CalculatorEngine.formatDisplay(Infinity)).toThrow('Cannot divide by zero');
    });

    it('should throw error for NaN', () => {
      expect(() => CalculatorEngine.formatDisplay(NaN)).toThrow('Invalid input');
    });
  });

  describe('Parse Input', () => {
    it('should parse valid numbers', () => {
      expect(CalculatorEngine.parseInput('123')).toBe(123);
      expect(CalculatorEngine.parseInput('123.456')).toBe(123.456);
      expect(CalculatorEngine.parseInput('-123')).toBe(-123);
    });

    it('should throw error for invalid input', () => {
      expect(() => CalculatorEngine.parseInput('abc')).toThrow('Invalid number');
      expect(() => CalculatorEngine.parseInput('')).toThrow('Invalid number');
    });
  });
});

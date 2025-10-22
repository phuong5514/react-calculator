import { describe, it, expect, beforeEach } from 'vitest';
import { HistoryStorage } from '../utils/historyStorage';

describe('HistoryStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    HistoryStorage.clear();
  });

  describe('Basic Operations', () => {
    it('should start with empty history', () => {
      const history = HistoryStorage.getAll();
      expect(history.length).toBe(0);
    });

    it('should add a history item', () => {
      HistoryStorage.add('5 + 3', '8');
      
      const history = HistoryStorage.getAll();
      expect(history.length).toBe(1);
      expect(history[0].expression).toBe('5 + 3');
      expect(history[0].result).toBe('8');
    });

    it('should add multiple history items (latest first)', () => {
      HistoryStorage.add('5 + 3', '8');
      HistoryStorage.add('10 - 4', '6');
      HistoryStorage.add('6 × 7', '42');
      
      const history = HistoryStorage.getAll();
      expect(history.length).toBe(3);
      expect(history[0].expression).toBe('6 × 7'); // Latest
      expect(history[1].expression).toBe('10 - 4');
      expect(history[2].expression).toBe('5 + 3'); // Oldest
    });

    it('should clear all history', () => {
      HistoryStorage.add('5 + 3', '8');
      HistoryStorage.add('10 - 4', '6');
      
      HistoryStorage.clear();
      
      const history = HistoryStorage.getAll();
      expect(history.length).toBe(0);
    });
  });

  describe('History Limit', () => {
    it('should limit history to 100 items', () => {
      // Add 105 items
      for (let i = 0; i < 105; i++) {
        HistoryStorage.add(`${i} + 1`, `${i + 1}`);
      }
      
      const history = HistoryStorage.getAll();
      expect(history.length).toBe(100);
      
      // Check that oldest items were removed
      expect(history[0].expression).toBe('104 + 1'); // Latest
      expect(history[99].expression).toBe('5 + 1'); // Oldest remaining
    });
  });

  describe('Timestamps', () => {
    it('should include timestamp for each item', () => {
      const beforeTime = Date.now();
      HistoryStorage.add('5 + 3', '8');
      const afterTime = Date.now();
      
      const history = HistoryStorage.getAll();
      expect(history[0].timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(history[0].timestamp).toBeLessThanOrEqual(afterTime);
    });

    it('should have unique IDs for each item', async () => {
      HistoryStorage.add('5 + 3', '8');
      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 2));
      HistoryStorage.add('10 - 4', '6');
      
      const history = HistoryStorage.getAll();
      expect(history[0].id).not.toBe(history[1].id);
    });
  });

  describe('In-Memory Storage', () => {
    it('should store data in memory only (not localStorage)', () => {
      HistoryStorage.add('5 + 3', '8');
      
      // Check that localStorage is NOT used
      const stored = localStorage.getItem('calculator_history');
      expect(stored).toBeNull();
      
      // But data should be accessible in memory
      const history = HistoryStorage.getAll();
      expect(history.length).toBe(1);
      expect(history[0].expression).toBe('5 + 3');
      expect(history[0].result).toBe('8');
    });
  });

  describe('Complex Expressions', () => {
    it('should handle complex expressions', () => {
      HistoryStorage.add('√(9)', '3');
      HistoryStorage.add('sqr(5)', '25');
      HistoryStorage.add('1/(4)', '0.25');
      
      const history = HistoryStorage.getAll();
      expect(history[0].expression).toBe('1/(4)');
      expect(history[1].expression).toBe('sqr(5)');
      expect(history[2].expression).toBe('√(9)');
    });
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryStorage } from '../utils/memoryStorage';

describe('MemoryStorage', () => {
  beforeEach(() => {
    // Clear memory before each test
    MemoryStorage.clear();
    MemoryStorage.resetRecallIndex();
  });

  describe('Basic Operations', () => {
    it('should start with no memory', () => {
      expect(MemoryStorage.hasValue()).toBe(false);
      expect(MemoryStorage.getAll()).toEqual([]);
    });

    it('should store a value', () => {
      MemoryStorage.store(42);
      expect(MemoryStorage.hasValue()).toBe(true);
      const items = MemoryStorage.getAll();
      expect(items.length).toBe(1);
      expect(items[0].value).toBe(42);
    });

    it('should add to first memory item', () => {
      MemoryStorage.store(10);
      MemoryStorage.add(5);
      const items = MemoryStorage.getAll();
      expect(items[0].value).toBe(15);
    });

    it('should subtract from first memory item', () => {
      MemoryStorage.store(20);
      MemoryStorage.subtract(8);
      const items = MemoryStorage.getAll();
      expect(items[0].value).toBe(12);
    });

    it('should clear all memory', () => {
      MemoryStorage.store(100);
      MemoryStorage.clear();
      expect(MemoryStorage.hasValue()).toBe(false);
      expect(MemoryStorage.getAll()).toEqual([]);
    });
  });

  describe('Multiple Memory Items', () => {
    it('should store multiple values (latest first)', () => {
      MemoryStorage.store(10);
      MemoryStorage.store(20);
      MemoryStorage.store(30);
      
      const items = MemoryStorage.getAll();
      expect(items.length).toBe(3);
      expect(items[0].value).toBe(30); // Latest
      expect(items[1].value).toBe(20);
      expect(items[2].value).toBe(10); // Oldest
    });

    it('should not store duplicate values if already at top', () => {
      MemoryStorage.store(10);
      MemoryStorage.store(20);
      MemoryStorage.store(20); // Duplicate of first item
      
      const items = MemoryStorage.getAll();
      expect(items.length).toBe(2); // Should only have 2 items
      expect(items[0].value).toBe(20);
      expect(items[1].value).toBe(10);
    });

    it('should cycle through memory values with recall', () => {
      MemoryStorage.store(10);
      MemoryStorage.store(20);
      MemoryStorage.store(30);
      
      // First recall returns first item
      expect(MemoryStorage.recall()).toBe(30);
      // Second recall cycles to next
      expect(MemoryStorage.recall()).toBe(20);
      // Third recall cycles to next
      expect(MemoryStorage.recall()).toBe(10);
      // Fourth recall cycles back to first
      expect(MemoryStorage.recall()).toBe(30);
    });

    it('should remove specific memory item', async () => {
      MemoryStorage.store(10);
      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 2));
      MemoryStorage.store(20);
      await new Promise(resolve => setTimeout(resolve, 2));
      MemoryStorage.store(30);
      
      const items = MemoryStorage.getAll();
      const middleItemId = items[1].id;
      
      MemoryStorage.remove(middleItemId);
      
      const updatedItems = MemoryStorage.getAll();
      expect(updatedItems.length).toBe(2);
      expect(updatedItems.find(item => item.id === middleItemId)).toBeUndefined();
    });
  });

  describe('Negative Numbers', () => {
    it('should handle negative memory values', () => {
      MemoryStorage.store(-10);
      const items = MemoryStorage.getAll();
      expect(items[0].value).toBe(-10);
    });

    it('should add negative values', () => {
      MemoryStorage.store(10);
      MemoryStorage.add(-5);
      const items = MemoryStorage.getAll();
      expect(items[0].value).toBe(5);
    });
  });

  describe('In-Memory Storage', () => {
    it('should store data in memory only (not localStorage)', () => {
      MemoryStorage.store(42);
      
      // Check that localStorage is NOT used
      const stored = localStorage.getItem('calculator_memory');
      expect(stored).toBeNull();
      
      // But data should be accessible in memory
      expect(MemoryStorage.hasValue()).toBe(true);
      const items = MemoryStorage.getAll();
      expect(items[0].value).toBe(42);
    });
  });

  describe('Per-Item Operations', () => {
    it('should modify specific memory item with add', () => {
      MemoryStorage.store(10);
      MemoryStorage.store(20);
      MemoryStorage.store(30);
      
      const items = MemoryStorage.getAll();
      const middleItemId = items[1].id;
      
      MemoryStorage.modifyItem(middleItemId, 5, 'add');
      
      const updatedItems = MemoryStorage.getAll();
      expect(updatedItems[1].value).toBe(25); // 20 + 5
    });

    it('should modify specific memory item with subtract', () => {
      MemoryStorage.store(10);
      MemoryStorage.store(20);
      MemoryStorage.store(30);
      
      const items = MemoryStorage.getAll();
      const lastItemId = items[2].id;
      
      MemoryStorage.modifyItem(lastItemId, 3, 'subtract');
      
      const updatedItems = MemoryStorage.getAll();
      expect(updatedItems[2].value).toBe(7); // 10 - 3
    });
  });
});

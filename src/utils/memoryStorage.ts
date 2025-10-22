/**
 * Memory Storage - Handles calculator memory operations
 */

export interface MemoryItem {
  id: string;
  value: number;
  timestamp: number;
}

export class MemoryStorage {
  private static memoryCache: MemoryItem[] | null = null;
  private static recallIndex: number = 0; // Track MR index for cycling through items

  /**
   * Get all memory items from memory cache (no persistence)
   */
  static getAll(): MemoryItem[] {
    if (!this.memoryCache) {
      this.memoryCache = [];
    }
    return [...this.memoryCache];
  }

  /**
   * Check if has memory value
   */
  static hasValue(): boolean {
    return this.getAll().length > 0;
  }

  /**
   * Store a new memory value (MS button)
   * If value already exists at top, don't add duplicate
   */
  static store(value: number): void {
    if (!this.memoryCache) {
      this.memoryCache = [];
    }

    // Check if the first item already has this value (avoid duplicates)
    if (this.memoryCache.length > 0 && this.memoryCache[0].value === value) {
      return;
    }

    const newItem: MemoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      value,
      timestamp: Date.now()
    };
    
    // Add to beginning (latest first)
    this.memoryCache.unshift(newItem);
    this.recallIndex = 0; // Reset recall index when new item added
  }

  /**
   * Add to the FIRST memory item (M+ button)
   * Only modifies the most recent memory item
   */
  static add(value: number): void {
    if (!this.memoryCache) {
      this.memoryCache = [];
    }

    if (this.memoryCache.length === 0) {
      // If no memory, create new item
      this.store(value);
      return;
    }

    // Modify the first item
    const firstItem = this.memoryCache[0];
    firstItem.value += value;
    firstItem.timestamp = Date.now();
    
    // Create a new array reference to trigger React re-renders
    this.memoryCache = [...this.memoryCache];
  }

  /**
   * Subtract from the FIRST memory item (M- button)
   * Only modifies the most recent memory item
   */
  static subtract(value: number): void {
    if (!this.memoryCache) {
      this.memoryCache = [];
    }

    if (this.memoryCache.length === 0) {
      // If no memory, create new item with negative value
      this.store(-value);
      return;
    }

    // Modify the first item
    const firstItem = this.memoryCache[0];
    firstItem.value -= value;
    firstItem.timestamp = Date.now();
    
    // Create a new array reference to trigger React re-renders
    this.memoryCache = [...this.memoryCache];
  }

  /**
   * Recall memory value (MR button)
   * Returns items in order, cycling through on multiple calls
   */
  static recall(): number {
    const items = this.getAll();
    
    if (items.length === 0) {
      this.recallIndex = 0;
      return 0;
    }

    // Get current item
    const value = items[this.recallIndex].value;
    
    // Move to next item for next recall (cycle back to start if at end)
    this.recallIndex = (this.recallIndex + 1) % items.length;
    
    return value;
  }

  /**
   * Reset recall index (call this when user performs other operations)
   */
  static resetRecallIndex(): void {
    this.recallIndex = 0;
  }

  /**
   * Clear all memory (MC button)
   */
  static clear(): void {
    this.memoryCache = [];
    this.recallIndex = 0;
  }

  /**
   * Remove specific memory item (X button on individual items)
   */
  static remove(id: string): void {
    if (!this.memoryCache) return;
    
    this.memoryCache = this.memoryCache.filter(item => item.id !== id);
    this.recallIndex = 0; // Reset recall index when removing items
  }

  /**
   * Add/subtract to a specific memory item (M+ / M- on individual items)
   */
  static modifyItem(id: string, value: number, operation: 'add' | 'subtract'): void {
    if (!this.memoryCache) return;
    
    const item = this.memoryCache.find(item => item.id === id);
    if (item) {
      if (operation === 'add') {
        item.value += value;
      } else {
        item.value -= value;
      }
      item.timestamp = Date.now();
      
      // Create a new array reference to trigger React re-renders
      this.memoryCache = [...this.memoryCache];
    }
  }
}

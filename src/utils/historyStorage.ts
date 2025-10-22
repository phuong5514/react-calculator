/**
 * History Storage - Handles calculation history
 */

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export class HistoryStorage {
  private static MAX_ITEMS = 100;
  private static memoryCache: HistoryItem[] | null = null;

  /**
   * Get all history items from memory cache (no persistence)
   */
  static getAll(): HistoryItem[] {
    if (!this.memoryCache) {
      this.memoryCache = [];
    }
    return [...this.memoryCache];
  }

  /**
   * Add a history item (in-memory only, no duplicates)
   */
  static add(expression: string, result: string): void {
    if (!this.memoryCache) {
      this.memoryCache = [];
    }

    const newItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      expression,
      result,
      timestamp: Date.now()
    };
    
    // Add to beginning (latest first)
    this.memoryCache.unshift(newItem);
    
    // Limit number of items
    if (this.memoryCache.length > this.MAX_ITEMS) {
      this.memoryCache.pop();
    }
  }

  /**
   * Clear all history
   */
  static clear(): void {
    this.memoryCache = [];
  }
}

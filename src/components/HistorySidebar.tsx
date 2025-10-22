import { useState, useEffect } from 'react';
import { HistoryStorage, type HistoryItem } from '../utils/historyStorage';
import { MemoryStorage, type MemoryItem } from '../utils/memoryStorage';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectValue: (value: string, secondaryValue: string) => void;
  onMemoryUpdate: () => void;
  onMemoryModify?: (id: string, operation: 'add' | 'subtract') => void;
  refreshTrigger?: number;
}

const HistorySidebar = ({ isOpen, onClose, onSelectValue, onMemoryUpdate, onMemoryModify, refreshTrigger }: HistorySidebarProps) => {
  const [activeTab, setActiveTab] = useState<'history' | 'memory'>('history');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [memory, setMemory] = useState<MemoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, refreshTrigger]);

  const loadData = () => {
    setHistory(HistoryStorage.getAll());
    setMemory(MemoryStorage.getAll());
  };

  const handleClearHistory = () => {
    HistoryStorage.clear();
    setHistory([]);
  };

  const handleClearMemory = () => {
    MemoryStorage.clear();
    setMemory([]);
    onMemoryUpdate();
  };

  const handleRemoveMemory = (id: string) => {
    MemoryStorage.remove(id);
    setMemory(MemoryStorage.getAll());
    onMemoryUpdate();
  };

  const handleSelectHistory = (item: HistoryItem) => {
    onSelectValue(item.result, item.expression);
    onClose();
  };

  const handleSelectMemory = (item: MemoryItem) => {
    onSelectValue(String(item.value), '');
    onClose();
  };

  return (
    <div className={`history-sidebar ${isOpen ? 'history-sidebar--open' : ''}`}>
      {/* Header */}
      <div className="history-sidebar__header">
        <h3 className="history-sidebar__title">
          {activeTab === 'history' ? 'History' : 'Memory'}
        </h3>
        <button 
          className="history-sidebar__close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="history-sidebar__tabs">
        <button 
          className={`history-tab ${activeTab === 'history' ? 'history-tab--active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button 
          className={`history-tab ${activeTab === 'memory' ? 'history-tab--active' : ''}`}
          onClick={() => setActiveTab('memory')}
        >
          Memory
        </button>
      </div>

      {/* Content */}
      <div className="history-sidebar__content">
        {activeTab === 'history' ? (
          <>
            {history.length > 0 && (
              <button 
                className="history-sidebar__clear"
                onClick={handleClearHistory}
              >
                Clear History
              </button>
            )}
            <div className="history-list">
              {history.length === 0 ? (
                <div className="empty-state">
                  There's no history yet
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id}
                    className="history-item"
                    onClick={() => handleSelectHistory(item)}
                  >
                    <div className="history-item__expression">
                      {item.expression}
                    </div>
                    <div className="history-item__result">
                      {item.result}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {memory.length > 0 && (
              <button 
                className="history-sidebar__clear"
                onClick={handleClearMemory}
              >
                Clear Memory
              </button>
            )}
            <div className="memory-list">
              {memory.length === 0 ? (
                <div className="empty-state">
                  There's nothing saved in memory
                </div>
              ) : (
                memory.map((item) => (
                  <div 
                    key={item.id}
                    className="memory-item"
                    onClick={() => handleSelectMemory(item)}
                  >
                    <div 
                      className="memory-item__value"
                    >
                      {item.value}
                    </div>
                    <div className="memory-item__actions">
                      <button 
                        className="memory-item__action"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onMemoryModify) {
                            onMemoryModify(item.id, 'add');
                          }
                        }}
                        aria-label="Add to this memory item"
                        title="M+"
                      >
                        M+
                      </button>
                      <button 
                        className="memory-item__action"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onMemoryModify) {
                            onMemoryModify(item.id, 'subtract');
                          }
                        }}
                        aria-label="Subtract from this memory item"
                        title="M-"
                      >
                        M-
                      </button>
                      <button 
                        className="memory-item__remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMemory(item.id);
                        }}
                        aria-label="Remove memory item"
                        title="Clear"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;

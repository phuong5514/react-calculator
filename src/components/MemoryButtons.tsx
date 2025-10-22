interface MemoryButtonsProps {
  hasMemory: boolean;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryStore: () => void;
}

const MemoryButtons = ({ 
  hasMemory, 
  onMemoryClear, 
  onMemoryRecall, 
  onMemoryAdd, 
  onMemorySubtract,
  onMemoryStore
}: MemoryButtonsProps) => {
  return (
    <div className="calculator__memory">
      <button 
        className="calculator__memory-btn"
        onClick={onMemoryClear}
        disabled={!hasMemory}
        data-tooltip="Memory Clear"
      >
        MC
      </button>
      <button 
        className="calculator__memory-btn"
        onClick={onMemoryRecall}
        disabled={!hasMemory}
        data-tooltip="Memory Recall"
      >
        MR
      </button>
      <button 
        className="calculator__memory-btn"
        onClick={onMemoryAdd}
        data-tooltip="Memory Add"
      >
        M+
      </button>
      <button 
        className="calculator__memory-btn"
        onClick={onMemorySubtract}
        data-tooltip="Memory Subtract"
      >
        M-
      </button>
      <button 
        className="calculator__memory-btn"
        onClick={onMemoryStore}
        data-tooltip="Memory Store"
      >
        MS
      </button>
    </div>
  );
};

export default MemoryButtons;

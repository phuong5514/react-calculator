import { useEffect, useState, useCallback } from 'react';
import type { Operator } from '../utils/calculatorEngine';
import { useCalculator } from '../hooks/useCalculator';
import Display from './Display';
import MemoryButtons from './MemoryButtons';
import ButtonGrid from './ButtonGrid';
import HistorySidebar from './HistorySidebar';

const Calculator = () => {
  const [isDark, setIsDark] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const onHistoryUpdate = useCallback(() => {
    // Trigger refresh when calculation is made
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  const calculator = useCalculator(onHistoryUpdate);

  useEffect(() => {
    // Check for system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    // Keyboard event handler
    const handleKeyboard = (event: KeyboardEvent) => {
      // Ignore keyboard events from button clicks
      if (event.target instanceof HTMLButtonElement) {
        return;
      }

      const key = event.key;

      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        calculator.inputDigit(key);
      } else if (key === '.') {
        event.preventDefault();
        calculator.inputDecimal();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        event.preventDefault();
        const operatorMap: { [key: string]: Operator } = {
          '+': '+',
          '-': '-',
          '*': '×',
          '/': '÷'
        };
        calculator.inputOperator(operatorMap[key]);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculator.performCalculation();
      } else if (key === 'Escape') {
        event.preventDefault();
        calculator.clearAll();
      } else if (key === 'Backspace') {
        event.preventDefault();
        calculator.backspace();
      } else if (key === '%') {
        event.preventDefault();
        calculator.percentage();
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [calculator]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <>
      <div className="calculator">
        {/* Header */}
        <div className="calculator__header">
          <h2 className="calculator__title">Standard</h2>
          <div className="calculator__header-buttons">
            <button 
              className="calculator__history-toggle"
              onClick={toggleHistory}
              aria-label="Toggle history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button 
              className="calculator__theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Display */}
        <Display 
          value={calculator.state.displayValue}
          expression={calculator.state.expression}
          operator={calculator.state.operator}
          previousValue={calculator.state.previousValue}
          hasMemory={calculator.hasMemory}
          showError={calculator.showError}
          errorMessage={calculator.errorMessage}
        />

        {/* Memory Buttons */}
        <MemoryButtons 
          hasMemory={calculator.hasMemory}
          onMemoryClear={calculator.memoryClear}
          onMemoryRecall={calculator.memoryRecall}
          onMemoryAdd={calculator.memoryAdd}
          onMemorySubtract={calculator.memorySubtract}
          onMemoryStore={calculator.memoryStore}
        />

        {/* Button Grid */}
        <ButtonGrid 
          onDigit={calculator.inputDigit}
          onOperator={calculator.inputOperator}
          onDecimal={calculator.inputDecimal}
          onEquals={calculator.performCalculation}
          onClear={calculator.clear}
          onClearAll={calculator.clearAll}
          onBackspace={calculator.backspace}
          onPercentage={calculator.percentage}
          onNegate={calculator.negate}
          onSquareRoot={calculator.sqrt}
          onSquare={calculator.square}
          onReciprocal={calculator.reciprocal}
        />
      </div>

      {/* History Sidebar */}
      <HistorySidebar 
        isOpen={showHistory}
        onClose={toggleHistory}
        onSelectValue={(value: string, secondaryValue: string) => {
          // Replace the display value and expression
          calculator.replaceDisplay(value, secondaryValue);
        }}
        onMemoryUpdate={calculator.updateMemoryIndicator}
        onMemoryModify={(id: string, operation: 'add' | 'subtract') => {
          calculator.memoryModifyItem(id, operation);
        }}
        refreshTrigger={refreshTrigger}
      />
    </>
  );
};

export default Calculator;

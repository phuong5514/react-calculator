import { useState, useCallback, useRef } from 'react';
import { CalculatorEngine, type Operator, type CalculationState } from '../utils/calculatorEngine';
import { MemoryStorage } from '../utils/memoryStorage';
import { HistoryStorage } from '../utils/historyStorage';

export const useCalculator = (onHistoryUpdate?: () => void) => {
  const [state, setState] = useState<CalculationState>({
    displayValue: '0',
    previousValue: null,
    operator: null,
    waitingForOperand: false,
    expression: ''
  });

  const [hasMemory, setHasMemory] = useState(MemoryStorage.hasValue());
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Use ref to prevent double-add in StrictMode
  const historyAddedRef = useRef(false);

  const updateMemoryIndicator = useCallback(() => {
    setHasMemory(MemoryStorage.hasValue());
  }, []);

  const displayError = useCallback((message: string) => {
    setErrorMessage(message);
    setShowError(true);
    
    setTimeout(() => {
      setShowError(false);
    }, 2000);
  }, []);

  const inputDigit = useCallback((digit: string) => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          displayValue: digit,
          waitingForOperand: false
        };
      }
      
      return {
        ...prev,
        displayValue: prev.displayValue === '0' ? digit : prev.displayValue + digit
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          displayValue: '0.',
          waitingForOperand: false
        };
      }
      
      if (prev.displayValue.indexOf('.') === -1) {
        return {
          ...prev,
          displayValue: prev.displayValue + '.'
        };
      }
      
      return prev;
    });
  }, []);

  const inputOperator = useCallback((nextOperator: Operator) => {
    setState(prev => {
      const inputValue = CalculatorEngine.parseInput(prev.displayValue);

      if (prev.previousValue === null) {
        return {
          ...prev,
          previousValue: inputValue,
          operator: nextOperator,
          waitingForOperand: true,
          expression: ''
        };
      } else if (prev.operator) {
        try {
          const result = CalculatorEngine.calculate(prev.previousValue, inputValue, prev.operator);
          const formattedResult = CalculatorEngine.formatDisplay(result);
          
          // Add intermediate calculation to history (e.g., "1 + 1 = 2" when user presses "+")
          if (!historyAddedRef.current) {
            const expression = `${prev.previousValue} ${prev.operator} ${inputValue}`;
            HistoryStorage.add(expression, formattedResult);
            historyAddedRef.current = true;
            
            // Reset flag after a short delay
            setTimeout(() => {
              historyAddedRef.current = false;
            }, 0);
            
            // Notify history update
            if (onHistoryUpdate) {
              onHistoryUpdate();
            }
          }
          
          return {
            ...prev,
            displayValue: formattedResult,
            previousValue: result,
            operator: nextOperator,
            waitingForOperand: true,
            expression: ''
          };
        } catch (error) {
          displayError((error as Error).message);
          return prev;
        }
      }

      return prev;
    });
  }, [displayError, onHistoryUpdate]);

  const performCalculation = useCallback(() => {
    setState(prev => {
      if (prev.previousValue === null || !prev.operator) {
        return prev;
      }

      const inputValue = CalculatorEngine.parseInput(prev.displayValue);
      
      try {
        const result = CalculatorEngine.calculate(prev.previousValue, inputValue, prev.operator);
        const formattedResult = CalculatorEngine.formatDisplay(result);
        
        // Add to history only once using ref to prevent StrictMode double-execution
        if (!historyAddedRef.current) {
          const expression = `${prev.previousValue} ${prev.operator} ${inputValue}`;
          HistoryStorage.add(expression, formattedResult);
          historyAddedRef.current = true;
          
          // Reset flag after a short delay
          setTimeout(() => {
            historyAddedRef.current = false;
          }, 0);
          
          // Notify history update
          if (onHistoryUpdate) {
            onHistoryUpdate();
          }
        }
        
        return {
          displayValue: formattedResult,
          previousValue: null,
          operator: null,
          waitingForOperand: true,
          expression: ''
        };
      } catch (error) {
        displayError((error as Error).message);
        return {
          ...prev,
          previousValue: null,
          operator: null,
          waitingForOperand: true,
          expression: ''
        };
      }
    });
  }, [displayError, onHistoryUpdate]);

  const clear = useCallback(() => {
    setState(prev => ({
      ...prev,
      displayValue: '0'
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState({
      displayValue: '0',
      previousValue: null,
      operator: null,
      waitingForOperand: false,
      expression: ''
    });
  }, []);

  const backspace = useCallback(() => {
    setState(prev => {
      if (prev.displayValue.length > 1) {
        return {
          ...prev,
          displayValue: prev.displayValue.slice(0, -1)
        };
      }
      return {
        ...prev,
        displayValue: '0'
      };
    });
  }, []);

  const percentage = useCallback(() => {
    setState(prev => {
      const value = CalculatorEngine.parseInput(prev.displayValue);
      let result: number;
      
      // If there's a pending operation, calculate percentage of the previousValue
      if (prev.operator && prev.previousValue !== null) {
        result = (value / 100) * prev.previousValue;
      } else {
        // No pending operation, just divide by 100
        result = value / 100;
      }
      
      return {
        ...prev,
        displayValue: String(result),
        waitingForOperand: false
      };
    });
  }, []);

  const negate = useCallback(() => {
    setState(prev => {
      const value = CalculatorEngine.parseInput(prev.displayValue);
      return {
        ...prev,
        displayValue: String(-value)
      };
    });
  }, []);

  const sqrt = useCallback(() => {
    setState(prev => {
      try {
        const value = CalculatorEngine.parseInput(prev.displayValue);
        const result = CalculatorEngine.squareRoot(value);
        return {
          ...prev,
          expression: `√(${value})`,
          displayValue: CalculatorEngine.formatDisplay(result),
          waitingForOperand: true
        };
      } catch (error) {
        displayError((error as Error).message);
        return prev;
      }
    });
  }, [displayError]);

  const square = useCallback(() => {
    setState(prev => {
      try {
        const value = CalculatorEngine.parseInput(prev.displayValue);
        const result = CalculatorEngine.square(value);
        return {
          ...prev,
          expression: `sqr(${value})`,
          displayValue: CalculatorEngine.formatDisplay(result),
          waitingForOperand: true
        };
      } catch (error) {
        displayError((error as Error).message);
        return prev;
      }
    });
  }, [displayError]);

  const reciprocal = useCallback(() => {
    setState(prev => {
      try {
        const value = CalculatorEngine.parseInput(prev.displayValue);
        const result = CalculatorEngine.reciprocal(value);
        return {
          ...prev,
          expression: `1/(${value})`,
          displayValue: CalculatorEngine.formatDisplay(result),
          waitingForOperand: true
        };
      } catch (error) {
        displayError((error as Error).message);
        return prev;
      }
    });
  }, [displayError]);

  const memoryClear = useCallback(() => {
    MemoryStorage.clear();
    updateMemoryIndicator();
    
    // Trigger refresh for sidebar
    if (onHistoryUpdate) {
      onHistoryUpdate();
    }
  }, [updateMemoryIndicator, onHistoryUpdate]);

  const memoryRecall = useCallback(() => {
    const value = MemoryStorage.recall();
    
    // Replace display with recalled value
    setState(prev => ({
      ...prev,
      displayValue: String(value),
      waitingForOperand: true, // Next digit should replace this value
      previousValue: null,
      operator: null,
      expression: ''
    }));
  }, []);

  const memoryAdd = useCallback(() => {
    // Reset recall index since user is performing an operation
    MemoryStorage.resetRecallIndex();
    
    const value = CalculatorEngine.parseInput(state.displayValue);
    MemoryStorage.add(value);
    updateMemoryIndicator();
    
    // Trigger refresh for sidebar
    if (onHistoryUpdate) {
      onHistoryUpdate();
    }
  }, [state.displayValue, updateMemoryIndicator, onHistoryUpdate]);

  const memorySubtract = useCallback(() => {
    // Reset recall index since user is performing an operation
    MemoryStorage.resetRecallIndex();
    
    const value = CalculatorEngine.parseInput(state.displayValue);
    MemoryStorage.subtract(value);
    updateMemoryIndicator();
    
    // Trigger refresh for sidebar
    if (onHistoryUpdate) {
      onHistoryUpdate();
    }
  }, [state.displayValue, updateMemoryIndicator, onHistoryUpdate]);

  const memoryStore = useCallback(() => {
    // Reset recall index since user is performing an operation
    MemoryStorage.resetRecallIndex();
    
    const value = CalculatorEngine.parseInput(state.displayValue);
    MemoryStorage.store(value);
    updateMemoryIndicator();
    
    // Trigger refresh for sidebar
    if (onHistoryUpdate) {
      onHistoryUpdate();
    }
  }, [state.displayValue, updateMemoryIndicator, onHistoryUpdate]);

  const replaceDisplay = useCallback((value: string, expression: string = '') => {
    setState(prev => ({
      ...prev,
      displayValue: value,
      waitingForOperand: true,
      previousValue: null,
      operator: null,
      expression: expression
    }));
  }, []);

  const memoryModifyItem = useCallback((itemId: string, operation: 'add' | 'subtract') => {
    const value = CalculatorEngine.parseInput(state.displayValue);
    MemoryStorage.modifyItem(itemId, value, operation);
    updateMemoryIndicator();
    
    // Trigger refresh for sidebar
    if (onHistoryUpdate) {
      onHistoryUpdate();
    }
  }, [state.displayValue, updateMemoryIndicator, onHistoryUpdate]);

  return {
    state,
    hasMemory,
    showError,
    errorMessage,
    inputDigit,
    inputDecimal,
    inputOperator,
    performCalculation,
    clear,
    clearAll,
    backspace,
    percentage,
    negate,
    sqrt,
    square,
    reciprocal,
    memoryClear,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    memoryStore,
    updateMemoryIndicator,
    replaceDisplay,
    memoryModifyItem
  };
};

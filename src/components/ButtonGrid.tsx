import type { Operator } from '../utils/calculatorEngine';

interface ButtonGridProps {
  onDigit: (digit: string) => void;
  onOperator: (operator: Operator) => void;
  onDecimal: () => void;
  onEquals: () => void;
  onClear: () => void;
  onClearAll: () => void;
  onBackspace: () => void;
  onPercentage: () => void;
  onNegate: () => void;
  onSquareRoot: () => void;
  onSquare: () => void;
  onReciprocal: () => void;
}

const ButtonGrid = ({
  onDigit,
  onOperator,
  onDecimal,
  onEquals,
  onClear,
  onClearAll,
  onBackspace,
  onPercentage,
  onNegate,
  onSquareRoot,
  onSquare,
  onReciprocal
}: ButtonGridProps) => {
  return (
    <div className="calculator__buttons">
      {/* Row 1 */}
      <button 
        className="calculator__button calculator__button--operator"
        onClick={onPercentage}
      >
        %
      </button>
      <button 
        className="calculator__button calculator__button--operator"
        onClick={onClear}
        data-tooltip="Clear Entry"
      >
        CE
      </button>
      <button 
        className="calculator__button calculator__button--operator"
        onClick={onClearAll}
        data-tooltip="Clear"
      >
        C
      </button>
      <button 
        className="calculator__button calculator__button--operator"
        onClick={onBackspace}
        data-tooltip="Backspace"
      >
        ⌫
      </button>
      
      {/* Row 2 */}
      <button 
        className="calculator__button calculator__button--operator"
        onClick={onReciprocal}
        data-tooltip="Reciprocal"
      >
        1/x
      </button>
      <button 
        className="calculator__button calculator__button--operator"
        onClick={onSquare}
        data-tooltip="Square"
      >
        x²
      </button>
      <button 
        className="calculator__button calculator__button--operator"
        onClick={onSquareRoot}
        data-tooltip="Square Root"
      >
        √x
      </button>
      <button 
        className="calculator__button calculator__button--operator"
        onClick={() => onOperator('÷')}
      >
        ÷
      </button>
      
      {/* Row 3 */}
      <button className="calculator__button" onClick={() => onDigit('7')}>7</button>
      <button className="calculator__button" onClick={() => onDigit('8')}>8</button>
      <button className="calculator__button" onClick={() => onDigit('9')}>9</button>
      <button 
        className="calculator__button calculator__button--operator"
        onClick={() => onOperator('×')}
      >
        ×
      </button>
      
      {/* Row 4 */}
      <button className="calculator__button" onClick={() => onDigit('4')}>4</button>
      <button className="calculator__button" onClick={() => onDigit('5')}>5</button>
      <button className="calculator__button" onClick={() => onDigit('6')}>6</button>
      <button 
        className="calculator__button calculator__button--operator"
        onClick={() => onOperator('-')}
      >
        −
      </button>
      
      {/* Row 5 */}
      <button className="calculator__button" onClick={() => onDigit('1')}>1</button>
      <button className="calculator__button" onClick={() => onDigit('2')}>2</button>
      <button className="calculator__button" onClick={() => onDigit('3')}>3</button>
      <button 
        className="calculator__button calculator__button--operator"
        onClick={() => onOperator('+')}
      >
        +
      </button>
      
      {/* Row 6 */}
      <button 
        className="calculator__button calculator__button--operator"
        onClick={onNegate}
        data-tooltip="Negate"
      >
        +/-
      </button>
      <button className="calculator__button" onClick={() => onDigit('0')}>0</button>
      <button className="calculator__button" onClick={onDecimal}>.</button>
      <button 
        className="calculator__button calculator__button--equals"
        onClick={onEquals}
      >
        =
      </button>
    </div>
  );
};

export default ButtonGrid;

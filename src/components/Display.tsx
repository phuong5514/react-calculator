interface DisplayProps {
  value: string;
  expression: string;
  operator: string | null;
  previousValue: number | null;
  hasMemory: boolean;
  showError: boolean;
  errorMessage: string;
}

const Display = ({ value, expression, operator, previousValue, hasMemory, showError, errorMessage }: DisplayProps) => {
  const getExpressionDisplay = () => {
    if (showError) {
      return errorMessage;
    }
    
    // If we have a special expression set (from sqrt, square, reciprocal), show it
    if (expression && !operator) {
      return expression;
    } 
    // Otherwise show the ongoing calculation
    else if (previousValue !== null && operator) {
      return `${previousValue} ${operator}`;
    } 
    // Clear if nothing to show
    return '';
  };

  return (
    <div className="calculator__display">
      <div className="display__memory">
        {hasMemory ? 'M' : ''}
      </div>
      <div className={`display__expression ${showError ? 'display__expression--error' : ''}`}>
        {getExpressionDisplay()}
      </div>
      <div className="display__value">
        {value}
      </div>
    </div>
  );
};

export default Display;

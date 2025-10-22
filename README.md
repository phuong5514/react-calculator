# React Calculator

A modern, feature-rich calculator application built with React, TypeScript, and Tailwind CSS. Inspired by the Windows 11 calculator design with full functionality including memory storage, calculation history, and keyboard support.

## Features

### Core Functionality
- ✅ **Basic Arithmetic Operations**: Addition, subtraction, multiplication, division
- ✅ **Advanced Operations**: Percentage, square root, square, reciprocal
- ✅ **Precision Handling**: Correctly handles JavaScript floating-point issues (e.g., 0.1 + 0.2 = 0.3)
- ✅ **Error Handling**: Proper handling of division by zero, invalid inputs, etc.
- ✅ **Result Precision**: 5 decimal places for accurate calculations

### Memory System
- ✅ **Memory Clear (MC)**: Clear all memory
- ✅ **Memory Recall (MR)**: Retrieve stored value
- ✅ **Memory Add (M+)**: Add current value to memory
- ✅ **Memory Subtract (M-)**: Subtract current value from memory
- ✅ **Memory Store (MS)**: Store current value to memory
- ✅ **Memory List**: View all stored memory values (latest first)
- ✅ **Persistent Storage**: Memory values persist across sessions

### Calculation History
- ✅ **History Tracking**: Automatically saves all calculations
- ✅ **History List**: View all past calculations
- ✅ **History Recall**: Click any history item to use its result
- ✅ **Clear History**: Remove all history entries
- ✅ **Persistent Storage**: History persists across sessions
- ✅ **Limit**: Stores up to 100 history items

### User Interface
- ✅ **Windows 11 Inspired Design**: Clean, modern interface
- ✅ **Dark/Light Mode**: Toggle between themes with smooth transitions
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Two-Line Display**: 
  - Expression line: Shows current operation or error messages
  - Result line: Shows input or calculation result
- ✅ **Memory Indicator**: Shows "M" when memory has stored values
- ✅ **Tooltips**: Hover over buttons to see full descriptions
- ✅ **Box Shadows**: Enhanced depth and visual hierarchy

### Keyboard Support
- ✅ **Numbers**: `0-9` keys
- ✅ **Operators**: `+`, `-`, `*`, `/`
- ✅ **Decimal**: `.` key
- ✅ **Equals**: `Enter` or `=` key
- ✅ **Clear All**: `Escape` key
- ✅ **Backspace**: `Backspace` key
- ✅ **Percentage**: `%` key

### Controls
- ✅ **CE (Clear Entry)**: Clear current input
- ✅ **C (Clear)**: Clear all (reset calculator)
- ✅ **⌫ (Backspace)**: Delete last digit
- ✅ **+/- (Negate)**: Toggle positive/negative

## Technology Stack

- **Frontend Framework**: React 19.1
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1
- **Build Tool**: Vite 7.1
- **Testing**: Vitest 3.2 + React Testing Library
- **State Management**: React Hooks
- **Storage**: localStorage API

## Installation

1. Navigate to the project directory:
```bash
cd react-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once
- `npm run lint` - Run ESLint

## Testing

The project includes comprehensive unit tests covering:
- Calculator engine operations
- Memory storage functionality
- History management
- Edge cases and error handling
- Floating-point precision

Run tests with:
```bash
npm test
```

View test UI:
```bash
npm run test:ui
```

See [TEST_REPORT.md](./TEST_REPORT.md) for detailed test cases and results.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## License

MIT License - feel free to use this project for learning or commercial purposes.

import type { CalculatorResult } from './utils/calc';

import React, { useState } from 'react';
import { calculateOdds } from './utils/calc';
import Result from './components/Result';
import Line from './components/Line';

import './App.css';
const App: React.FC = () => {
  const [totalBallCount, setTotalBallCount] = useState<number>(42);
  const [takeBallCount, setTakeBallCount] = useState<number>(6);
  const [specialBallCount, setSpecialBallCount] = useState<number>(1);
  const [reduce, setReduce] = useState<number>(0.7);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showLine, setShowLine] = useState<boolean>(false);

  const handleCalculate = () => {
    const data = {
      totalBallCount,
      takeBallCount,
      specialBallCount,
      reduce
    };
    const odds = calculateOdds(data);
    setResult(odds);
  };

  return (
    <div className="container">
      <div className="control-panel">
        <h1>六合彩賠率計算器</h1>
        <div className="form-group">
          <label>
            總球數：
          </label>
          <input
            type="number"
            value={totalBallCount}
            step={1}
            onChange={(e) => setTotalBallCount(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>
            取球數：
          </label>

          <input
            type="number"
            value={takeBallCount}
            step={1}
            onChange={(e) => setTakeBallCount(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>
            特別號數：
          </label>
          <input
            type="number"
            value={specialBallCount}
            step={1}
            onChange={(e) => setSpecialBallCount(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>
            賠率折扣：
          </label>
          <input
            type="number"
            value={reduce}
            step={0.01}
            onChange={(e) => setReduce(Number(e.target.value))}
          />
        </div>
        <button onClick={handleCalculate}>計算</button>
        <button onClick={() => setShowLine(!showLine)}>顯示特三線表(再按一次關閉)</button>
      </div>

      {showLine && <Line />}
      {result && <Result result={result} />}
    </div>

  );
};

export default App;
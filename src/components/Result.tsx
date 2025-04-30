import React from 'react';
import './Result.css';
import type { CalculatorResult } from '../utils/calc';

interface ResultProps {
  result: CalculatorResult;
}

// 三個主項 分別用來顯示 賠率 賠率減少 機率
// 每一個主項中有
//   一個table 顯示 234興 全車 特瑪 天碰
//   一個額外的table 顯示台號表
//   一個額外的table 顯示特三尾線表

const Result: React.FC<ResultProps> = ({ result }) => {
  const mainItems = ['odds', 'oddsReduce', 'probabilities'] as const;
  const titles = {
    odds: '賠率',
    oddsReduce: '折扣後賠率',
    probabilities: '機率'
  }

  type MainItem = typeof mainItems[number];
  // 0 ~ 9 array
  const numbers = Array.from({ length: 10 }, (_, i) => i);

  console.log(result);
  return (
    <div className="result">
      {mainItems.map((item: MainItem) => {
        // 設定小數位數
        let decimalPlaces = 2;
        if (item === 'probabilities') {
          decimalPlaces = 6;
        }

        return (
          <div className="main-item" key={item}>
            <h2>{titles[item]}</h2>
            <h3>234星</h3>
            <table>
              <tbody>
                <tr>
                  <td colSpan={3}>星</td>
                  <td>全車</td>
                  <td>特碼</td>
                  <td colSpan={2}>天碰</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td></td>
                  <td></td>
                  <td>2</td>
                  <td>3</td>
                </tr>
                <tr>
                  <td>{result.star[item][2].toFixed(decimalPlaces)}</td>
                  <td>{result.star[item][3].toFixed(decimalPlaces)}</td>
                  <td>{result.star[item][4].toFixed(decimalPlaces)}</td>
                  <td>{result.allCar[item].toFixed(decimalPlaces)}</td>
                  <td>{result.special[item].toFixed(decimalPlaces)}</td>
                  <td>{result.specialStar[item][2].toFixed(decimalPlaces)}</td>
                  <td>{result.specialStar[item][3].toFixed(decimalPlaces)}</td>
                </tr>
              </tbody>
            </table>

            <h3>台號表</h3>
            <table>
              <tbody>
                <tr>
                  <td>台號</td>
                  {numbers.map((number) => (
                    <td key={number}>{number}</td>
                  ))}
                </tr>
                {numbers.map((secondNumber) => (
                  <tr key={secondNumber}>
                    <td>{secondNumber}</td>
                    {numbers.map((firstNumber) => (
                      <td key={firstNumber}>{result.table[item][firstNumber][secondNumber].toFixed(decimalPlaces)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>


            <h3>特三線</h3>
            {/* 如果有info表示有問題 不顯示 */}
            {result.specialThree.info === '' ? (
              <table>
                <tbody>
                  {Object.keys(result.specialThree[item]).map((key) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{result.specialThree[item][Number(key)].toFixed(decimalPlaces)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>{result.specialThree.info}</p>
            )}
          </div>
        )
      })}


    </div>
  );
};

export default Result; 
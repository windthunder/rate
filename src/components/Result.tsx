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
  const mainItems = ['odds', 'oddsReduce', 'oddsReduce2', 'probabilities'] as const;
  const titles = {
    odds: '賠率',
    oddsReduce: '折扣後賠率 賠率 * 折扣',
    oddsReduce2: '折扣後賠率2 (賠率 - 1) * 折扣 + 1',
    probabilities: '機率'
  }

  type MainItem = typeof mainItems[number];
  // 0 ~ 9 array
  const numbers = Array.from({ length: 10 }, (_, i) => i);

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
                  <td colSpan={4}>星</td>
                  <td>全車</td>
                  <td>特碼</td>
                  <td colSpan={2}>天碰</td>
                  <td colSpan={8}>反轉樂</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                  <td></td>
                  <td></td>
                  <td>2</td>
                  <td>3</td>
                  <td>5</td>
                  <td>6</td>
                  <td>7</td>
                  <td>8</td>
                  <td>9</td>
                  <td>10</td>
                  <td>11</td>
                  <td>12</td>
                </tr>
                <tr>
                  <td>{result.star[item][2].toFixed(decimalPlaces)}</td>
                  <td>{result.star[item][3].toFixed(decimalPlaces)}</td>
                  <td>{result.star[item][4].toFixed(decimalPlaces)}</td>
                  <td>{result.star[item][5].toFixed(decimalPlaces)}</td>
                  <td>{result.allCar[item].toFixed(decimalPlaces)}</td>
                  <td>{result.special[item].toFixed(decimalPlaces)}</td>
                  <td>{result.specialStar[item][2].toFixed(decimalPlaces)}</td>
                  <td>{result.specialStar[item][3].toFixed(decimalPlaces)}</td>
                  <td>{result.notHit[item][5].toFixed(decimalPlaces)}</td>
                  <td>{result.notHit[item][6].toFixed(decimalPlaces)}</td>
                  <td>{result.notHit[item][7].toFixed(decimalPlaces)}</td>
                  <td>{result.notHit[item][8].toFixed(decimalPlaces)}</td>
                  <td>{result.notHit[item][9].toFixed(decimalPlaces)}</td>
                  <td>{result.notHit[item][10].toFixed(decimalPlaces)}</td>
                  <td>{result.notHit[item][11].toFixed(decimalPlaces)}</td>
                  <td>{result.notHit[item][12].toFixed(decimalPlaces)}</td>
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
                {numbers.map((firstNumber) => (
                  <tr key={firstNumber}>
                    <td>{firstNumber}X</td>
                    {numbers.map((secondNumber) => (
                      <td key={secondNumber}>{result.table[item][firstNumber][secondNumber].toFixed(decimalPlaces)}</td>
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
                  <tr>
                    <td>線數</td>
                    <td>基礎賠率</td>
                    <td>組數</td>
                    <td>組數 x 賠率</td>
                  </tr>
                  {Object.keys(result.specialThree[item]).map((key) => {
                    const keyNumber = Number(key);
                    const rate = result.specialThree[item][keyNumber];
                    const group = (11 - Math.abs(11 - keyNumber) - 1) * 10;
                    return (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{rate.toFixed(decimalPlaces)}</td>
                        <td>
                          {group}
                        </td>
                        <td>
                          {(group * rate).toFixed(decimalPlaces)}
                        </td>
                      </tr>
                    )
                  })}
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
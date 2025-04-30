import React from 'react';
import './Line.css';

const getResult = () => {
  const result: { [key: number]: number[][] } = {};

  for (let firstNumber = 0; firstNumber < 10; firstNumber++) {
    for (let secondNumber = 0; secondNumber < 10; secondNumber++) {
      for (let thirdNumber = 0; thirdNumber < 10; thirdNumber++) {
        let a = secondNumber - firstNumber;
        if (a <= 0) {
          a = 10 + a;
        }
        let b = thirdNumber - secondNumber;
        if (b <= 0) {
          b = 10 + b;
        }
        const key = a + b;
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push([firstNumber, secondNumber, thirdNumber]);
      }
    }
  }

  return result;
}

const Line: React.FC = () => {
  const result = getResult();

  console.log(result);

  return (
    <div className="line">
      <table>
        <tbody>
          {Object.keys(result).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>
                {result[Number(key)].map((item, index) => {
                  if (index % 26 === 0 && index !== 0) {
                    return (
                      <>
                        <br />
                        <span className="line-item">{item.join('')}</span>
                      </>
                    )
                  } else {
                    return (
                      <span className="line-item" key={item.join('')}>
                        {item.join('')}
                      </span>
                    )
                  }
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 組件內容將在這裡 */}
    </div>
  );
};

export default Line; 
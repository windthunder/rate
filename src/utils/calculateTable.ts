/** 台號計算
 * @param totalBallCount 總球數
 * @param takeBallCount 取球數
 * @returns 台號機率表
 *
*/

// TODO: 二次中獎 甚至三次中獎的狀況的可能性追加
import { combination } from './math';

const calculateProbabilityTable = (result: number[][], totalBallCount: number, takeBallCount: number): number[][] => {
  const totalCombinations = combination(totalBallCount, takeBallCount);

  const probabilityTable = Array(10).fill(0).map(() => Array(10).fill(0));

  // 將result的每個元素除以總組合數
  // 因為result確定是個位數值得結果 所以for的範圍是0~9
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      probabilityTable[i][j] = result[i][j] / totalCombinations;
    }
  }

  return probabilityTable;
}

const convertIntermediateToResult = (intermediateResult: number[][][], totalBallCount: number, takeBallCount: number): number[][] => {
  const resultTable = Array(10).fill(0).map(() => Array(10).fill(0));

  // 將中間的全組合數表轉換成台號組合表
  for (let position = 1; position < takeBallCount; position++) {
    for (let firstNumber = 1; firstNumber < totalBallCount; firstNumber++) {
      for (let secondNumber = firstNumber + 1; secondNumber < totalBallCount; secondNumber++) {
        const count = intermediateResult[position][firstNumber][secondNumber];
        resultTable[firstNumber % 10][secondNumber % 10] += count;
      }
    }
  }

  return resultTable;
}

/**
 * 計算中間結果
 * @param totalBallCount 總球數
 * @param takeBallCount 取球數
 * @returns 中間結果 在所有位置連續那兩個數出現的可能組合 這個方便驗算 後面再轉換成台號需要的結構
 */
const calculateIntermediateResult = (totalBallCount: number, takeBallCount: number) => {
  // 初始化三維陣列
  const intermediateResult: number[][][] = Array(takeBallCount + 1)
    .fill(0)
    .map(() =>
      Array(totalBallCount + 1)
        .fill(0)
        .map(() =>
          Array(totalBallCount + 1).fill(0)
        )
    );


  for (let position = 1; position < takeBallCount; position++) {
    for (let firstNumber = 1; firstNumber <= totalBallCount; firstNumber++) {
      // 第一數小於 position的狀況 跳過 不可能發生
      if (firstNumber < position) {
        continue;
      }

      // 第一數大於 totalBallCount - takeBallCount + 1的狀況 中止 因為這不可能正常完成排序
      if (firstNumber > totalBallCount - takeBallCount + position) {
        break;
      }
      for (let secondNumber = firstNumber + 1; secondNumber <= totalBallCount; secondNumber++) {
        // 第二數大於 totalBallCount - takeBallCount + 2的狀況 中止 因為這不可能正常完成排序
        if (secondNumber > totalBallCount - takeBallCount + position + 1) {
          break;
        }
        // 計算可能的組合數
        const combinationCount =
          combination(firstNumber - 1, position - 1) * // 也就是第一個數字前面比它小的數字的總組合數
          combination(totalBallCount - secondNumber, takeBallCount - position - 1); // 也就是第二個數字後面比它大的數字的總組合數

        intermediateResult[position][firstNumber][secondNumber] = combinationCount;
      }
    }
  }

  // 輸出中間結果進行驗算
  return intermediateResult;
}

export const calculateTable = (totalBallCount: number, takeBallCount: number) => {
  // takBallCount不能小於2 直接報錯
  if (takeBallCount < 2) {
    throw new Error('takeBallCount不能小於2');
  }
  const intermediateResult = calculateIntermediateResult(totalBallCount, takeBallCount);
  const resultTable = convertIntermediateToResult(intermediateResult, totalBallCount, takeBallCount);
  return calculateProbabilityTable(resultTable, totalBallCount, takeBallCount);
}

/** 台號計算
 * @param totalBallCount 總球數
 * @param takeBallCount 取球數
 * @returns 台號機率表
 *
*/

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

  // const probabilityTable = result;

  return probabilityTable;
}


/**
 * 計算中間結果
 * @param totalBallCount 總球數
 * @param takeBallCount 取球數
 * @returns 中間結果 在所有位置連續那兩個數出現的可能組合 這個方便驗算 後面再轉換成台號需要的結構
 */
/** 遞迴函數來生成所有可能的組合
 * @param totalBallCount 總球數
 * @param takeBallCount 取球數
 * @returns 所有可能的組合 [[1,2,3,4,5,6], [1,2,3,4,5,7], ...] 這樣的結果
 *
*/
export const generateCombinations = (
  totalBallCount: number,
  takeBallCount: number,
  callback: (combination: number[]) => void
) => {
  const stack: { current: number[], start: number }[] = [];

  // 初始化堆疊
  stack.push({ current: [], start: 1 });

  while (stack.length > 0) {
    const { current, start } = stack.pop()!;

    if (current.length === takeBallCount) {
      callback([...current]);
      continue;
    }

    // 從大到小遍歷，這樣pop出來的順序會是從小到大
    for (let i = totalBallCount; i >= start; i--) {
      stack.push({ current: [...current, i], start: i + 1 });
    }
  }
};

/**
 * 計算中間結果2
 * @param totalBallCount 總球數
 * @param takeBallCount 取球數
 * @returns 中間結果2 在所有位置連續那兩個數出現的可能組合 這個方便驗算 後面再轉換成台號需要的結構
 */
const calculateResult = (totalBallCount: number, takeBallCount: number) => {
  // 先列出所有可能的組合
  const tableResult: number[][] = Array(10).fill(0).map(() => Array(10).fill(0));

  generateCombinations(totalBallCount, takeBallCount, (combination) => {
    // 取得所有個位數
    const digits = combination.map(num => num % 10);
    // 組合出台號
    const tableNumbers: string[] = [];
    digits.forEach((digit, index) => {
        const nextDigit = digits[index + 1];
        if (nextDigit === undefined) { // nextDigit 有可能是0 但那是正常的
            return;
        }
        tableNumbers.push(digit.toString() + nextDigit.toString());
    });

    // 現在tableNumbers 是台號的string 陣列 將她轉換成台號 - 數量hash
    const tableNumberHash: Record<string, number> = {};
    tableNumbers.forEach(tableNumber => {
      tableNumberHash[tableNumber] = (tableNumberHash[tableNumber] || 0) + 1;
      // 如果數量超過2則等於2
      if (tableNumberHash[tableNumber] > 2) {
        tableNumberHash[tableNumber] = 2;
      }
    });

    // 拆解台號
    for (const [tableNumberString, count] of Object.entries(tableNumberHash)) {
      // 如果數量是2則等於2
      const tableNumber = tableNumberString.split('').map(Number);
      tableResult[tableNumber[0]][tableNumber[1]] += count;
    }

  });
  return tableResult;
}

export const calculateTable = (totalBallCount: number, takeBallCount: number) => {
  // takBallCount不能小於2 直接報錯
  if (takeBallCount < 2) {
    throw new Error('takeBallCount不能小於2');
  }
  const result = calculateResult(totalBallCount, takeBallCount);
  return calculateProbabilityTable(result, totalBallCount, takeBallCount);
}

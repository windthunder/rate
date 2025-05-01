import { combination } from "./math";

const calcResult = (allPossible: number[][][], totalBallCount: number): { [key: number]: number } => {
  const result: { [key: number]: number } = {};
  for (let firstNumber = 1; firstNumber <= totalBallCount; firstNumber++) {
    for (let secondNumber = firstNumber + 1; secondNumber <= totalBallCount; secondNumber++) {
      for (let thirdNumber = secondNumber + 1; thirdNumber <= totalBallCount; thirdNumber++) {
        let a = (secondNumber % 10) - (firstNumber % 10)
        if (a <= 0) {
          a += 10;
        }
        let b = (thirdNumber % 10) - (secondNumber % 10)
        if (b <= 0) {
          b += 10;
        }
        const key = a + b;
        if (result[key]) {
          result[key] += allPossible[firstNumber][secondNumber][thirdNumber];
        } else {
          result[key] = allPossible[firstNumber][secondNumber][thirdNumber];
        }
      }
    }
  }
  return result;
};

const calcProbability = (result: { [key: number]: number }, totalBallCount: number, takeBallCount: number): { [key: number]: number } => {
  const totalCombinations = combination(totalBallCount, takeBallCount);
  const probability: { [key: number]: number } = {};
  for (const key in result) {
    probability[Number(key)] = result[Number(key)] / totalCombinations;
  }
  return probability;
};


const calcAllPossible = (totalBallCount: number, takeBallCount: number): number[][][] => {
  // 計算所有可能的組合數

  // 先準備整個array fill all 0
  // 因為球號從1開始 所以totalBallCount + 1
  const allCombinations: number[][][] = Array(totalBallCount + 1).fill(0).map(
    () => Array(totalBallCount + 1).fill(0).map(
      () => Array(totalBallCount + 1).fill(0)
    )
  );

  // 五球狀況 取234 6球狀況 取345
  // 雖然兩邊幾乎一樣 但因為規則不確定 分開計算 不使用某種方式整合
  if (takeBallCount === 5) {
    // 取234
    for (let firstNumber = 1; firstNumber <= totalBallCount; firstNumber++) {
      // 因為前面還有一個數字 所以不能小於2
      if (firstNumber < 2) {
        continue;
      }
      // 因為後面還有3個數字 所以不能大於 totalBallCount - 3
      if (firstNumber > totalBallCount - 3) {
        break;
      }

      for (let secondNumber = firstNumber + 1; secondNumber <= totalBallCount; secondNumber++) {
        // 因為後面還有2個數字 所以不能大於 totalBallCount - 2
        if (secondNumber > totalBallCount - 2) {
          break;
        }
        for (let thirdNumber = secondNumber + 1; thirdNumber <= totalBallCount; thirdNumber++) {
          // 因為後面還有1個數字 所以不能大於 totalBallCount - 1
          if (thirdNumber > totalBallCount - 1) {
            break;
          }
          // 前面的可能性
          const beforeCombination = combination(firstNumber - 1, 1);
          // 後面的可能性
          const afterCombination = combination(totalBallCount - thirdNumber, 1);
          allCombinations[firstNumber][secondNumber][thirdNumber] = beforeCombination * afterCombination;
        }
      }
    }
  } else if (takeBallCount === 6) {
    // 取345
    for (let firstNumber = 1; firstNumber < totalBallCount; firstNumber++) {
      // 因為前面還有2個數字 所以不能小於3
      if (firstNumber < 3) {
        continue;
      }

      // 因為後面還有3個數字 所以不能大於 totalBallCount - 3
      if (firstNumber > totalBallCount - 3) {
        break;
      }

      for (let secondNumber = firstNumber + 1; secondNumber < totalBallCount; secondNumber++) {
        // 因為後面還有2個數字 所以不能大於 totalBallCount - 2
        if (secondNumber > totalBallCount - 2) {
          break;
        }

        for (let thirdNumber = secondNumber + 1; thirdNumber < totalBallCount; thirdNumber++) {
          // 因為後面還有1個數字 所以不能大於 totalBallCount - 1
          if (thirdNumber > totalBallCount - 1) {
            break;
          }
          // 前面的可能性
          const beforeCombination = combination(firstNumber - 1, 2);
          // 後面的可能性
          const afterCombination = combination(totalBallCount - thirdNumber, 1);
          allCombinations[firstNumber][secondNumber][thirdNumber] = beforeCombination * afterCombination;
          console.log(firstNumber, secondNumber, thirdNumber, allCombinations[firstNumber][secondNumber][thirdNumber]);
        }
      }
    }
  }
  return allCombinations;
};

/**
 * 計算特三的機率
 * @param totalBallCount 總球數
 * @param takeBallCount 取球數
 * @returns 特三的機率
 */
export const calcSpecialThree = (totalBallCount: number, takeBallCount: number): { [key: number]: number } => {
  // 驗證takeballcount是否為5或6 因為除此之外的條件不明
  if (takeBallCount !== 5 && takeBallCount !== 6) {
    throw new Error('總取球數必須為5或6');
  }

  // 先展開所有可能性
  const allPossible = calcAllPossible(totalBallCount, takeBallCount);
  // 再組合成結果
  const result = calcResult(allPossible, totalBallCount);
  // 再計算機率
  const probability = calcProbability(result, totalBallCount, takeBallCount);
  return probability;
};

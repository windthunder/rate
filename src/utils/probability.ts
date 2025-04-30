import { combination } from './math';

/**
 * 計算樂透彩開獎後排序這個條件下 每個位置每個數字的機率
 * @param {number} totalBalls - 總球數
 * @param {number} drawBalls - 取球數
 * @returns {number[][]} - 二維陣列，result[position][number] = probability
 * 注意 這個array的index是從1開始 所以result[1][1] 是第一個位置01的機率
 */
export const calculateLottoProbabilities = (totalBalls: number, drawBalls: number): number[][] => {
  const result: number[][] = Array(drawBalls + 1).fill(null).map(() => Array(totalBalls + 1).fill(0));
  const totalCombinations = combination(totalBalls, drawBalls);

  // 計算每個位置的機率
  for (let position = 1; position <= drawBalls; position++) {
    // 計算每個數字的機率
    for (let number = position; number <= totalBalls - drawBalls + position; number++) {
      const before = combination(number - 1, position - 1);
      const after = combination(totalBalls - number, drawBalls - position);
      const probability = (before * after) / totalCombinations;
      result[position][number] = probability;
    }
  }

  return result;
};

/**
 * 將機率結果格式化為表格形式
 * @param {number[][]} probabilities - 二維機率陣列
 * @param {number} totalBalls - 總球數
 * @param {number} drawBalls - 取球數
 * @returns {string} - 格式化後的表格字串
 */
export const formatAsTable = (probabilities: number[][], totalBalls: number, drawBalls: number): string => {
  // 建立表格標題
  let table = '位置\\數字\t';
  for (let num = 1; num <= totalBalls; num++) {
    table += `${num}\t`;
  }
  table += '\n';

  // 建立表格內容
  for (let pos = 1; pos <= drawBalls; pos++) {
    table += `第${pos}位\t`;
    for (let num = 1; num <= totalBalls; num++) {
      const probability = probabilities[pos][num];
      table += `${probability.toFixed(6)}\t`;
    }
    table += '\n';
  }

  return table;
};

// 測試範例
export const test = () => {
  const totalBalls = 42;
  const drawBalls = 6;
  const probabilities = calculateLottoProbabilities(totalBalls, drawBalls);
  const table = formatAsTable(probabilities, totalBalls, drawBalls);
  console.log(table);
};
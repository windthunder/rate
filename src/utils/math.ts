/**
 * 計算組合數（M取N）
 * @param m 總數
 * @param n 取數
 * @returns 組合數
 */
export const combination = (m: number, n: number): number => {
  // 如果m或n是負數 報錯
  if (m < 0 || n < 0) {
    throw new Error(`m 或 n 不能是負數 m: ${m} n: ${n}`);
  }

  // 如果n大於m 回傳0
  if (n > m) return 0;

  // 如果n是0或m 回傳1
  if (n === 0 || n === m) return 1;

  // 如果n是1 回傳m
  if (n === 1) return m;

  let result = 1;
  // 先乘再除確保他是整數
  for (let i = 0; i < n; i++) {
    result *= m - i;
  }
  for (let i = 0; i < n; i++) {
    result /= n - i;
  }
  
  return result;
}; 
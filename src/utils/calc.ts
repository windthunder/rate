/**
 * 主計算器
 */

import { combination } from './math';
import { calculateTable } from './calculateTable';
import { calcSpecialThree } from './calcSpecialThree';


export interface CalculatorInput {
  totalBallCount: number;
  takeBallCount: number;
  specialBallCount: number;
  reduce: number;
}

export interface CalculatorResult {
  star: {
    probabilities: { [key: number]: number };
    odds: { [key: number]: number };
    oddsReduce: { [key: number]: number };
    info: string;
  };

  allCar: {
    probabilities: number;
    odds: number;
    oddsReduce: number;
    info: string;
  };

  special: {
    probabilities: number;
    odds: number;
    oddsReduce: number;
    info: string;
  };

  specialStar: {
    probabilities: { [key: number]: number };
    odds: { [key: number]: number };
    oddsReduce: { [key: number]: number };
    info: string;
  };

  notHit: {
    probabilities: { [key: number]: number };
    odds: { [key: number]: number };
    oddsReduce: { [key: number]: number };
    info: string;
  };

  table: {
    probabilities: number[][];
    odds: number[][];
    oddsReduce: number[][];
    info: string;
  };

  specialThree: {
    probabilities: { [key: number]: number };
    odds: { [key: number]: number };
    oddsReduce: { [key: number]: number };
    info: string;
  };
}

/**
 * 計算N星的機率
 * @param totalBallCount 總球數
 * @param takeBallCount 取球數
 * @param star 星數
 * @returns N星的機率
 */
const calcStar = (totalBallCount: number, takeBallCount: number, star: number): number => {
  return combination(takeBallCount, star) / combination(totalBallCount, star);
};


/**
 * @param data 計算各種六合彩玩法的基礎賠率
 * @param data.totalBallCount 總球數
 * @param data.takeBallCount 取球數
 * @param data.specialBallCount 特別號數量
 * @param data.reduce 賠率折扣
 * @returns 各種六合彩玩法的基礎賠率
 */
export const calculateOdds = (data: CalculatorInput): CalculatorResult => {
  const { totalBallCount, takeBallCount, specialBallCount, reduce } = data;

  // 2~5星機率
  const starProbabilities: { [key: number]: number } = {};
  const starOdds: { [key: number]: number } = {};
  const starOddsReduce: { [key: number]: number } = {};
  let starInfo: string = '';
  try {
    for (let i = 2; i <= 5; i++) {
      const starProbability = calcStar(totalBallCount, takeBallCount, i);
      starProbabilities[i] = starProbability;
      starOdds[i] = 1 / starProbability;
      starOddsReduce[i] = starOdds[i] * reduce;

    }
  } catch (error) {
    starInfo = (error as Error).message;
  }

  // 特碼 也就是選一個數字 這個數字是特別號的機率
  let specialProbability: number = 0;
  let specialCodeOdds: number = 0;
  let specialCodeOddsReduce: number = 0;
  let specialInfo: string = '';
  try {
    specialProbability = specialBallCount / totalBallCount;
    specialCodeOdds = 1 / specialProbability;
    specialCodeOddsReduce = specialCodeOdds * reduce;
  } catch (error) {
    specialInfo = (error as Error).message;
  }

  const notHitProbabilities: { [key: number]: number } = {};
  const notHitOdds: { [key: number]: number } = {};
  const notHitOddsReduce: { [key: number]: number } = {};
  let notHitInfo: string = '';
  try {
    // 5~12選不中
    for (let i = 5; i <= 12; i++) {
      const notHitProbability = combination(totalBallCount - takeBallCount - specialBallCount, i) / combination(totalBallCount, i);
      notHitProbabilities[i] = notHitProbability;
      notHitOdds[i] = 1 / notHitProbability;
      notHitOddsReduce[i] = notHitOdds[i] * reduce;
    }
  } catch (error) {
    notHitInfo = (error as Error).message;
  }

  // 全車
  // 沒中的機率等於那個主數字沒開出來的機率
  let allCarProbability: number = 0;
  let allCarOdds: number = 0;
  let allCarOddsReduce: number = 0;
  let allCarInfo: string = '';
  try {
    allCarProbability = 1 - takeBallCount / totalBallCount;
    allCarOdds = 1 / allCarProbability;
    allCarOddsReduce = allCarOdds * reduce;
  } catch (error) {
    allCarInfo = (error as Error).message;
  }

  // 天碰 2 3
  // 選中特別號的機率 乘上 剩下的球數中N-1星的可能性
  const specialStarProbabilities: { [key: number]: number } = {};
  const specialStarOdds: { [key: number]: number } = {};
  const specialStarOddsReduce: { [key: number]: number } = {};
  let specialStarInfo: string = '';
  try {
    for (let i = 2; i <= 3; i++) {
      const specialStarProbability = specialProbability * calcStar(totalBallCount - specialBallCount, takeBallCount, i - 1);
      specialStarProbabilities[i] = specialStarProbability;
      specialStarOdds[i] = 1 / specialStarProbability;
      specialStarOddsReduce[i] = specialStarOdds[i] * reduce;
    }
  } catch (error) {
    specialStarInfo = (error as Error).message;
  }

  /* 以下是算法有疑慮的部分 */

  // 台號跟特三
  // 先將每個數字在各個位置的可能性算出來 然後考慮各種拚出號碼的可能性
  // const probabilities = calculateLottoProbabilities(totalBallCount, takeBallCount);
  let tableProbabilities: number[][] = [];
  let tableOdds: number[][] = [];
  let tableOddsReduce: number[][] = [];
  let tableInfo: string = '';
  try {
    tableProbabilities = calculateTable(totalBallCount, takeBallCount);

    // 將機率轉換成賠率
    tableOdds = tableProbabilities.map(row => {
      return row.map(probability => {

        return 1 / probability;
      });
    });

    // 將賠率轉換成賠率減少
    tableOddsReduce = tableOdds.map(row => {
      return row.map(odds => {
        return odds * reduce;
      });
    });
  } catch (error) {
    tableInfo = (error as Error).message;
  }

  let specialThreeProbabilities: { [key: number]: number } = {};
  const specialThreeOdds: { [key: number]: number } = {};
  const specialThreeOddsReduce: { [key: number]: number } = {};
  let specialThreeInfo: string = '';
  try {
    // 特三
    // 特三很奇怪 在5球規則下特三是第234顆球的狀態 但6球時是345 然後要想一下怎麼考慮特三的排版
    specialThreeProbabilities = calcSpecialThree(totalBallCount, takeBallCount);
    const keys = Object.keys(specialThreeProbabilities);
    console.log(keys);
    keys.forEach(key => {
      specialThreeOdds[Number(key)] = 1 / specialThreeProbabilities[Number(key)];
    });
    keys.forEach(key => {
      specialThreeOddsReduce[Number(key)] = specialThreeOdds[Number(key)] * reduce;
    });
  } catch (error) {
    specialThreeInfo = (error as Error).message;
  }

  // 將各組資料分別包組
  const result = {
    star: {
      probabilities: starProbabilities,
      odds: starOdds,
      oddsReduce: starOddsReduce,
      info: starInfo
    },
    allCar: {
      probabilities: allCarProbability,
      odds: allCarOdds,
      oddsReduce: allCarOddsReduce,
      info: allCarInfo
    },
    special: {
      probabilities: specialProbability,
      odds: specialCodeOdds,
      oddsReduce: specialCodeOddsReduce,
      info: specialInfo
    },
    specialStar: {
      probabilities: specialStarProbabilities,
      odds: specialStarOdds,
      oddsReduce: specialStarOddsReduce,
      info: specialStarInfo
    },
    notHit: {
      probabilities: notHitProbabilities,
      odds: notHitOdds,
      oddsReduce: notHitOddsReduce,
      info: notHitInfo
    },
    table: {
      probabilities: tableProbabilities,
      odds: tableOdds,
      oddsReduce: tableOddsReduce,
      info: tableInfo
    },
    specialThree: {
      probabilities: specialThreeProbabilities,
      odds: specialThreeOdds,
      oddsReduce: specialThreeOddsReduce,
      info: specialThreeInfo
    }
  }

  return result;
};
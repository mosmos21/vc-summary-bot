import {ContestSummary} from "./types";

export default class Contest {
  body: CheerioStatic;

  constructor(body: CheerioStatic) {
    this.body = body;
  }

  penalty(): number {
    const header = this.body('h1 > small').text().trim();
    const penalty = header.substring(header.indexOf('ペナルティ') + 5).split('/')[0];
    return penalty !== undefined || penalty !== ''
      ? Number(penalty.replace(/分/, ''))
      : 0;
  }

  summary(): ContestSummary {
    const $ = this.body;
    let res: ContestSummary = {};
    $('.table > tbody > tr').each((idx, ele) => {
      const userId = $(ele).find('th:nth-child(2)').text().trim();
      const count = $(ele)
        .find('td > span:nth-child(1)')
        .filter((idx2, ele2) => {
          const point = $(ele2).text();
          return point !== '-' && 0 < Number(point);
        })
        .length - 1;
      res[userId] = Math.max(count, 0)
    });
    return res;
  }
}

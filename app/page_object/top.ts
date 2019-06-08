import { ContestInfo } from './types';

export default class Top {
  body: CheerioStatic;

  constructor(body: CheerioStatic) {
    this.body = body
  }

  getContestUrlList(): ContestInfo[] {
    const $ = this.body;
    let res: ContestInfo[] = [];
    $('.table > tbody > tr').each((idx, ele) => {
      res.push({
        title: $(ele).find('td:nth-child(1)').text().trim(),
        url: $(ele).find('td:nth-child(1) > a').attr('href').trim(),
        startTime: $(ele).find('td:nth-child(2)').text().trim(),
        endTime: $(ele).find('td:nth-child(3)').text().trim(),
      });
    });
    return res
  }
}
'use strict';

export default class Top {
  constructor(body) {
    this.body = body;
  }

  getContestUrlList() {
    const $ = this.body;
    let res = [];
    $('.table > tbody > tr').each((idx, ele) => {
      res.push({
        url: $(ele).find('td:nth-child(1) > a').attr('href').trim(),
        startTime: $(ele).find('td:nth-child(2)').text().trim(),
      });
    });
    return res;
  }
};
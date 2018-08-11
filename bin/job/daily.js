'use strict';
import * as consts from '../consts';
import cheerio from 'cheerio';
import moment from 'moment';
import request from 'request-promise';
import Twitter from '../twitter';

const message = (date, top, max) =>
  `${date}のばちゃこんのAC数の記録
一番ばちゃこんでACが多かった人は${top.length}人でした！

${top.join(" さん\n")} さん

AC数はなんと${max}ACでした！
明日も頑張りましょう！`;

export default class Daily {

  static buildTweetMessage(summary) {
    const date = moment().utc().add(9, 'h').subtract(1, 'd').format('M月D日');
    const max = Math.max.apply(null, Object.values(summary));
    const top = Object.keys(summary).filter(id => summary[id] === max).sort();
    if (top.length === 0) {
      return '今日は、ばちゃこんでACした人がいませんでした';
    }
    return message(date, top, max);
  };

  static run() {
    const lastDay = moment().utc().add(9, 'h').subtract(1, 'd').format('YYYY-MM-DD');
    const options = {
      uri: consts.HOST,
      transform: body => cheerio.load(body)
    };
    request(options).then($ => {
      let contests = [];
      $('.table > tbody > tr').each((idx, ele) => {
        contests.push({
          url: $(ele).find('td:nth-child(1) > a').attr('href').trim(),
          startTime: $(ele).find('td:nth-child(2)').text().trim(),
        });
      });
      return contests.filter(c => c.startTime.startsWith(lastDay));
    }).then(arr => Promise.all(arr.map(a => request({
      uri: consts.HOST + a.url,
      transform: body => cheerio.load(body)
    })))).then(results => {
      let summary = {};
      results.forEach($ => {
        $('.table > tbody > tr').each((idx, ele) => {
          const userId = $(ele).find('th:nth-child(2)').text().trim();
          const count = $(ele).find('td').filter((idx2, res) => 1 < $(res).text().trim().length).length - 1;
          summary[userId] = (summary[userId] ? summary[userId] : 0) + count;
        });
      });
      Twitter.tweet(this.buildTweetMessage(summary));
    }).catch(err => console.error(err));
  }
}
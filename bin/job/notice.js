'use strict';
import * as consts from '../consts';
import cheerio from 'cheerio';
import moment from 'moment';
import request from 'request-promise';
import Twitter from '../twitter';

const message = con =>
  `ばちゃこん情報
コンテスト名：${con.title}
開始時間：${con.startTime}
終了時間：${con.endTime}
${con.penalty}

${consts.HOST}${con.url}`;

export default class Notice {

  static run() {
    moment.locale('ja');
    const start = moment().add(4, 'h').format('YYYY-MM-DD HH:mm:ss');
    const end = moment().add(8, 'h').format('YYYY-MM-DD HH:mm:ss');
    const options = {
      uri: consts.HOST,
      transform: body => cheerio.load(body)
    };
    request(options).then($ => {
      let contests = [];
      $('.table > tbody > tr').each((idx, ele) => {
        contests.push({
          url: $(ele).find('td:nth-child(1) > a').attr('href').trim(),
          title: $(ele).find('td:nth-child(1)').text().trim(),
          startTime: $(ele).find('td:nth-child(2)').text().trim(),
          endTime: $(ele).find('td:nth-child(3)').text().trim(),
        });
      });
      return contests.filter(c =>
        moment(c.startTime).isAfter(start) && moment(c.endTime).isBefore(end)
      );
    }).then(contests => {
      contests.reverse().forEach(c => {
        const options = {
          uri: consts.HOST + c.url,
          transform: body => cheerio.load(body)
        };
        request(options).then($ => {
          const header = $('h1 > small').text().trim();
          c.penalty = header.substring(header.indexOf('ペナルティ'));
          Twitter.tweet(message(c));
        })
      });
    }).catch(err => console.error(err));
  }
}
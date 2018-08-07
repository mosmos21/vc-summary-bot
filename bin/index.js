'use strict';
import cheerio from 'cheerio';
import cron from 'cron';
import moment from 'moment';
import request from 'request-promise';
import Twit from 'twit';

import app from '../app';

const url = 'https://not-522.appspot.com';

const T = new Twit({
  consumer_key: app.get('options').key,
  consumer_secret: app.get('options').secret,
  access_token: app.get('options').token,
  access_token_secret: app.get('options').token_secret
});

const tweet = function (message) {
  console.log('tweet message:', message);
  T.post('statuses/update', { status: message }, (err, data, response) => {
    if (err) {
      console.log(err);
    }
    console.log('response status:', response.statusCode);
    console.log('tweet id:', data.id);
  });
};

const beforeDay = () => moment().utc().add(9, 'h').subtract(1, 'd').format('YYYY-MM-DD');

const buildSummary = (date, summary) => {

};

const run = () => {
  const before = beforeDay();
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  };
  request(options).then($ => {
    console.log('date:', before);
    let contests = [];
    $('.table > tbody > tr').each((idx, ele) => {
      contests.push({
        url: $(ele).find('td:nth-child(1) > a').attr('href').trim(),
        startTime: $(ele).find('td:nth-child(2)').text().trim(),
      });
    });
    return contests.filter(c => c.startTime.startsWith(before));
  }).then(arr => Promise.all(arr.map(a => request({
    uri: url + a.url,
    transform: body => cheerio.load(body)
  })))).then(results => {
    let summary = {};
    results.forEach($ => {
      $('.table > tbody > tr').each((idx, ele) => {
        const userId = $(ele).find('th:nth-child(2)').text().trim();
        const count = $(ele).find('td').filter((idx2, cld) => 1 < $(cld).text().trim().length).length - 1;
        if (summary[userId]) {
          summary[userId] = count;
        } else {
          summary[userId] = count;
        }
      });
    });
    tweet(buildSummary(before, summary));
  }).catch(err => console.error(err));
}
run();
var app = require('../app');
var Twit = require('twit');
var request = require('request');
var cheerio = require('cheerio');
var cron = require('cron');
var moment = require('moment');

const url = 'https://not-522.appspot.com/';

var cronTimes = {
  init: '0 0 0 * * * ',
  getContestList: '0 0 0 * * * ',
  countAccept: '0 0 0 * * * ',
  summary: '0 0 0 * * * ',
};

var contestList = [];
var accepts = [];

var T = new Twit({
  consumer_key: app.get('options').key,
  consumer_secret: app.get('options').secret,
  access_token: app.get('options').token,
  access_token_secret: app.get('options').token_secret
});

var tweet = function (message) {
  console.log('tweet message:', message);
  T.post('statuses/update', { status: message }, (err, data, response) => {
    if(err) {
      console.log(err);
    } else {
      console.log('response status:', response.statusCode);
      console.log('tweet id:', data.id);
    }
  });
};

var beforeDay = function () {
  return moment().utc().add(9, 'h').subtract(1, 'd').format('YYYY-MM-DD');
}

var init = new cron.CronJob({
  cronTime: cronTimes.init,
  onTick: function () {
    contestList = [];
    accepts = [];
  },
  start: false,
  timeZone: 'Asia/Tokyo',
});

var getContestList = new cron.CronJob({
  cronTime: cronTimes.getContestList,
  onTick: function () {
    request(url, function (err, res, body) {
      if(err) {
        console.err(err);
      }
      var $ = cheerio.load(body);
      var before = beforeDay();
      $('.table > tbody > tr').each(function() {
        var time = $(this).find('td:nth-child(2)').text().trim();
        if(time.startsWith(before)) {
          contestList.push({
            title: $(this).find('td:nth-child(1)').text().trim(),
            url: $(this).find('td:nth-child(1) > a').attr('href').trim(),
            startTime: $(this).find('td:nth-child(2)').text().trim(),
            endTime: $(this).find('td:nth-child(3)').text().trim(),
          });
        }
      });
    });
  },
  start: false,
  timeZone: 'Asia/Tokyo',
});

var countAccept = new cron.CronJob({
  cronTime: cronTimes.countAccept,
  onTick: function () {
    contestList.forEach(function(contest) {
      request(url + contest.url, function(err, res, body) {
        if(err) {
          console.err(err);
        }
        var $ = cheerio.load(body);
        $('table > tbody > tr').each(function() {
          var userId = $(this).find('th:nth-child(2)').text().trim();
          var count = $(this).find('td').filter(function() {
            return 1 < $(this).text().trim().length;
          }).length;
          accepts.push({
            url: contest.url,
            userId: userId,
            count: count - 1,
          });
        });
        accepts.forEach(function(data) {
          console.log(data);
        });
      });
    });
  },
  start: false,
  timeZone: 'Asia/Tokyo',
});

//==============================
tweet('botが起動しました。\n' + new Date());
init.start();
getContestList.start();
countAccept.start();
'use strict';

import cron from 'cron';
import Daily from './job/daily';
import Notice from './job/notice';

new cron.CronJob({
  cronTime: '0 15 0 * * *',
  onTick: () => Daily.run(),
  start: true,
  timeZone: 'Asia/Tokyo',
});

new cron.CronJob({
  cronTime: '0 0 */4 * * *',
  onTick: () => Notice.run(),
  start: true,
  timeZone: 'Asia/Tokyo',
});

'use strict';

import cron from 'cron';
import dayly from './job/daily';

new cron.CronJob({
  cronTime: '0 30 0 * * *',
  onTick: () => dayly.run(),
  start: true,
  timeZone: 'Asia/Tokyo',
});
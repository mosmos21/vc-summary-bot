'use strict';

import cron from 'cron';
import Daily from './job/daily';

new cron.CronJob({
  cronTime: '0 30 0 * * *',
  onTick: () => Daily.run(),
  start: true,
  timeZone: 'Asia/Tokyo',
});

'use strict';

import Daily from './job/daily'
import Notice from './job/notice'
import CronJob from './util/cron_job'
const jobs = new CronJob();

jobs.addAll([
  {
    cronTime: '0 15 0 * * *',
    jobClass: new Daily(),
  }, {
    cronTime: '0 0 */4 * * *',
    jobClass: new Notice(),
  }
]);
jobs.applyAll();

'use strict';

import cron from 'cron';

export default class CronJob {

  constructor() {
    this.jobs = [];
  }

  addAll(arr) {
    this.jobs = this.jobs.concat(arr);
  }

  applyAll() {
    this.jobs.forEach(job => {
      new cron.CronJob({
        cronTime: job['cronTime'],
        onTick: () => job['jobClass'].run(),
        start: job['start'] || true,
        timeZone: job['TimeZone'] || 'Asia/Tokyo',
      });
    });
  };
};
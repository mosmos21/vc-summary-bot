import cron from 'cron';

export interface Job {
  run: () => void;
}

export interface JobConfig {
  cronTime: string;
  jobClass: Job;
  start?: boolean;
  timeZone?: string;
}

export default class CronJob {
  jobs: JobConfig[];

  constructor() {
    this.jobs = [];
  }

  addAll(arr: JobConfig[]) {
    this.jobs = this.jobs.concat(arr);
  }

  applyAll() {
    this.jobs.forEach(job => {
      new cron.CronJob({
        cronTime: job.cronTime,
        onTick: () => job.jobClass.run(),
        start: job.start || true,
        timeZone: job.timeZone || 'Asia/Tokyo',
      });
    });
  }
}
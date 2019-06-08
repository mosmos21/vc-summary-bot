import Daily from './daily'
import Notice from './notice'
import CronJob from '../util/cron_job'

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
(async () => await new Notice().run())();
export default jobs;

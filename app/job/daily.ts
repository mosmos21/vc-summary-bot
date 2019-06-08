import moment from 'moment'

import * as consts from '../consts'
import Top from '../page_object/top'
import Contest from '../page_object/contest'
import Req from '../util/request-wrapper'
import Twitter from '../util/twitter'
import {Job} from "../util/cron_job";
import {ContestSummary} from "../page_object/types";

const message = (date: string, top: string[], max: number) =>
  `${date}のばちゃこんのAC数の記録
一番ばちゃこんでACが多かった人は${top.length}人でした！

${top.join(" さん\n")} さん

AC数はなんと${max}ACでした！
明日も頑張りましょう！`;

export default class Daily implements Job {
  buildTweetMessage(summary: any[]) {
    const date: string = moment().utc().add(9, 'h').subtract(1, 'd').format('M月D日');
    const max: number = Math.max.apply(null, summary.map(s => s.count));
    const top: string[] = summary.filter(s => s.count === max).map(s => s.userId);
    return top.length === 0
      ? '今日は、ばちゃこんでACした人がいませんでした'
      : message(date, top, max)
  }

  async run() {
    const lastDay
      = moment().utc().add(9, 'h')
        .subtract(1, 'd')
        .format('YYYY-MM-DD');

    const contestList
      = new Top(await Req.get(consts.PATH.top))
        .getContestUrlList()
        .filter(c => c.startTime.startsWith(lastDay));

    const contestSummaryList
      = (await Promise.all(contestList.map(c => Req.get(c.url))))
        .map(body => new Contest(body))
        .map(c => c.summary());

    const summaryList
      = Array.prototype.concat.apply([],
          contestSummaryList.map(s => Object.keys(s)))
        .filter((x, i, self) => self.indexOf(x) === i)
        .map(user => ({
          'userId': user,
          'count': contestSummaryList
            .map(s => s[user] || 0)
            .reduce((prev, crt) => prev + crt)
        }));
    Twitter.tweet(this.buildTweetMessage(summaryList))
  }
}
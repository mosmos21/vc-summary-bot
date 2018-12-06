'use strict'

import moment from 'moment'

import * as consts from '../consts'
import Twitter from '../util/twitter'
import Req from '../util/request-wrapper'
import Top from '../page_object/top'
import Contest from '../page_object/contest'

const message = con =>
  `ばちゃこん情報
コンテスト名：${con.title}
開始時間：${con.startTime}
終了時間：${con.endTime}
ペナルティ：${con.penalty}

${consts.HOST}${con.url}`

export default class Notice {
  async run() {
    moment.locale('ja');
    const start = moment().add(4, 'h').format('YYYY-MM-DD HH:mm:ss')
    const end = moment().add(8, 'h').format('YYYY-MM-DD HH:mm:ss')

    const contestList
      = new Top(await Req.get(consts.PATH.top))
        .getContestUrlList()
        .filter(c =>
          moment(c.startTime).isAfter(start)
          && moment(c.startTime).isBefore(end))

    contestList.forEach(async (contest) => {
      contest.penalty = new Contest(await Req.get(contest.url)).penalty()
      Twitter.tweet(message(contest))
    })
  }
}
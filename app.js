'use strict';
require('dotenv').config();
const line = require('@line/bot-sdk');
import express from 'express';
import Logger from './bin/util/logger'
import * as consts from './bin/consts';

const app = express();

const options = {
  key: process.env.TWIBOT_TWITTER_KEY,
  secret: process.env.TWIBOT_TWITTER_SECRET,
  token: process.env.TWIBOT_TWITTER_TOKEN,
  token_secret: process.env.TWIBOT_TWITTER_TOKEN_SECRET,
  local_run: process.env.LOCAL_RUN
};

const lineBotConfig = {
  channelSecret: process.env.LINEBOT_CHANNEL_SECRET,
  channelAccessToken: process.env.LINEBOT_CHANNEL_ACCESS_TOKEN
};
app.set('options', options);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
  response.send(`This is Twitter-bot application. version: ${consts.VERSION}`);
});

app.post('/webhook', line.middleware(lineBotConfig), (req, res) => {
  console.log(' ======== req.body.events ========');
  console.log(req.body.events);
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.log(' ======== error ========');
      console.error(err)
    });
});

const client = new line.Client(lineBotConfig);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text //実際に返信の言葉を入れる箇所
  });
}

app.listen(app.get('port'), () => {
  Logger.info("Node app is running at localhost:" + app.get('port'))
});
module.exports = app;

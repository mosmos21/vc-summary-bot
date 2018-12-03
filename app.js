import express from 'express';
import * as consts from './bin/consts';

const app = express();

const options = {
  key: process.env.TWIBOT_TWITTER_KEY,
  secret: process.env.TWIBOT_TWITTER_SECRET,
  token: process.env.TWIBOT_TWITTER_TOKEN,
  token_secret: process.env.TWIBOT_TWITTER_TOKEN_SECRET,
  local_run: process.env.LOCAL_RUN
};
app.set('options', options);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
  response.send(`This is Twitter-bot application. version: ${consts.VERSION}`);
});

app.listen(app.get('port'), () => {
  console.log("Node app is running at localhost:" + app.get('port'))
});
module.exports = app;

import express from 'express';
import Jobs from './job';

Jobs.applyAll();

const app = express();

app.set('options', {
  key: process.env.TWIBOT_TWITTER_KEY,
  secret: process.env.TWIBOT_TWITTER_SECRET,
  token: process.env.TWIBOT_TWITTER_TOKEN,
  token_secret: process.env.TWIBOT_TWITTER_TOKEN_SECRET,
  local_run: process.env.LOCAL_RUN
});

app.get('/', (_, res: express.Response) => res.send("hello"));
app.listen(3000, "0.0.0.0", () => console.log("server start"));
export default app;
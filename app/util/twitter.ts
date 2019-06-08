import Twit from 'twit';
import App from '../index';
import Logger from './logger'

const T = new Twit({
  consumer_key: App.get('options').key,
  consumer_secret: App.get('options').secret,
  access_token: App.get('options').token,
  access_token_secret: App.get('options').token_secret
});

export default class Twitter {
  static tweet(message: string): void {
    if(App.get('options').local_run) {
      Logger.debug('tweet message\n', message);
    } else {
      T.post('statuses/update', {status: message}, (err, data, response) => {
        if (err) {
          Logger.error(err);
        }
        Logger.info('tweet success');
        Logger.info('response status:', response.statusCode);
        // @ts-ignore
        Logger.info('tweet ID:', data.id);
      });
    }
  }
}
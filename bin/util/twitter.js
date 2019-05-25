'use strict';
import app from '../../app';
import Twit from 'twit';
import Logger from './logger'

const T = new Twit({
  consumer_key: app.get('options').key,
  consumer_secret: app.get('options').secret,
  access_token: app.get('options').token,
  access_token_secret: app.get('options').token_secret
});

export default class Twitter {
  static tweet(message) {
    if(app.get('options').local_run) {
      Logger.debug('tweet message\n', message);
    } else {
      T.post('statuses/update', {status: message}, (err, data, response) => {
        if (err) {
          Logger.error(err);
        }
        Logger.info('tweet success');
        Logger.info('response status:', response.statusCode);
        Logger.info('tweet ID:', data.id);
      });
    }
  }
}
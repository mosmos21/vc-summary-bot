'use strict';
import app from '../app';
import Twit from 'twit';

const T = new Twit({
  consumer_key: app.get('options').key,
  consumer_secret: app.get('options').secret,
  access_token: app.get('options').token,
  access_token_secret: app.get('options').token_secret
});

export default class Twitter {
  static tweet(message) {
    console.log('tweet message:\n', message);
    T.post('statuses/update', { status: message }, (err, data, response) => {
      if (err) {
        console.log(err);
      }
      console.log('response status:', response.statusCode);
      console.log('tweet id:', data.id);
    });
  };
}
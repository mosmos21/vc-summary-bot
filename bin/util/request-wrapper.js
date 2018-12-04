'use strict'

import cheerio from 'cheerio'
import request from 'request-promise'
import * as consts from '../consts'

export default class RequestWrapper {
  static get(path, params) {
    if (params) {
      Object.keys(params).forEach(
        key => path = path.replace(':' + key, params[key])
      );
    }
    const options = {
      uri: consts.HOST + path,
      transform: body => cheerio.load(body)
    }
    return request(options);
  }
}
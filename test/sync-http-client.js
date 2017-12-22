//The class assumes we are always dealing with JSON payloads.
//This is the first example of an ES6 Class in our labs so far. We will be making more use of these modern features in forthcoming labs.

/**
 * This class will encapsulate all lower level http request composition and transmission.
 * @type {doRequest}
 */

let request = require('sync-request');

class SyncHttpService {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * setAuth requests a token from the server, and stores in in an authHeader property.
   * get, post and delete then include this header as part of all requests
   * @param url
   * @param user
   * @returns {boolean}
   */
  setAuth(url, user) {
    const res = request('POST', this.baseUrl + url, { json: user });
    if (res.statusCode == 201) {
      let payload = JSON.parse(res.getBody('utf8'));
      if (payload.success) {
        this.authHeadder = { Authorization: 'bearer ' + payload.token, };
        return true;
      }
    }

    this.authHeadder = null;
    return false;
  }

  /**
   * clearAuth clears out the authHeader token
   */
  clearAuth() {
    this.authHeadder = null;
  }

  get(url) {
    let returnedObj = null;
    let res = request('GET', this.baseUrl + url);
    if (res.statusCode < 300) {
      returnedObj = JSON.parse(res.getBody('utf8'));
    }

    return returnedObj;
  }

  post(url, obj) {
    let returnedObj = null;
    let res = request('POST', this.baseUrl + url, { json: obj });
    if (res.statusCode < 300) {
      returnedObj = JSON.parse(res.getBody('utf8'));
    }

    return returnedObj;
  }

  delete(url) {
    let res = request('DELETE', this.baseUrl + url, { headers: this.authHeadder });
    return res.statusCode;
  }
}

module.exports = SyncHttpService;

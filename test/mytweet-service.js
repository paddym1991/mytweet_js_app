/**
 * This class encapsulates the client side of the mytweet api. It is layered on top of the
 * SyncHttpClient class, and delivers a simplified interface to the unit tests.
 */

'use strict';

const SyncHttpService = require('./sync-http-client');
const baseUrl = 'http://localhost:4000';

class MyTweetService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  getUsers() {
    return this.httpService.get('/api/users');
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  deleteOneUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }

  getTweets() {
    return this.httpService.get('api/tweets');
  }

  getTweet(id) {
    return this.httpService.get('api/tweets/' + id);
  }

  createTweet(newTweet) {
    return this.httpService.post('/api/tweets', newTweet);
  }

  deleteAllTweets() {
    return this.httpService.delete('api/tweets');
  }
}

module.exports = MyTweetService;

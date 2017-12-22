'use strict';

const assert = require('chai').assert;
const MyTweetService = require('./mytweet-service');
const fixtures = require('./fixtures.json');
//We need a comparison that will test to see if the returned User is a superset of the newUser object
const _ = require('lodash');

suite('Tweet API tests', function () {

  let users = fixtures.users;
  let tweets = fixtures.tweets;
  let newTweet = fixtures.newTweet;

  const mytweetService = new MyTweetService(fixtures.myTweetService);

  //These (beforeEach & afterEach) are run before and after each test - clearing our the candidates
  // model so that each test can be considered completely independently
  beforeEach(function () {
    mytweetService.login(users[0]);
    mytweetService.deleteAllTweets();
  });

  afterEach(function () {
    mytweetService.deleteAllTweets();
    mytweetService.logout();
  });

  //simplified test with lodash
  test('create a tweet', function () {
    const returnedTweet = mytweetService.createTweet(newTweet);
    assert(_.some([returnedTweet], newTweet), 'returned Tweet must be a superset of newTweet');
    assert.isDefined(returnedTweet._id);
  });

  test('get tweet', function () {
    const t1 = mytweetService.createTweet(newTweet);
    const t2 = mytweetService.getTweet(t1._id);
    assert.deepEqual(t1, t2);
  });

  test('get invalid tweet', function () {
    const t1 = mytweetService.getTweet('1234');
    assert.isNull(t1);
    const t2 = mytweetService.getTweet('012345678901234567890123');
    assert.isNull(t2);
  });

  test('delete a tweet', function () {
    const t = mytweetService.createTweet(newTweet);
    assert(mytweetService.getTweet(t._id) != null);
    mytweetService.deleteOneTweet(t._id);
    assert(mytweetService.getTweet(t._id) == null);
  });

  test('get all tweets', function () {
    for (let t of tweets) {
      mytweetService.createTweet(t);
    }

    const allTweets = mytweetService.getTweets();
    assert.equal(allTweets.length, tweets.length);
  });

  test('get tweets detail', function () {
    for (let t of tweets) {
      mytweetService.createTweet(t);
    }

    const allTweets = mytweetService.getTweets();
    for (let i = 0; i < tweets.length; i++) {
      assert(_.some([allTweets[i]], tweets[i]), 'returnedTweet must be a superset of newTweet');
    }
  });

  test('get all tweets empty', function () {
    const allTweets = mytweetService.getTweets();
    assert.equal(allTweets.length, 0);
  });
});

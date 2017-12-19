á'use strict';

const assert = require('chai').assert;
const MyTweetService = require('./mytweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Tweet API tests', function () {

  let tweets = fixtures.donations;

  const myTweetService = new MyTweetService(fixtures.myTweetService);

  beforeEach(function () {
  });

  afterEach(function () {

  });

  test('a test function', function () {

  });

});

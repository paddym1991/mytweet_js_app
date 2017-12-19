'use strict';

const assert = require('chai').assert;
const MyTweetService = require('./mytweet-service');
const fixtures = require('./fixtures.json');
//Note that we are including the utils functions from the main application
//These will help us validate the token (for test purposes), but they are not exposed as part of the api.
const utils = require('../app/api/utils.js');

suite('Users API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const myTweetService = new MyTweetService(fixtures.myTweetService);

  beforeEach(function () {
    myTweetService.deleteAllUsers();
  });

  afterEach(function () {
    myTweetService.deleteAllUsers();
  });

  test('authenticate', function () {
    const returnedUser = myTweetService.createUser(newUser);
    const response = myTweetService.authenticate(newUser);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test('verify Token', function () {
    const returnedUser = myTweetService.createUser(newUser);
    const response = myTweetService.authenticate(newUser);

    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });
});

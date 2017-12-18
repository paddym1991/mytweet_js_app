'use strict';

const assert = require('chai').assert;
const MyTweetService = require('./mytweet-service');
const fixtures = require('./fixtures.json');
//We need a comparison that will test to see if the returned User is a superset of the newUser object
const _ = require('lodash');

suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const mytweetService = new MyTweetService('http://localhost:4000');

  //These (beforeEach & afterEach) are run before and after each test - clearing our the candidates
  // model so that each test can be considered completely independently
  beforeEach(function () {
    mytweetService.deleteAllUsers();
  });

  afterEach(function () {
    mytweetService.deleteAllUsers();
  });

  //simplified test with lodash
  test('create a user', function () {
    const returnedUser = mytweetService.createUser(newUser);
    assert(_.some([returnedUser], newUser), 'returned User must be a superset of newUser');
    assert.isDefined(returnedUser._id);
  });

  test('get user', function () {
    const u1 = mytweetService.createUser(newUser);
    const u2 = mytweetService.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test('get invalid user', function () {
    const u1 = mytweetService.getUser('1234');
    assert.isNull(u1);
    const u2 = mytweetService.getUser('012345678901234567890123');
    assert.isNull(u2);
  });

  test('delete a user', function () {
    const u = mytweetService.createUser(newUser);
    assert(mytweetService.getUser(u._id) != null);
    mytweetService.deleteOneUser(u._id);
    assert(mytweetService.getUser(u._id) == null);
  });

  test('get all users', function () {
    for (let u of users) {
      mytweetService.createUser(u);
    }

    const allUsers = mytweetService.getUsers();
    assert.equal(allUsers.length, users.length);
  });

  test('get users detail', function () {
    for (let u of users) {
      mytweetService.createUser(u);
    }

    const allUsers = mytweetService.getUsers();
    for (let i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), 'returnedUser must be a superset of newUser');
    }
  });

  test('get all users empty', function () {
    const allUsers = mytweetService.getUsers();
    assert.equal(allUsers.length, 0);
  });
});

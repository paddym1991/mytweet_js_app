'use strict';

const assert = require('chai').assert;
let request = require('sync-request');

/**
 * Revised version of first test to include sync-request
 */
suite('User API tests', function () {

  test('get users', function () {

    const url = 'http://localhost:4000/api/users';
    const res = request('GET', url);
    const users = JSON.parse(res.getBody('utf8'));

    assert.equal(4, users.length);

    assert.equal(users[0].firstName, 'Homer');
    assert.equal(users[0].lastName, 'Simpson');
    assert.equal(users[0].email, 'homer@simpson.com');

    assert.equal(users[1].firstName, 'Marge');
    assert.equal(users[1].lastName, 'Simpson');
    assert.equal(users[1].email, 'marge@simpson.com');

    assert.equal(users[2].firstName, 'Bart');
    assert.equal(users[2].lastName, 'Simpson');
    assert.equal(users[2].email, 'bart@simpson.com');

    assert.equal(users[3].firstName, 'Admin');
    assert.equal(users[3].lastName, 'Istrator');
    assert.equal(users[3].email, 'admin@istrator.com');

  });

  test('get one user', function () {

    const allUsersUrl = 'http://localhost:4000/api/users';
    let res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    const oneUserUrl = allUsersUrl + '/' + users[0]._id;
    res = request('GET', oneUserUrl);
    const oneUser = JSON.parse(res.getBody('utf8'));

    assert.equal(oneUser.firstName, 'Homer');
    assert.equal(oneUser.lastName, 'Simpson');
    assert.equal(oneUser.email, 'homer@simpson.com');

  });

});

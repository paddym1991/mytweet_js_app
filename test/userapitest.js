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
    assert.equal(users[0].password, 'secret');

    assert.equal(users[1].firstName, 'Marge');
    assert.equal(users[1].lastName, 'Simpson');
    assert.equal(users[1].email, 'marge@simpson.com');
    assert.equal(users[1].password, 'secret');

    assert.equal(users[2].firstName, 'Bart');
    assert.equal(users[2].lastName, 'Simpson');
    assert.equal(users[2].email, 'bart@simpson.com');
    assert.equal(users[2].password, 'secret');

    assert.equal(users[3].firstName, 'Admin');
    assert.equal(users[3].lastName, 'Istrator');
    assert.equal(users[3].email, 'admin@istrator.com');
    assert.equal(users[3].password, 'secret');

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
    assert.equal(oneUser.password, 'secret');

  });

  test('create a user', function () {

    const usersUrl = 'http://localhost:4000/api/users';

    //invoke a POST route using the sync-request library
    const newUser = {
      firstName: 'Barnie',
      lastName: 'Grumble',
      email: 'barnie@grumble.com',
      password: 'secret',
    };

    const res = request('POST', usersUrl, { json: newUser }); //end of POST
    const returnedUser = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedUser.firstName, 'Barnie');
    assert.equal(returnedUser.lastName, 'Grumble');
    assert.equal(returnedUser.email, 'barnie@grumble.com');
    assert.equal(returnedUser.password, 'secret');

  });

  test('delete one user', function () {

    const allUsersUrl = 'http://localhost:4000/api/users';
    let res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    const deleteOneUserUrl = allUsersUrl + '/' + users[0]._id;
    let rem = request('Delete', deleteOneUserUrl);

    assert.equal(rem.statusCode, '204');

  });

  test('delete all users', function () {

    const allUsersUrl = 'http://localhost:4000/api/users';
    let res = request('DELETE', allUsersUrl);

    assert.equal(res.statusCode, '204');

  });

});

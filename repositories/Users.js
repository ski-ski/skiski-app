
const knex = require('../knex');
const bcrypt = require('bcrypt');
class Users {
  constructor() {}

  getUsers() {
    return knex('users');
  }

  getUser(id) {
    return knex('users').where('id', id);
  }
}

module.exports = Users;

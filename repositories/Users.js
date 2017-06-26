
const knex = require('../knex');

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

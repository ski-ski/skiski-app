
const knex = require('../knex');
const bcrypt = require('bcrypt');
class Users {
  constructor() {}

  createUser(userData) {
    return knex('users')
    .insert(userData, ['id', 'first_name', 'last_name', 'email']);
  }

  getUsers() {
    return knex('users');
  }

  getUser(id) {
    return knex('users').where('id', id);
  }

 updateUser(id, userData) {
  return knex('users')
  .update(userData, ['id', 'first_name', 'last_name', 'email'])
  .where('id', id);
 }
 deleteUser(id) {
    return knex('users')
      .del()
      .where('id', id)
      .returning('*');
  }

}

module.exports = Users;

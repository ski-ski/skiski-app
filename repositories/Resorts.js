const knex = require('../knex');

class Resorts {
  constructor() {}

  // createResorts(resortData) {
  //   return knex('resorts')
  //   .insert(resortData, ['id', 'first_name', 'last_name', 'email']);
  // }

  getResorts() {
    return knex('resorts');
  }

  getResort(id) {
    return knex('resorts').where('id', id);
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
 module.exports = Resorts;

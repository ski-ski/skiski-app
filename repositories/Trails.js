const knex = require('../knex');

class Trails {
  constructor() {}

  createTrail(trailData) {
    return knex('trails').insert(trailData, '*');
  }

  // getTrail(id) {
  //   return knex('trails').where('id', id);
  // }
  
  // updateTrail(id, trailData) {
  //   return knex('trails')
  //     .update(trailData, ['id', 'first_name', 'last_name', 'email'])
  //     .where('id', id);
  // }
  // deleteTrail(id) {
  //   return knex('trails').del().where('id', id).returning('*');
  // }
  //
  // getTrails() {
  //   return knex('trails');
  // }
}

module.exports = Trails;

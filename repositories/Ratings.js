const knex = require('../knex');

class Ratings {
  constructor() {}

  createRating(ratingData) {
    return knex('ratings').insert(ratingData, '*');
  }

  getRating(id) {
    return knex('ratings').where('id', id);
  }

  // updateRating(id, ratingData) {
  //   return knex('ratings')
  //     .update(ratingData, '*')
  //     .where('id', id);
  // }
  //
  // deleteRating(id) {
  //   return knex('ratings').del().where('id', id).returning('*');
  // }
  //
  // getRatings() {
  //   return knex('ratings');
  // }
}

module.exports = Ratings;

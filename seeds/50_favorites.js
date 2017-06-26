exports.seed = function(knex, Promise) {
  return knex('favorites')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('favorites').insert([
        { id: 1, user_id: 1, trail_id: 2, ranking: 2 },
        { id: 2, user_id: 2, trail_id: 1, ranking: 5 },
        { id: 3, user_id: 2, trail_id: 2, ranking: 2 }
      ]);
    })
    .then(() =>
      knex.raw(
        "SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites))"
      )
    );
};

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ratings').del()
    .then(function () {
      // Inserts seed entries
      return knex('ratings').insert([
        {
          id: 1,
          user_id: 1,
          trail_id: 1,
          rating: 4,
					review:"very good",
					created_at: new Date('2016-06-29 14:26:16 UTC'),
          updated_at: new Date('2016-06-29 14:26:16 UTC')
        },
				{
          id: 2,
          user_id: 2,
          trail_id: 2,
          rating: 2,
					review:"ok",
					created_at: new Date('2016-06-29 14:26:16 UTC'),
          updated_at: new Date('2016-06-29 14:26:16 UTC')
        }

      ]);
    })
    .then(function(){
          return knex.raw(`SELECT setval('ratings_id_seq', (SELECT MAX(id) FROM ratings))`)
      });
};

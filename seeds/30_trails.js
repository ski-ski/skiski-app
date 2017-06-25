exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('trails').del()
    .then(function () {
      // Inserts seed entries
      return knex('trails').insert([
        {
          id: 1,
          name: 'GS Bowl',
          resort_id: 1,
          difficulty: "black"
        },

        {
          id: 2,
          name: 'Dipper Bowl',
          resort_id: 2,
          difficulty: "black"
        },

        {
          id: 3,
          name: 'Sierra Grande',
          resort_id: 3,
          difficulty: "black"
        },

        {
          id: 4,
          name: 'The Wall',
          resort_id: 4,
          difficulty: "double-black"
        },

        {
          id: 5,
          name: "The Palisades",
          resort_id: 5,
          difficulty: "double-black"
        },

        {
          id: 6,
          name: 'Chukker',
          resort_id: 6,
          difficulty: "blue"
        },

        {
          id: 7,
          name: 'Clipper',
          resort_id: 7,
          difficulty: "black"
        },

        {
          id: 8,
          name: 'South Face',
          resort_id: 8,
          difficulty: "black"
        }

      ]);
    })
    .then(function(){
          return knex.raw(`SELECT setval('trails_id_seq', (SELECT MAX(id) FROM trails))`)
      });
};

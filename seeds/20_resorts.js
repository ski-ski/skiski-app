
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('resorts').del()
    .then(function () {
      // Inserts seed entries
      return knex('resorts').insert([
        {
          id: 1,
          name: 'Squaw Valley',
          windspeed: 10, temperature: 40,
          snow_depth: 1
        },

        {id: 2,
          name: 'Heavenly',
          windspeed: 12,
          temperature: 60,
          snow_depth: 3
        },

        {
          id: 3,
          name: 'Northstar',
          windspeed: 4,
          temperature: 55,
          snow_depth: 4
        },

        {
          id: 4,
          name: 'Kirkwood',
          windspeed: 420,
          temperature: 62,
          snow_depth: 2
        },

        {
          id: 5,
          name:
          'Sugar Bowl',
          windspeed: 14,
          temperature: 33,
          snow_depth: 6
        },

        {
          id: 6,
          name: 'Boreal',
          windspeed: 11,
          temperature: 100,
          snow_depth: 3
        },

        {
          id: 7,
          name: 'Sierra',
          windspeed: 5,
          temperature: 43,
          snow_depth: 2
        },

        {
          id: 8,
          name: 'Alpine Meadows',
          windspeed:2,
          temperature: 78,
          snow_depth: 1
        }

      ]);
    })
    .then(function(){
          return knex.raw(`SELECT setval('resorts_id_seq', (SELECT MAX(id) FROM resorts))`)
      });
};


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('resorts').del()
    .then(function () {
      // Inserts seed entries
      return knex('resorts').insert([
        {
          id: 1,
          name: 'Squaw Valley',
          city: 'Olympic_Valley',
          windspeed: 0,
          high_temperature:0,
          low_temperature:0,
          snow_depth: 0
        },

        {
          id: 2,
          name: 'Heavenly',
          city: 'South_Lake_Tahoe',
          windspeed: 0,
          high_temperature:0,
          low_temperature:0,
          snow_depth: 0
        },

        {
          id: 3,
          name: 'Northstar',
          city: 'Truckee',
          windspeed: 0,
          high_temperature:0,
          low_temperature:0,
          snow_depth: 0
        },

        {
          id: 4,
          name: 'Kirkwood',
          city: 'South_Lake_Tahoe',
          windspeed: 0,
          high_temperature:0,
          low_temperature:0,
          snow_depth: 0
        },

        {
          id: 5,
          name:
          'Sugar Bowl',
          city: 'Truckee',
          windspeed: 0,
          high_temperature:0,
          low_temperature:0,
          snow_depth: 0
        },

        {
          id: 6,
          name: 'Boreal',
          city: 'Truckee',
          windspeed: 0,
          high_temperature:0,
          low_temperature:0,
          snow_depth: 0
        },

        {
          id: 7,
          name: 'Sierra',
          city: 'South_Lake_Tahoe',
          windspeed: 0,
          high_temperature:0,
          low_temperature:0,
          snow_depth: 0
        },

        {
          id: 8,
          name: 'Alpine Meadows',
          city: 'Olympic_Valley',
          windspeed:0,
          high_temperature:0,
          low_temperature:0,
          snow_depth: 0
        }

      ]);
    })
    .then(function(){
          return knex.raw(`SELECT setval('resorts_id_seq', (SELECT MAX(id) FROM resorts))`)
      });
};

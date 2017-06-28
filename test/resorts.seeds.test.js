process.env.NODE_ENV = 'test';

const assert = require('chai').assert;
const { suite, test } = require('mocha');
const knex = require('../knex');
const { addDatabaseHooks } = require('./utils')

suite('resorts seeds', addDatabaseHooks(() => {
  test('resorts rows', (done) => {
    knex('resorts').orderBy('id', 'ASC')
      .then((actual) => {
        /* eslint-disable max-len */
        const expected = [
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

        ];

        /* eslint-enable max-len */

        for (let i = 0; i < expected.length; i++) {
          assert.deepEqual(
            actual[i],
            expected[i],
            `Row id=${i + 1} not the same`
          );
        }

        done();
      })
      .catch((err) => {
        done(err);
      });
  });
}));

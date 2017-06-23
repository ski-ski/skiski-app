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
        const expected = [{
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
        }];

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

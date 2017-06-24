process.env.NODE_ENV = 'test';

const assert = require('chai').assert;
const { suite, test } = require('mocha');
const knex = require('../knex');
const { addDatabaseHooks } = require('./utils');

suite(
  'favorites seeds',
  addDatabaseHooks(() => {
    test('favorites rows', done => {
      knex('favorites')
        .orderBy('id', 'ASC')
        .then(actual => {
          const expected = [
            { id: 1, user_id: 2, trail_id: 1, ranking: 2 },
            { id: 2, user_id: 1, trail_id: 2, ranking: 5 },
            { id: 3, user_id: 2, trail_id: 1, ranking: 2 }
          ];

          for (let i = 0; i < expected.length; i++) {
            assert.deepEqual(
              actual[i],
              expected[i],
              `Row id=${i + 1} not the same`
            );
          }

          done();
        })
        .catch(err => {
          done(err);
        });
    });
  })
);

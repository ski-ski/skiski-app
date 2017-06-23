process.env.NODE_ENV = 'test';

const assert = require('chai').assert;
const { suite, test } = require('mocha');
const knex = require('../knex');
const { addDatabaseHooks } = require('./utils')
suite('favorites migration', addDatabaseHooks(() => {
  test('favorites table', (done) => {
    knex('favorites').columnInfo()
      .then((actual) => {
        const expected = {
          id: {
            type: 'integer',
            maxLength: null,
            nullable: false,
            defaultValue: 'nextval(\'favorites_id_seq\'::regclass)'
          },

          user_id: {
            type: 'integer',
            maxLength: null,
            nullable: false,
            defaultValue: null
          },

          trail_id: {
            type: 'integer',
            maxLength: null,
            nullable: false,
            defaultValue: null
          },

          ranking: {
            type: 'integer',
            maxLength: null,
            nullable: false,
            defaultValue: null
          }
				};

        for (const column in expected) {
          assert.deepEqual(
            actual[column],
            expected[column],
            `Column ${column} is not the same`
          );
        }

        done();
      })
      .catch((err) => {
        done(err);
      });
  });
}));

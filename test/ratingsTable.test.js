process.env.NODE_ENV = 'test';

const assert = require('chai').assert;
const { suite, test } = require('mocha');
const knex = require('../knex');
const { addDatabaseHooks } = require('./utils')
suite('ratings migration', addDatabaseHooks(() => {
  test('ratings table', (done) => {
    knex('ratings').columnInfo()
      .then((actual) => {
        const expected = {
          id: {
            type: 'integer',
            maxLength: null,
            nullable: false,
            defaultValue: 'nextval(\'ratings_id_seq\'::regclass)'
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

          rating: {
            type: 'integer',
            maxLength: null,
            nullable: false,
            defaultValue: null
          },

          review: {
						type: 'character varying',
            maxLength: 255,
            nullable: false,
            defaultValue: '\'\'::character varying'
          },
					
					updated_at: {
            type: 'timestamp with time zone',
            maxLength: null,
            nullable: false,
            defaultValue: 'now()'
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

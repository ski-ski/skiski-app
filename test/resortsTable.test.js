process.env.NODE_ENV = 'test';

const assert = require('chai').assert;
const { suite, test } = require('mocha');
const knex = require('../knex');
const { addDatabaseHooks } = require('./utils')
suite('resorts migration', addDatabaseHooks(() => {
  test('resorts table', (done) => {
    knex('resorts').columnInfo()
      .then((actual) => {
        const expected = {
          id: {
            type: 'integer',
            maxLength: null,
            nullable: false,
            defaultValue: 'nextval(\'resorts_id_seq\'::regclass)'
          },

          name: {
            type: 'character varying',
            maxLength: 255,
            nullable: false,
            defaultValue: '\'\'::character varying'
          },

          windspeed: {
            type: 'integer',
            maxLength: null,
            nullable: false,
            defaultValue: null
          },

          temperature: {
            type: 'integer',
            maxLength: null,
            nullable: false,
            defaultValue: null
          },

          snow_depth: {
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

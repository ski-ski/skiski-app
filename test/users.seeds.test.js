process.env.NODE_ENV = 'test';

const assert = require('chai').assert;
const { suite, test } = require('mocha');
const knex = require('../knex');
const { addDatabaseHooks } = require('./utils');

suite(
  'users seeds',
  addDatabaseHooks(() => {
    test('users rows', done => {
      knex('users')
        .orderBy('id', 'ASC')
        .then(actual => {
          const expected = [
            {
              id: 1,
              first_name: 'Steve',
              last_name: 'Morse',
              email: 'steve@gmail.com',
              hashed_password:
                '$2a$10$Sc1JH2uOZ1Cv0t3hoWoc1OyWCdy6Q6BP07b8zWqjT2A2bBbZr6Ab6'
            },
            {
              id: 2,
              first_name: 'Steve',
              last_name: 'Vaughan',
              email: 'steve2@gmail.com',
              hashed_password:
                '$2a$10$ha5HzJWYkRcwQLhT9kHb.eZJ0sT26edJnHAcbpPrF5tMqo3w26Ux2'
            }
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

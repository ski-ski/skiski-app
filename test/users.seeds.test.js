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
                '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS'
            },
            {
              id: 2,
              first_name: 'Steve',
              last_name: 'Vaughan',
              email: 'steve2@gmail.com',
              hashed_password:
                '$2a$12$C9AYYmcLVGYlGoO4vSZTPubGRsJ6d9ArJULzR48z8fOnTXbSwTUsN'
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

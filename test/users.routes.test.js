process.env.NODE_ENV = 'test';

const { suite, test } = require('mocha');
const request = require('supertest');
const knex = require('../knex');
const app = require('../app');
const { addDatabaseHooks } = require('./utils');

suite(
  'routes users',
  addDatabaseHooks(() => {
    test('GET /users', done => {
      request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(
          200,
          '[{"id":1,"first_name":"Steve","last_name":"Morse","email":"steve@gmail.com","hashed_password":"$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS"},{"id":2,"first_name":"Steve","last_name":"Vaughan","email":"steve2@gmail.com","hashed_password":"$2a$12$C9AYYmcLVGYlGoO4vSZTPubGRsJ6d9ArJULzR48z8fOnTXbSwTUsN"}]',
          done
        );
    });
  })
);

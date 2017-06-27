process.env.NODE_ENV = 'test';

const { suite, test } = require('mocha');
const assert = require('chai').assert
const request = require('supertest');
const knex = require('../knex');
const app = require('../app');
const { addDatabaseHooks } = require('./utils');

suite('routes trails', addDatabaseHooks(() => {

  // Create one
  test('POST /trails', done => {
    request(app)
      .post('/trails')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Blackbird',
        resortId: 1,
        difficulty: "black"
      })
      .expect(200, {
        id: 9,
        name: 'Blackbird',
        resortId: 1,
        difficulty: "black"
      })
      .expect('Content-Type', /json/)
      .end((httpErr, _res) => {
        if (httpErr) {
          return done(httpErr);
        }
        knex('trails')
          .where('id', 9)
          .first()
          .then((trail) => {
            assert.deepEqual(trail, {
              id: 9,
              name: 'Blackbird',
              resort_id: 1,
              difficulty: "black"
            });
            done();
          })
          .catch((dbErr) => {
            done(dbErr);
          });
      });
  });

  // Read one
  // test('GET /trails/:id', done => {
  //   request(app)
  //     .get('/trails/1')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200,
  //       {
  //         id: 1,
  //         name: 'GS Bowl',
  //         resort_id: 1,
  //         difficulty: "black"
  //       }, done);
  // });

  // Read all
  // test('GET /trails', done => {
  //   request(app)
  //     .get('/trails')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200,
  //       [{
  //         id: 1,
  //         name: 'GS Bowl',
  //         resort_id: 1,
  //         difficulty: "black"
  //       },
  //       {
  //         id: 2,
  //         name: 'Dipper Bowl',
  //         resort_id: 2,
  //         difficulty: "black"
  //       },
  //       {
  //         id: 3,
  //         name: 'Sierra Grande',
  //         resort_id: 3,
  //         difficulty: "black"
  //       },
  //       {
  //         id: 4,
  //         name: 'The Wall',
  //         resort_id: 4,
  //         difficulty: "double-black"
  //       },
  //       {
  //         id: 5,
  //         name: "The Palisades",
  //         resort_id: 5,
  //         difficulty: "double-black"
  //       },
  //       {
  //         id: 6,
  //         name: 'Chukker',
  //         resort_id: 6,
  //         difficulty: "blue"
  //       },
  //       {
  //         id: 7,
  //         name: 'Clipper',
  //         resort_id: 7,
  //         difficulty: "black"
  //       },
  //       {
  //         id: 8,
  //         name: 'South Face',
  //         resort_id: 8,
  //         difficulty: "black"
  //       }
  //     ], done);
  // });

}));

process.env.NODE_ENV = 'test';

const { suite, test } = require('mocha');
const assert = require('chai').assert
const request = require('supertest');
const knex = require('../knex');
const app = require('../app');
const { addDatabaseHooks } = require('./utils');

suite('routes favorites', addDatabaseHooks(() => {

  // Create one
  test('POST /favorites', done => {
    request(app)
      .post('/favorites')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        userId: 1,
        trailId: 1,
        ranking: 4
      })
      .expect(200, {
        id: 4,
        userId: 1,
        trailId: 1,
        ranking: 4
      })
      .expect('Content-Type', /json/)
      .end((httpErr, _res) => {
        if (httpErr) {
          return done(httpErr);
        }
        knex('favorites')
          .where('id', 4)
          .first()
          .then((favorite) => {
            assert.deepEqual(favorite, {
              id: 4,
              user_id: 1,
              trail_id: 1,
              ranking: 4
            });
            done();
          })
          .catch((dbErr) => {
            done(dbErr);
          });
      });
  });

  // Read one
  test('GET /favorites/:id', done => {
    request(app)
      .get('/favorites/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        id: 1,
        userId: 1,
        trailId: 2,
        ranking: 2
      }, done);
  });

  // // Update one
  // test('POST /favorites:id', done => {
  //   request(app)
  //     .post('/favorites/1')
  //     .set('Accept', 'application/json')
  //     .set('Content-Type', 'application/json')
  //     .send({
  //       rating: 5,
  //       review: "Fantastic"
  //     })
  //     .expect((res) => {
  //       delete res.body.createdAt;
  //       delete res.body.updatedAt;
  //     })
  //     .expect(200, {
  //       id: 1,
  //       userId: 1,
  //       trailId: 1,
  //       rating: 5,
  //       review:"Fantastic"
  //     })
  //     .expect('Content-Type', /json/)
  //     .end((httpErr, _res) => {
  //       if (httpErr) {
  //         return done(httpErr);
  //       }
  //       knex('favorites')
  //         .where('id', 1)
  //         .first()
  //         .then((favorite) => {
  //           delete favorite.created_at;
  //           delete favorite.updated_at;
  //           assert.deepEqual(favorite, {
  //             id: 1,
  //             user_id: 1,
  //             trail_id: 1,
  //             rating: 5,
  //             review:"Fantastic"
  //           });
  //           done();
  //         })
  //         .catch((dbErr) => {
  //           done(dbErr);
  //         });
  //     });
  // });
  //
  // // Delete one
  // test('DELETE /favorites/:id', (done) => {
  //   request(app)
  //     .del('/favorites/1')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200, {
  //       id: 1,
  //       userId: 1,
  //       trailId: 1,
  //       rating: 4,
  //       review:"very good",
  //       createdAt: '2016-06-29T14:26:16.000Z',
  //       updatedAt: '2016-06-29T14:26:16.000Z'
  //     })
  //     .end((httpErr, _res) => {
  //       if (httpErr) {
  //         return done(httpErr);
  //       }
  //       knex('favorites')
  //         .count('*')
  //         .where('id', 1)
  //         .then((records) => {
  //           const count = parseInt(records[0].count);
  //           // String because postgres can handle bigger numbers than JavaScript.
  //           assert(count === 0, 'zero records with id 1');
  //           done();
  //         })
  //         .catch((dbErr) => {
  //           done(dbErr);
  //         });
  //     });
  // });
  //
  // // Read all
  // test('GET /favorites', done => {
  //   request(app)
  //     .get('/favorites')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200, [{
  //         id: 1,
  //         userId: 1,
  //         trailId: 1,
  //         rating: 4,
	// 				review: "very good",
	// 				createdAt: '2016-06-29T14:26:16.000Z',
  //         updatedAt: '2016-06-29T14:26:16.000Z'
  //       },
  //       {
  //         id: 2,
  //         userId: 2,
  //         trailId: 2,
  //         rating: 2,
	// 				review: "ok",
	// 				createdAt: '2016-06-29T14:26:16.000Z',
  //         updatedAt: '2016-06-29T14:26:16.000Z'
  //       }
  //     ], done);
  // });

}));

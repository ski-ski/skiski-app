'use strict';

process.env.NODE_ENV = 'test';

const { suite, test } = require('mocha');
const request = require('supertest');
const knex = require('../knex');
const app = require('../app');
const { addDatabaseHooks } = require('./utils')

suite('routes token', addDatabaseHooks(() => {
  test('GET /token without token', (done) => {
    request(app)
      .get('/token')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, 'false', done);
  });

  test('POST /token', (done) => {
    request(app)
      .post('/token')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        email: 'steve@gmail.com',
        password: 'stevem'
      })
      .expect('set-cookie', /token=[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+; Path=\/;.+HttpOnly/)
      .expect((res) => {
        delete res.body.createdAt;
        delete res.body.updatedAt;
      })
      .expect(200, {
        id: 1,
        firstName: 'Steve',
        lastName: 'Morse',
        email: 'steve@gmail.com'
      })
      .expect('Content-Type', /json/)
      .end(done);
  });

  test('GET /token with token', (done) => {
    const agent = request.agent(app);

    request(app)
      .post('/token')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        email: 'steve@gmail.com',
        password: 'stevem'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        agent.saveCookies(res);

        agent
          .get('/token')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, 'true', done);
      });
  });

  test('DELETE /token', (done) => {
    request(app)
      .del('/token')
      .set('Accept', 'application/json')
      .expect('set-cookie', /token=; Path=\//)
      .expect(200)
      .end(done);
  });

  test('POST /token with bad email', (done) => {
    request(app)
      .post('/token')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        email: 'bad.email@gmail.com',
        password: 'stevem'
      })
      .expect('Content-Type', /plain/)
      .expect(400, 'Bad email or password', done);
  });

  test('POST /token with bad password', (done) => {
    request(app)
      .post('/token')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        email: 'steve@gmail.com',
        password: 'badpassword'
      })
      .expect('Content-Type', /plain/)
      .expect(400, 'Bad email or password', done);
  });
}));

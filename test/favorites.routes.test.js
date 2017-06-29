process.env.NODE_ENV = "test";

const { suite, test } = require("mocha");
const assert = require("chai").assert;
const request = require("supertest");
const knex = require("../knex");
const app = require("../app");
const { addDatabaseHooks } = require("./utils");

suite(
  "routes favorites",
  addDatabaseHooks(() => {
    const agent = request.agent(app);

    beforeEach(done => {
      request(app)
        .post("/token")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send({
          email: "steve@gmail.com",
          password: "stevem"
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          agent.saveCookies(res);
          done();
        });
    });

    test("POST /favorites", done => {
      agent
        .post("/favorites")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
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
        .expect("Content-Type", /json/)
        .end((httpErr, _res) => {
          if (httpErr) {
            return done(httpErr);
          }
          knex("favorites")
            .where("id", 4)
            .first()
            .then(favorite => {
              assert.deepEqual(favorite, {
                id: 4,
                user_id: 1,
                trail_id: 1,
                ranking: 4
              });
              done();
            })
            .catch(dbErr => {
              done(dbErr);
            });
        });
    });

    // Read one
    test("GET /favorites/:id", done => {
      agent
        .get("/favorites/1")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(
          200,
          {
            id: 1,
            userId: 1,
            trailId: 2,
            ranking: 2
          },
          done
        );
    });

    // Update one
    test("POST /favorites:id", done => {
      agent
        .post("/favorites/1")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send({
          ranking: 5
        })
        .expect(200, {
          id: 1,
          userId: 1,
          trailId: 2,
          ranking: 5
        })
        .expect("Content-Type", /json/)
        .end((httpErr, _res) => {
          if (httpErr) {
            return done(httpErr);
          }
          knex("favorites")
            .where("id", 1)
            .first()
            .then(favorite => {
              assert.deepEqual(favorite, {
                id: 1,
                user_id: 1,
                trail_id: 2,
                ranking: 5
              });
              done();
            })
            .catch(dbErr => {
              done(dbErr);
            });
        });
    });

    // Delete one
    test("DELETE /favorites/:id", done => {
      agent
        .del("/favorites/1")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, {
          id: 1,
          userId: 1,
          trailId: 2,
          ranking: 2
        })
        .end((httpErr, _res) => {
          if (httpErr) {
            return done(httpErr);
          }
          knex("favorites")
            .count("*")
            .where("id", 1)
            .then(records => {
              const count = parseInt(records[0].count);
              // String because postgres can handle bigger numbers than JavaScript.
              assert(count === 0, "zero records with id 1");
              done();
            })
            .catch(dbErr => {
              done(dbErr);
            });
        });
    });

    // Read all
    test("GET /favorites", done => {
      agent
        .get("/favorites")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(
          200,
          [
            {
              id: 1,
              userId: 1,
              trailId: 2,
              ranking: 2
            }
          ],
          done
        );
    });
  })
);

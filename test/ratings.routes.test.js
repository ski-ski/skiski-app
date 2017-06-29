process.env.NODE_ENV = "test";

const { suite, test } = require("mocha");
const assert = require("chai").assert;
const request = require("supertest");
const knex = require("../knex");
const app = require("../app");
const { addDatabaseHooks } = require("./utils");

suite(
  "routes ratings",
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

    test("POST /ratings", done => {
      request(app)
        .post("/ratings")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send({
          userId: 1,
          trailId: 2,
          rating: 3,
          review: "Pretty good"
        })
        .expect(res => {
          delete res.body.createdAt;
          delete res.body.updatedAt;
        })
        .expect(200, {
          id: 3,
          userId: 1,
          trailId: 2,
          rating: 3,
          review: "Pretty good"
        })
        .expect("Content-Type", /json/)
        .end((httpErr, _res) => {
          if (httpErr) {
            return done(httpErr);
          }
          knex("ratings")
            .where("id", 3)
            .first()
            .then(rating => {
              delete rating.created_at;
              delete rating.updated_at;
              assert.deepEqual(rating, {
                id: 3,
                user_id: 1,
                trail_id: 2,
                rating: 3,
                review: "Pretty good"
              });
              done();
            })
            .catch(dbErr => {
              done(dbErr);
            });
        });
    });

    // Read one
    test("GET /ratings/:id", done => {
      request(app)
        .get("/ratings/1")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(
          200,
          {
            id: 1,
            userId: 1,
            trailId: 1,
            rating: 4,
            review: "very good",
            createdAt: "2016-06-29T14:26:16.000Z",
            updatedAt: "2016-06-29T14:26:16.000Z"
          },
          done
        );
    });

    // Update one
    test("POST /ratings:id", done => {
      agent
        .post("/ratings/1")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send({
          rating: 5,
          review: "Fantastic"
        })
        .expect(res => {
          delete res.body.createdAt;
          delete res.body.updatedAt;
        })
        .expect(200, {
          id: 1,
          userId: 1,
          trailId: 1,
          rating: 5,
          review: "Fantastic"
        })
        .expect("Content-Type", /json/)
        .end((httpErr, _res) => {
          if (httpErr) {
            return done(httpErr);
          }
          knex("ratings")
            .where("id", 1)
            .first()
            .then(rating => {
              delete rating.created_at;
              delete rating.updated_at;
              assert.deepEqual(rating, {
                id: 1,
                user_id: 1,
                trail_id: 1,
                rating: 5,
                review: "Fantastic"
              });
              done();
            })
            .catch(dbErr => {
              done(dbErr);
            });
        });
    });

    // Delete one
    test("DELETE /ratings/:id", done => {
      agent
        .del("/ratings/1")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, {
          id: 1,
          userId: 1,
          trailId: 1,
          rating: 4,
          review: "very good",
          createdAt: "2016-06-29T14:26:16.000Z",
          updatedAt: "2016-06-29T14:26:16.000Z"
        })
        .end((httpErr, _res) => {
          if (httpErr) {
            return done(httpErr);
          }
          knex("ratings")
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
    test("GET /ratings", done => {
      request(app)
        .get("/ratings")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(
          200,
          [
            {
              id: 1,
              userId: 1,
              trailId: 1,
              rating: 4,
              review: "very good",
              createdAt: "2016-06-29T14:26:16.000Z",
              updatedAt: "2016-06-29T14:26:16.000Z"
            },
            {
              id: 2,
              userId: 2,
              trailId: 2,
              rating: 2,
              review: "ok",
              createdAt: "2016-06-29T14:26:16.000Z",
              updatedAt: "2016-06-29T14:26:16.000Z"
            }
          ],
          done
        );
    });
  })
);

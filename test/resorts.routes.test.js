process.env.NODE_ENV = "test";
const { suite, test } = require("mocha");
const assert = require("chai").assert;
const request = require("supertest");
const knex = require("../knex");
const app = require("../app");
const { addDatabaseHooks } = require("./utils");

suite(
  "routes resorts",
  addDatabaseHooks(() => {
    test("GET /resorts", done => {
      request(app)
        .get("/resorts")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(response => {
          console.log(Object.keys(response.body[0]));
          assert.deepEqual(response.body.map(i => Object.keys(i)), [
            "id",
            "name",
            "city",
            "windspeed",
            "highTemperature",
            "lowTemperature",
            "snowDepth"
          ]);
        });
      done();
    });

    test("GET /resorts/:id", done => {
      request(app)
        .get("/resorts/1")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(response => {
          assert.deepEqual(Object.keys(response.body[0]), [
            "id",
            "name",
            "city",
            "windspeed",
            "highTemperature",
            "lowTemperature",
            "snowDepth"
          ]);
        });
      done();
    });
  })
);

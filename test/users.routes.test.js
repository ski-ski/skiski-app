process.env.NODE_ENV = "test";

const { suite, test } = require("mocha");
const bcrypt = require("bcrypt");
const assert = require("chai").assert;
const request = require("supertest");
const knex = require("../knex");
const app = require("../app");
const { addDatabaseHooks } = require("./utils");

suite(
  "routes users",
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
    test("GET /users", done => {
      request(app)
        .get("/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(
          200,
          '[{"id":1,"firstName":"Steve","lastName":"Morse","email":"steve@gmail.com","hashedPassword":"$2a$10$Sc1JH2uOZ1Cv0t3hoWoc1OyWCdy6Q6BP07b8zWqjT2A2bBbZr6Ab6"},{"id":2,"firstName":"Steve","lastName":"Vaughan","email":"steve2@gmail.com","hashedPassword":"$2a$10$ha5HzJWYkRcwQLhT9kHb.eZJ0sT26edJnHAcbpPrF5tMqo3w26Ux2"}]',
          done
        );
    });

    test("GET /users/:id", done => {
      request(app)
        .get("/users/1")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(
          200,
          {
            id: 1,
            firstName: "Steve",
            lastName: "Morse",
            email: "steve@gmail.com",
            hashedPassword:
              "$2a$10$Sc1JH2uOZ1Cv0t3hoWoc1OyWCdy6Q6BP07b8zWqjT2A2bBbZr6Ab6"
          },
          done
        );
    });

    test("POST /users", done => {
      const password = "steveh";

      request(app)
        .post("/users")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send({
          firstName: "Steve",
          lastName: "Howe",
          email: "steveh@gmail.com",
          password: password
        })
        .expect(200, {
          id: 3,
          firstName: "Steve",
          lastName: "Howe",
          email: "steveh@gmail.com"
        })
        .expect("Content-Type", /json/)
        .end((httpErr, _res) => {
          if (httpErr) {
            return done(httpErr);
          }

          knex("users")
            .where("id", 3)
            .first()
            .then(user => {
              const hashedPassword = user.hashed_password;

              delete user.hashed_password;

              assert.deepEqual(user, {
                id: 3,
                first_name: "Steve",
                last_name: "Howe",
                email: "steveh@gmail.com"
              });

              const isMatch = bcrypt.compareSync(password, hashedPassword);

              assert.isTrue(isMatch, "passwords don't match");
              done();
            })
            .catch(dbErr => {
              done(dbErr);
            });
        });
    });
    test("POST /users when user already exists", done => {
      const password = "stevem";

      request(app)
        .post("/users")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send({
          firstName: "Steve",
          lastName: "Morse",
          email: "steve@gmail.com",
          password: password
        })
        .expect(400, "User already exits");
      done();
    });

    test("DELETE /users/:id", done => {
      agent
        .del("/users/1")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, {
          id: 1,
          firstName: "Steve",
          lastName: "Morse",
          email: "steve@gmail.com",
          hashedPassword:
            "$2a$10$Sc1JH2uOZ1Cv0t3hoWoc1OyWCdy6Q6BP07b8zWqjT2A2bBbZr6Ab6"
        })
        .end((httpErr, _res) => {
          if (httpErr) {
            return done(httpErr);
          }
          knex("users")
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
  })
);

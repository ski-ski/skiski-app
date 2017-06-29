const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const humps = require("humps");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Users = require("../repositories/Users");


/**
 * @api {post} /users Create user account
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiParam {String} firstName First name
 * @apiParam {String} lastName Last name
 * @apiParam {String} email Email address
 * @apiParamExample {json} Input
 *    {
 *      "firstName": "John",
 *      "lastName": "Doe",
 *      "email": "john.doe@gmail.com"
 *    }
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} firstName First name
 * @apiSuccess {String} lastName Last name
 * @apiSuccess {String} email Email address
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      firstName: "John",
 *      lastName: "Doe",
 *      email: "john.doe@gmail.com"
 *    }
 *
 * @apiErrorExample {String} Create error
 *    HTTP/1.1 400 Bad Request
 *    User already exists
 */
router.post("/users", (req, res, next) => {
  let users = new Users();
  // Check if account already exists
  users.getUserByEmail(req.body.email).then(existingUserData => {
    if (existingUserData) {
      return res.status(400).send("User already exists");
    }
    const password = req.body.password;
    const saltRounds = 10;
    let userData = {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email
    };
    if (userData.first_name === "Dave" && userData.last_name === "Gallup") {
      res.status(403).send("Dave Sucks");
    } else {
      bcrypt
        .hash(password, saltRounds)
        .then(passwordHash => {
          userData.hashed_password = passwordHash;
          return users.createUser(userData);
        })
        .then(user => {
          res.send(humps.camelizeKeys(user[0]));
        })
        .catch(err => {
          next(err);
        });
    }
  });
});


/**
 * @api {get} /users List all users
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiSuccess {Object[]} users Array of user records
 * @apiSuccess {Number} users.id User ID
 * @apiSuccess {String} users.firstName First name
 * @apiSuccess {String} users.lastName Last name
 * @apiSuccess {String} users.email Email address
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [{
 *       "id": "1",
 *       "firstName": "Jane",
 *       "lastName": "Doe",
 *       "email": "jane.doe@gmail.com"
 *      },
 *      {
 *       "id": "2",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "email": "john.doe@gmail.com"
 *      }]
 *
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/users", (req, res) => {
  let users = new Users();
  let promise = users.getUsers();

  promise
    .then(users => {
      if (!users) {
        res.status(404).send("No users found");
      }
      res.json(humps.camelizeKeys(users));
    })
    .catch(err => {
      res.status(500).send(err);
    });
});


/**
 * @api {get} /user/:id Request User information
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiParam {id} id User id
 * @apiSuccess {String} id User ID
 * @apiSuccess {String} firstName First name
 * @apiSuccess {String} lastName Last name
 * @apiSuccess {String} email Email address
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *     {
 *       "id": "2",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "email": "john.doe@gmail.com",
 *       "hashedPassword": "$2a$12$C9AYYmcLVGYlGoO4...."
 *     }
 *
 * @apiErrorExample {json} User not found
 *    HTTP/1.1 404 Not Found
 */
router.get("/users/:id", (req, res) => {
  let users = new Users();
  let promise = users.getUser(req.params.id);

  promise
    .then(user => {
      if (!user) {
        res.status(404).send("Not found");
      }
      res.json(humps.camelizeKeys(user[0]));
    })
    .catch(err => {
      res.status(500).send(err);
    });
});


/**
 * @api {post} /users/:id Update a user
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiParam {id} id User id
 * @apiParam {String} firstName First name
 * @apiParam {String} lastName Last name
 * @apiParam {String} email Email address
 * @apiParamExample {json} Input
 *    {
 *      "firstName": "Johnny"
 *    }
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 *     {
 *       "id": "2",
 *       "firstName": "Johnny",
 *       "lastName": "Doe",
 *       "email": "john.doe@gmail.com"
 *     }
 *
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post("/users/:id", checkUserLoggedIn, (req, res) => {
  let users = new Users();

  if (Number(req.userId) !== Number(req.params.id)) {
    return res.sendStatus(401);
  }
  let { first_name, last_name, email, hashed_password } = humps.decamelizeKeys(
    req.body
  );
  let validFields = { first_name, last_name, email, hashed_password };
  let filteredObject = _(validFields)
    .omitBy(_.isUndefined)
    .omitBy(_.isNull)
    .value();
  let promise = users.updateUser(req.params.id, filteredObject);
  promise.then(user => {
    res.json(humps.camelizeKeys(user));
  });
});


/**
 * @api {delete} /users/:id Delete a user
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiParam {id} id User id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *     {
 *       "id": "2",
 *       "firstName": "Johnny",
 *       "lastName": "Doe",
 *       "email": "john.doe@gmail.com"
 *     }
 *
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 500 Internal Server Error
 */
 router.delete("/users/:id", checkUserLoggedIn, (req, res) => {
  let users = new Users();
  let userId = req.userId;
  if (isNaN(userId)) {
    return res.sendStatus(404);
  }

  let promiseFromQuery = users.deleteUser(userId);

  promiseFromQuery
    .then(user => {
      if (!user[0]) {
        res.sendStatus(404);
      } else {
        var camelized = humps.camelizeKeys(user[0]);
        delete camelized.userId;
        res.send(camelized);
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});


function checkUserLoggedIn(req, res, next) {
  if (!req.cookies.token) {
    res.sendStatus(401);
  } else {
    let userObject = jwt.decode(req.cookies.token);
    let userId = userObject.sub.id;
    req.userId = userId;
    next();
  }
}

module.exports = router;

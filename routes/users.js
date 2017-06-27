const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex.js');
const humps = require('humps');
const jwt = require('jsonwebtoken');
const Users = require('../repositories/Users');

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The id of the user was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "User not found"
 *     }
 */

/**
 * @api {get} /users Request all information for all users
 * @apiName GetUsers
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiDescription Testing testing. This is api Description.
 *
 * @apiExample Example usage:
 * curl -i http://localhost/users
 *
 * @apiSuccess {Object[]} users Array of user records.
 *
 * @apiSuccess {Number}   id            User ID.
 * @apiSuccess {String}   firstName     First name.
 * @apiSuccess {String}   lastName      Last name.
 * @apiSuccess {String}   email         Email address.
 *
 * @apiSuccessExample Success-Response:
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
 * @apiUse UserNotFoundError
 */
router.get('/users', (req, res) => {
  let users = new Users();
  let promise = users.getUsers();

  promise
    .then(users => {
      if (!users) {
        res.status(404).send('No users found');
      }
      res.json(humps.camelizeKeys(users));
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

/**
 * @api {get} /user/:id Request User information
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiDescription Testing testing. This is api Description.
 *
 * @apiParam {String} id User ID.
 *
 * @apiExample Example usage:
 * curl -i http://localhost/users/2
 *
 * @apiSuccess {String}   id            User ID.
 * @apiSuccess {String}   firstName     First name.
 * @apiSuccess {String}   lastName      Last name.
 * @apiSuccess {String}   email         Email address.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "2",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "email": "john.doe@gmail.com"
 *     }
 *
 * @apiUse UserNotFoundError
*/
router.get('/users/:id', (req, res) => {
  let users = new Users();
  let promise = users.getUser(req.params.id);

  promise
  .then(user => {
    if (!user) {
      res.status(404).send('Not found');
    }
    res.json(humps.camelizeKeys(user[0]));
  })
  .catch(err => {
    res.status(500).send(err);
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex.js');
const humps = require('humps');
const jwt = require('jsonwebtoken');
const Users = require('../repositories/Users');


/**
 * @api {get} /users/ Request all information for all users
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiSuccess {Object[]} All user data.
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
 * @api {get} /users/:id Request user information
 * @apiName GetUser
 * @apiGroup Users
 *@apiParam {Number} id Users unique id
 * @apiSuccess {Object[]} All user data.
 */
router.get('/users/:id', (req, res) => {
  let users = new Users();
  let promise = users.getUser(req.params.id);

  promise
  .then(user => {
    if (!user) {
      res.status(404).send('Not found');
    }
    res.json(humps.camelizeKeys(user));
  })
  .catch(err => {
    res.status(500).send(err);
  });
});

module.exports = router;

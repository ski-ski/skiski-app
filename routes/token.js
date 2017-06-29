const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex.js');
// const humps = require('humps');
const jwt = require('jsonwebtoken');
const Users = require('../repositories/Users');


/**
 * @api {post} /token Log in
 * @apiGroup Token
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email Email address
 * @apiParam {String} password Password
 * @apiParamExample {json} Input
 *    {
 *      "email": "john.doe@gmail.com",
 *      "password": "mY53cr3t"
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
 *    Bad email or password
 */
router.post('/token', (req, res) => {
  let user;
  knex('users')
    .first()
    .where('email', req.body.email)
    .then((userData) => {
      if(!userData) {
        res.header('Content-Type', 'text/plain');
        return res.status(400).send('Bad email or password');
      }
      user = userData;
      let hashedPassword = user.hashed_password;
      bcrypt.compare(req.body.password, hashedPassword)
        .then((success) => {
          if (!success) {
            res.header('Content-Type', 'text/plain');
            return res.status(400).send('Bad email or password');
          }
          const jwtPayload = {
            iss: 'skiski_app',
            sub: {
              id: user.id,
              email: user.email
            }
          };
          const secret = process.env.JWT_KEY;
          const token = jwt.sign(jwtPayload, secret);
          let response = {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
          }
          res.cookie('token', token, {httpOnly: true}).send(response);
        })
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});


/**
 * @api {get} /token Check if logged in
 * @apiGroup Token
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Boolean} loggedIn true or false
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *     true
 *
 * @apiErrorExample {json} User not found
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/token', (req, res) => {
  if (req.cookies.token) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});


/**
 * @api {delete} /token Log out
 * @apiGroup Token
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete('/token', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(200).send(true);
});


module.exports = router;

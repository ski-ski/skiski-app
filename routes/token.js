const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex.js');
// const humps = require('humps');
const jwt = require('jsonwebtoken');
const Users = require('../repositories/Users');

/**
 * @apiDefine NotFoundError
 *
 * @apiError NotFoundError The requested path was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *
 *       "Not found"
 *
 */

/**
  * @apiDefine UnAuthorized
  *
  * @apiError UnAuthorized The user is not authorized to access this route.
  *
  * @apiErrorExample Error-Response:
  *     HTTP/1.1 401
  *
  *    "Not authorized"
  *
*/

/**
 * @apiDefine ServerError
 *
 * @apiError ServerError Interal server error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 505 Interal Server Error
 *
 *     "{}"
 *
 */


/**
 * @api {post} /token Log in
 * @apiVersion 1.0.0
 * @apiName PostToken
 * @apiGroup Token
 *
 * @apiDescription Creates a new user account.
 *
 * @apiParam {String} email Email address
 * @apiParam {String} password Password
 *
 * @apiExample Example usage:
 * curl -d 'email=john.doe@gmail.com&password=mY53cr3t' http://localhost/token
 *
 * @apiSuccess {Number} id          User ID
 * @apiSuccess {String} firstName   First name
 * @apiSuccess {String} lastName    Last name
 * @apiSuccess {String} email       Email address
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "id": 1,
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "email": "john.doe@gmail.com"
 *   }
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
 * @apiVersion 1.0.0
 * @apiName CheckToken
 * @apiGroup Token
 *
 * @apiDescription Check if user is logged in.
 *
 * @apiExample Example usage:
 * curl -i http://localhost/token
 *
 * @apiSuccess {Boolean} loggedIn true or false
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *     true
 *
 * @apiUse ServerError
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
 * @apiVersion 1.0.0
 * @apiName DeleteToken
 * @apiGroup Token
 *
 * @apiExample Example usage:
 * curl -X 'DELETE' http://localhost/token
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *
 * @apiUse ServerError
 */
router.delete('/token', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(200).send(true);
});


module.exports = router;

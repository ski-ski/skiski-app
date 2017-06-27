const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex.js');
// const humps = require('humps');
const jwt = require('jsonwebtoken');
const Users = require('../repositories/Users');

/**
 * @api {get} /token Check presence of token
 * @apiName CheckToken
 * @apiGroup token
 * @apiSuccess {boolean}
 */
router.get('/token', (req, res) => {
  if (req.cookies.token) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

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

router.delete('/token', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(200).send(true);
});


module.exports = router;

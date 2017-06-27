const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex.js');
const humps = require('humps');
const jwt = require('jsonwebtoken');
const Users = require('../repositories/Users');

router.get('/token', (req, res) => {
  if (req.cookies.token) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const humps = require('humps');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const Resorts = require('../repositories/Resorts');

router.get('/resorts', (req, res) => {
  let resorts = new Resorts();
  let promise = resorts.getResorts();

  promise
    .then(resorts => {
      if (!resorts) {
        res.status(404).send('No users found');
      }
      res.json(humps.camelizeKeys(resorts));
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.get('/resorts/:id', (req, res) => {
  let resorts = new Resorts();
  let promise = resorts.getResort(req.params.id);
  promise
    .then(resort => {
			console.log('this is the resort ', resort );
      if (!resort) {
        return res.status(404).send('No users found');
      }
				return res.json(humps.camelizeKeys(resort));
    })
    .catch(err => {
      res.status(500).send(err);
    });
});
module.exports = router;

const express = require('express');
const router = express.Router();
const humps = require('humps');
const _ = require('lodash');
const Trails = require('../repositories/Trails');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');


// Create one
router.post('/trails', (req, res, next) => {
  let trails = new Trails();
  let trailData = {
    name: req.body.name,
    resort_id: req.body.resortId,
    difficulty: req.body.difficulty
  };
  trails.createTrail(trailData)
  .then((trail) => {
    res.send(humps.camelizeKeys(trail[0]));
  })
  .catch((err) => {
    next(err);
  });
});


// Read one
router.get('/trails/:id', (req, res) => {
  let trails = new Trails();
  trails.getTrail(req.params.id)
  .then(trail => {
    if (!trail) {
      res.status(404).send('Not found');
    }
    res.json(humps.camelizeKeys(trail[0]));
  })
  .catch(err => {
    res.status(500).send(err);
  });
});


// Update one
router.post('/trails/:id', (req, res) =>{
  let trails = new Trails();
  let {name, resort_id, difficulty} = humps.decamelizeKeys(req.body);
  let validFields = {name, resort_id, difficulty};
  let filteredObject =  _(validFields).omitBy(_.isUndefined).omitBy(_.isNull).value();
  trails.updateTrail(req.params.id, filteredObject)
  .then((trail) => {
    res.json(humps.camelizeKeys(trail[0]));
  });
});


// Delete one
router.delete('/trails/:id', (req, res) => {
  let trails = new Trails();
  let id = req.params.id;
  if (isNaN(id)) {
    return res.sendStatus(404);
  }
  trails.deleteTrail(id)
  .then((trail) => {
    if (!trail[0]) {
      res.sendStatus(404);
    } else {
      res.send(humps.camelizeKeys(trail[0]));
    }
  })
  .catch(err => {
    res.status(500).send(err);
  });
});


// Read all
router.get('/trails', (req, res) => {
  let trails = new Trails();
  trails.getTrails()
  .then(trails => {
    if (!trails) {
      res.status(404).send('No trails found');
    }
    res.json(humps.camelizeKeys(trails));
  })
  .catch(err => {
    res.status(500).send(err);
  });
});


module.exports = router;

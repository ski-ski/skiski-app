const express = require('express');
const router = express.Router();
const humps = require('humps');
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
// router.get('/trails', (req, res) => {
//   let trails = new Trails();
//   let promise = trails.getUsers();
//
//   promise
//   .then(trails => {
//     if (!trails) {
//       res.status(404).send('No trails found');
//     }
//     res.json(humps.camelizeKeys(trails));
//   })
//   .catch(err => {
//     res.status(500).send(err);
//   });
// });


// Update one
// router.post('/trails/:id', (req, res) =>{
//   let trails = new Trails();
//   let {first_name, last_name, email,hashed_password} = humps.decamelizeKeys(req.body);
//   let validFields = {first_name, last_name, email, hashed_password}
//   let filteredObject =  _(validFields).omitBy(_.isUndefined).omitBy(_.isNull).value();
//   let promise = trails.updateUser(req.params.id, filteredObject);
//   promise
//   .then((trail) => {
//     res.json(humps.camelizeKeys(trail));
//   });
// });


// Delete one
// router.delete('/trails/:id', (req, res) => {
//   let trails = new Trails();
//   let id = req.params.id;
//
//   if (isNaN(id)) {
//     return res.sendStatus(404);
//   }
//
//   let promiseFromQuery = trails.deleteUser(id);
//
//   promiseFromQuery
//     .then((trail) => {
//       if (!trail[0]) {
//         res.sendStatus(404);
//       } else {
//         var camelized = humps.camelizeKeys(trail[0]);
//         delete camelized.id;
//         res.send(camelized);
//       }
//   })
//     .catch(err => {
//       res.status(500).send(err);
//   });
// });


// Read all
// router.get('/trails/:id', (req, res) => {
//   let trails = new Trails();
//   let promise = trails.getUser(req.params.id);
//
//   promise
//   .then(trail => {
//     if (!trail) {
//       res.status(404).send('Not found');
//     }
//     res.json(humps.camelizeKeys(trail[0]));
//   })
//   .catch(err => {
//     res.status(500).send(err);
//   });
// });


module.exports = router;

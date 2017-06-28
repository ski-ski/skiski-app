const express = require('express');
const router = express.Router();
const humps = require('humps');
const _ = require('lodash');
const Ratings = require('../repositories/Ratings');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');


// Create one
router.post('/ratings', (req, res, next) => {
  let ratings = new Ratings();
  let ratingData = {
    user_id: req.body.userId,
    trail_id: req.body.trailId,
    rating: req.body.rating,
    review: req.body.review
  };
  ratings.createRating(ratingData)
  .then((rating) => {
    res.send(humps.camelizeKeys(rating[0]));
  })
  .catch((err) => {
    next(err);
  });
});


// Read one
router.get('/ratings/:id', (req, res) => {
  let ratings = new Ratings();
  ratings.getRating(req.params.id)
  .then(rating => {
    if (!rating) {
      res.status(404).send('Not found');
    }
    res.json(humps.camelizeKeys(rating[0]));
  })
  .catch(err => {
    res.status(500).send(err);
  });
});


// Update one
// router.post('/ratings/:id', (req, res) =>{
//   let ratings = new Ratings();
//   let {name, resort_id, difficulty} = humps.decamelizeKeys(req.body);
//   let validFields = {name, resort_id, difficulty};
//   let filteredObject =  _(validFields).omitBy(_.isUndefined).omitBy(_.isNull).value();
//   ratings.updaterating(req.params.id, filteredObject)
//   .then((rating) => {
//     res.json(humps.camelizeKeys(rating[0]));
//   });
// });


// Delete one
// router.delete('/ratings/:id', (req, res) => {
//   let ratings = new Ratings();
//   let id = req.params.id;
//   if (isNaN(id)) {
//     return res.sendStatus(404);
//   }
//   ratings.deleterating(id)
//   .then((rating) => {
//     if (!rating[0]) {
//       res.sendStatus(404);
//     } else {
//       res.send(humps.camelizeKeys(rating[0]));
//     }
//   })
//   .catch(err => {
//     res.status(500).send(err);
//   });
// });


// Read all
// router.get('/ratings', (req, res) => {
//   let ratings = new Ratings();
//   ratings.getRatings()
//   .then(ratings => {
//     if (!ratings) {
//       res.status(404).send('No ratings found');
//     }
//     res.json(humps.camelizeKeys(ratings));
//   })
//   .catch(err => {
//     res.status(500).send(err);
//   });
// });


module.exports = router;

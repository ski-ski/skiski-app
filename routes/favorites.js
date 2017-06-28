const express = require('express');
const router = express.Router();
const humps = require('humps');
const _ = require('lodash');
const Favorites = require('../repositories/Favorites');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');


// Create one
router.post('/favorites', (req, res, next) => {
  let favorites = new Favorites();
  let favoriteData = {
    user_id: req.body.userId,
    trail_id: req.body.trailId,
    ranking: req.body.ranking
  };
  favorites.createFavorite(favoriteData)
  .then((favorite) => {
    res.send(humps.camelizeKeys(favorite[0]));
  })
  .catch((err) => {
    next(err);
  });
});


// // Read one
// router.get('/favorites/:id', (req, res) => {
//   let favorites = new favorites();
//   favorites.getfavorite(req.params.id)
//   .then(favorite => {
//     if (!favorite) {
//       res.status(404).send('Not found');
//     }
//     res.json(humps.camelizeKeys(favorite[0]));
//   })
//   .catch(err => {
//     res.status(500).send(err);
//   });
// });
//
//
// // Update one
// router.post('/favorites/:id', (req, res) =>{
//   let favorites = new favorites();
//   let {user_id, trail_id, favorite, ranking} = humps.decamelizeKeys(req.body);
//   let validFields = {user_id, trail_id, favorite, ranking};
//   let filteredObject =  _(validFields).omitBy(_.isUndefined).omitBy(_.isNull).value();
//   favorites.updatefavorite(req.params.id, filteredObject)
//   .then((favorite) => {
//     res.json(humps.camelizeKeys(favorite[0]));
//   });
// });
//
//
// // Delete one
// router.delete('/favorites/:id', (req, res) => {
//   let favorites = new favorites();
//   let id = req.params.id;
//   if (isNaN(id)) {
//     return res.sendStatus(404);
//   }
//   favorites.deletefavorite(id)
//   .then((favorite) => {
//     if (!favorite[0]) {
//       res.sendStatus(404);
//     } else {
//       res.send(humps.camelizeKeys(favorite[0]));
//     }
//   })
//   .catch(err => {
//     res.status(500).send(err);
//   });
// });
//
//
// // Read all
// router.get('/favorites', (req, res) => {
//   let favorites = new favorites();
//   favorites.getfavorites()
//   .then(favorites => {
//     if (!favorites) {
//       res.status(404).send('No favorites found');
//     }
//     res.json(humps.camelizeKeys(favorites));
//   })
//   .catch(err => {
//     res.status(500).send(err);
//   });
// });


module.exports = router;

const express = require("express");
const router = express.Router();
const humps = require("humps");
const _ = require("lodash");
const Favorites = require("../repositories/Favorites");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
 * @api {post} /favorites Create a favorite trail
 * @apiVersion 1.0.0
 * @apiName PostFavorite
 * @apiGroup Favorites
 *
 * @apiDescription Signed up users can create favorite trails and rank them
 *
 * @apiParam {Number} userId    User ID.
 * @apiParam {Number} trailId   Trail ID.
 * @apiParam {Number} ranking   Tail Ranking
 *
 * @apiExample Example usage:
 * curl -d 'userId=1&trailId=1&ranking=1' http://localhost/favorites
 *
 * @apiSuccess {Number}   id          Favorite ID.
 * @apiSuccess {Number}   ranking     Ranking.
 * @apiSuccess {Number}   trailId     Trail ID.
 * @apiSuccess {Number}   userId       User ID.
 *
 * @apiSuccessExample Success-Response:
 *
 *   HTTP/1.1 200 OK
 *  {
 *    "id": 4,
 *    "ranking": 3,
 *    "trailId": 4,
 *    "userId": 1
 *   }
 *
 * @apiUse ServerError
 * @apiUse NotFoundError
*/
router.post("/favorites", (req, res, next) => {
  let favorites = new Favorites();

  let favoriteData = {
    user_id: req.body.userId,
    trail_id: req.body.trailId,
    ranking: req.body.ranking
  };
  favorites
    .createFavorite(favoriteData)
    .then(favorite => {
      res.send(humps.camelizeKeys(favorite[0]));
    })
    .catch(err => {
      next(err);
    });
});

/**
 * @api {get} /favorites/:id View favorited trail
 * @apiVersion 1.0.0
 * @apiName GETFavorite
 * @apiGroup Favorites
 *
 * @apiDescription Users can view created favorite when using its ID
 *
 * @apiParam {Number} id    Favorite ID.
 *
 *
 * @apiExample Example usage:
 * curl -i http://localhost/favorites/1
 *
 * @apiSuccess {Number}   id          Ranking ID.
 * @apiSuccess {Number}   ranking     Ranking.
 * @apiSuccess {Number}   trailId     Trail ID.
 * @apiSuccess {Number}   userId       User ID.
 *
 * @apiSuccessExample Success-Response:
 *
 *   HTTP/1.1 200 OK
 *  {
 *    "id": 1,
 *    "ranking": 3,
 *    "trailId": 4,
 *    "userId": 1
 *   }
 *
 * @apiUse ServerError
 * @apiUse UnAuthorized
 * @apiUse NotFoundError
*/

router.get("/favorites/:id", checkUserLoggedIn, (req, res) => {
  let favorites = new Favorites();
  favorites
    .getFavorite(req.params.id)
    .then(record => {
      if (Number(req.userId) !== Number(record[0].user_id)) {
        return false;
      }
      return true;
    })
    .then(authorized => {
      if (authorized) {
        favorites.getFavorite(req.params.id).then(favorite => {
          if (!favorite) {
            res.status(404).send("Not found");
          }
          res.json(humps.camelizeKeys(favorite[0]));
        });
      } else {
        res.sendStatus(401);
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

/**
 * @api {post} /favorites/:id  Update a favorited trail
 * @apiVersion 1.0.0
 * @apiName UpdateFavorite
 * @apiGroup Favorites
 *
 * @apiDescription Logged in users update their favorited trails
 *
 * @apiParam {Number} trailId   Trail ID.
 * @apiParam {Number} ranking   Tail Ranking
 *
 * @apiExample Example usage:
 * curl -d 'ranking=5' http://localhost/favorites/1
 *
 * @apiSuccess {Number}   id          Favorite ID.
 * @apiSuccess {Number}   ranking     Ranking.
 * @apiSuccess {Number}   trailId     Trail ID.
 * @apiSuccess {Number}   userId       User ID.
 *
 * @apiSuccessExample Success-Response:
 *
 *   HTTP/1.1 200 OK
 *  {
 *    "id": 1,
 *    "ranking": 5
 *    "trailId": 4,
 *    "userId": 1
 *   }
 *
 * @apiUse ServerError
 * @apiUse UnAuthorized
 * @apiUse NotFoundError
*/
router.post("/favorites/:id", checkUserLoggedIn, (req, res) => {
  let favorites = new Favorites();
  favorites
    .getFavorite(req.params.id)
    .then(record => {
      if (Number(req.userId) !== Number(record[0].user_id)) {
        return false;
      }
      return true;
    })
    .then(authorized => {
      if (authorized) {
        let { user_id, trail_id, ranking } = humps.decamelizeKeys(req.body);
        let validFields = { user_id, trail_id, ranking };
        let filteredObject = _(validFields)
          .omitBy(_.isUndefined)
          .omitBy(_.isNull)
          .value();
        favorites
          .updateFavorite(req.params.id, filteredObject)
          .then(favorite => {
            res.json(humps.camelizeKeys(favorite[0]));
          });
      } else {
        res.sendStatus(401);
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

/**
 * @api {delete} /favorites/:id  Delete a favorite
 * @apiVersion 1.0.0
 * @apiName DeleteFavorite
 * @apiGroup Favorites
 *
 * @apiDescription Logged in users delete their favorited trail
 *
 * @apiParam {Number} id   Favorite ID.
 *
 * @apiExample Example usage:
 * curl -X 'DELETE' http://localhost/favorites/1
 *
 * @apiSuccess {Number}   id          Favorite ID.
 * @apiSuccess {Number}   ranking     Ranking.
 * @apiSuccess {Number}   trailId     Trail ID.
 * @apiSuccess {Number}   userId       User ID.
 *
 * @apiSuccessExample Success-Response:
 *
 *   HTTP/1.1 200 OK
 *  {
 *    "id": 1,
 *    "ranking": 5
 *    "trailId": 4,
 *    "userId": 1
 *   }
 *
 * @apiUse ServerError
 * @apiUse UnAuthorized
 * @apiUse NotFoundError
*/
router.delete("/favorites/:id", checkUserLoggedIn, (req, res) => {
  let favorites = new Favorites();
  if (isNaN(req.params.id)) {
    return res.sendStatus(404);
  }
  favorites
    .getFavorite(req.params.id)
    .then(record => {
      if (Number(req.userId) !== Number(record[0].user_id)) {
        return false;
      }
      return true;
    })
    .then(authorized => {
      if (authorized) {
        favorites.deleteFavorite(req.params.id).then(favorite => {
          if (!favorite[0]) {
            res.sendStatus(404);
          } else {
            res.send(humps.camelizeKeys(favorite[0]));
          }
        });
      } else {
        res.sendStatus(401);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

/**
 * @api {get} /favorites View all favorited trails
 * @apiVersion 1.0.0
 * @apiName GETFavorites
 * @apiGroup Favorites
 *
 * @apiDescription Logged in users can view all their favorited trails
 *
 *
 * @apiExample Example usage:
 * curl -i http://localhost/favorites
 *
 * @apiSuccess {Object[]} favorites Array of objects with favorited trails.
 *
 * @apiSuccess {Number}   id          Ranking ID.
 * @apiSuccess {Number}   ranking     Ranking.
 * @apiSuccess {Number}   trailId     Trail ID.
 * @apiSuccess {Number}   userId       User ID.
 *
 * @apiSuccessExample Success-Response:
 *
 *   HTTP/1.1 200 OK
 *  [
 *    {
 *      "id": 1,
 *      "ranking": 3,
 *      "trailId": 4,
 *      "userId": 1
 *    } ,
 *    {
 *      "id": 2,
 *      "ranking": 3,
 *      "trailId": 4,
 *      "userId": 1
 *    }
 *  ]
 *
 * @apiUse ServerError
 * @apiUse UnAuthorized
 * @apiUse NotFoundError
*/

router.get("/favorites", checkUserLoggedIn, (req, res) => {
  let favorites = new Favorites();
  favorites
    .getFavorites(req.userId)
    .then(favorites => {
      if (!favorites) {
        res.status(404).send("No favorites found");
      }
      res.json(humps.camelizeKeys(favorites));
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

function checkUserLoggedIn(req, res, next) {
  if (!req.cookies.token) {
    res.sendStatus(401);
  } else {
    let userObject = jwt.decode(req.cookies.token);
    let userId = userObject.sub.id;
    req.userId = userId;
    next();
  }
}

module.exports = router;

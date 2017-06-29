const express = require("express");
const router = express.Router();
const humps = require("humps");
const _ = require("lodash");
const Ratings = require("../repositories/Ratings");
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

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
  * @api {post} /ratings Create a rating for a trail
  * @apiVersion 1.0.0
  * @apiName PostRating
  * @apiGroup Ratings
  *
  * @apiDescription Users can create a rating for a trail.
  *
  * @apiParam {Number} userId    User ID.
  * @apiParam {Number} trailId   Trail ID.
  * @apiParam {Number} rating   Trail Rating.
  * @apiParam {String} review   Trail review.
  *
  * @apiExample Example usage:
  * curl -d 'userId=1&trailId=1&rating=4&review="very good"' http://localhost/favorites
  *
  * @apiSuccess {Number} id           Rating ID.
  * @apiSuccess {Number} userId       User ID.
  * @apiSuccess {Number} trailId      Trail ID.
  * @apiSuccess {Number} rating       Trail Rating.
  * @apiSuccess {String} review       Tail review.
  *
  * @apiSuccessExample Success-Response:
  *
  *   HTTP/1.1 200 OK
  *  {
  *     "id": 1,
  *     "user_id": 1,
  *     "trail_id": 1,
  *     "rating": 4,
  *     "review": "very good"
  *   }
  *
  * @apiUse ServerError
  * @apiUse NotFoundError
 */

router.post("/ratings", (req, res, next) => {
  let ratings = new Ratings();
  let ratingData = {
    user_id: req.body.userId,
    trail_id: req.body.trailId,
    rating: req.body.rating,
    review: req.body.review
  };
  ratings
    .createRating(ratingData)
    .then(rating => {
      res.send(humps.camelizeKeys(rating[0]));
    })
    .catch(err => {
      next(err);
    });
});

/**
  * @api {get} /ratings/:id View a rating
  * @apiVersion 1.0.0
  * @apiName ViewRating
  * @apiGroup Ratings
  *
  * @apiDescription Users can view a rating for a trail.
  *
  * @apiParam {Number} id    Rating ID.
  *
  * @apiExample Example usage:
  * curl http://localhost/favorites/1
  *
  * @apiSuccess {Number} id           Rating ID.
  * @apiSuccess {Number} userId       User ID.
  * @apiSuccess {Number} trailId      Trail ID.
  * @apiSuccess {Number} rating       Trail Rating.
  * @apiSuccess {String} review       Tail review.
  * @apiSuccess {String} createdAt    Timestamp when rating was created.
  * @apiSuccess {String} updatedAt    Timestamp when rating was updated.
  *
  * @apiSuccessExample Success-Response:
  *
  *   HTTP/1.1 200 OK
  *  {
  *     "id": 1,
  *     "user_id": 1,
  *     "trail_id": 1,
  *     "rating": 4,
  *     "review":"very good",
  *     "created_at": '2016-06-29 14:26:16 UTC',
  *     "updated_at": '2016-06-29 14:26:16 UTC'
  *   }
  *
  * @apiUse ServerError
  * @apiUse NotFoundError
 */
router.get("/ratings/:id", (req, res) => {
  let ratings = new Ratings();
  ratings
    .getRating(req.params.id)
    .then(rating => {
      if (!rating) {
        res.status(404).send("Not found");
      }
      res.json(humps.camelizeKeys(rating[0]));
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

/**
  * @api {post} /ratings/:id Update a rating for a trail
  * @apiVersion 1.0.0
  * @apiName UpdateRating
  * @apiGroup Ratings
  *
  * @apiDescription Users can update a rating for a trail.
  *
  * @apiParam {Number} id        Rating ID.
  * @apiParam {Number} userId    User ID.
  * @apiParam {Number} trailId   Trail ID.
  * @apiParam {Number} rating   Trail Rating.
  * @apiParam {String} review   Trail review.
  *
  * @apiExample Example usage:
  * curl -d 'review="sucks"' http://localhost/favorites/1
  *
  * @apiSuccess {Number} id           Rating ID.
  * @apiSuccess {Number} userId       User ID.
  * @apiSuccess {Number} trailId      Trail ID.
  * @apiSuccess {Number} rating       Trail Rating.
  * @apiSuccess {String} review       Tail review.
  *
  * @apiSuccessExample Success-Response:
  *
  *   HTTP/1.1 200 OK
  *  {
  *     "id": 1,
  *     "user_id": 1,
  *     "trail_id": 1,
  *     "rating": 4,
  *     "review": "very good"
  *   }
  *
  * @apiUse ServerError
  * @apiUse NotFoundError
 */
router.post("/ratings/:id", (req, res) => {
  let ratings = new Ratings();
  let { user_id, trail_id, rating, review } = humps.decamelizeKeys(req.body);
  let validFields = { user_id, trail_id, rating, review };
  let filteredObject = _(validFields)
    .omitBy(_.isUndefined)
    .omitBy(_.isNull)
    .value();
  ratings.updateRating(req.params.id, filteredObject).then(rating => {
    res.json(humps.camelizeKeys(rating[0]));
  });
});

/**
  * @api {delete} /ratings/:id delete a rating for a trail
  * @apiVersion 1.0.0
  * @apiName DeleteRating
  * @apiGroup Ratings
  *
  * @apiDescription Users can delete a rating for a trail.
  *
  * @apiParam {Number} id        Rating ID.
  *
  * @apiExample Example usage:
  * curl -X http://localhost/favorites/1
  *
  * @apiSuccess {Number} id           Rating ID.
  * @apiSuccess {Number} userId       User ID.
  * @apiSuccess {Number} trailId      Trail ID.
  * @apiSuccess {Number} rating       Trail Rating.
  * @apiSuccess {String} review       Tail review.
  * @apiSuccess {String} createdAt    Timestamp when rating was created.
  * @apiSuccess {String} updatedAt    Timestamp when rating was updated.
  *
  * @apiSuccessExample Success-Response:
  *
  *   HTTP/1.1 200 OK
  *  {
  *     "id: 1",
  *     "user_id": 1,
  *     "trail_id": 1,
  *     "rating": 4,
  *     "review": "sucks",
  *     "created_at": '2016-06-29 14:26:16 UTC',
  *     "updated_at": '2016-06-29 14:26:16 UTC'
  *   }
  *
  * @apiUse ServerError
  * @apiUse NotFoundError
 */
router.delete("/ratings/:id", (req, res) => {
  let ratings = new Ratings();
  let id = req.params.id;
  if (isNaN(id)) {
    return res.sendStatus(404);
  }
  ratings
    .deleteRating(id)
    .then(rating => {
      if (!rating[0]) {
        res.sendStatus(404);
      } else {
        res.send(humps.camelizeKeys(rating[0]));
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

/**
  * @api {get} /ratings View all ratings
  * @apiVersion 1.0.0
  * @apiName ViewRatings
  * @apiGroup Ratings
  *
  * @apiDescription Users can view all ratings for all trail.
  *
  * @apiExample Example usage:
  * curl http://localhost/favorites
  *
  * @apiSuccess {Object[]} ratings Array of objects with favorited trails.
  *
  * @apiSuccess {Number} id           Rating ID.
  * @apiSuccess {Number} userId       User ID.
  * @apiSuccess {Number} trailId      Trail ID.
  * @apiSuccess {Number} rating       Trail Rating.
  * @apiSuccess {String} review       Tail review.
  * @apiSuccess {String} createdAt    Timestamp when rating was created.
  * @apiSuccess {String} updatedAt    Timestamp when rating was updated.
  *
  * @apiSuccessExample Success-Response:
  *
  *   HTTP/1.1 200 OK
  * [
  *   {
  *     "id": 1,
  *     "user_id": 1,
  *     "trail_id": 1,
  *     "rating": 4,
  *     "review":"very good",
  *     "created_at": '2016-06-29 14:26:16 UTC',
  *     "updated_at": '2016-06-29 14:26:16 UTC'
  *   },
  *  {
  *     "id": 2,
  *     "user_id": 1,
  *     "trail_id": 2,
  *     "rating": 5,
  *     "review":"super good",
  *     "created_at": '2016-06-29 14:26:16 UTC',
  *     "updated_at": '2016-06-29 14:26:16 UTC'
  *   }
  *
  * ]
  *
  * @apiUse ServerError
  * @apiUse NotFoundError
 */
router.get("/ratings", (req, res) => {
  let ratings = new Ratings();
  ratings
    .getRatings()
    .then(ratings => {
      if (!ratings) {
        res.status(404).send("No ratings found");
      }
      res.json(humps.camelizeKeys(ratings));
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

module.exports = router;

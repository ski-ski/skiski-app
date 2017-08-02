const express = require('express');
const router = express.Router();
const humps = require('humps');
const _ = require('lodash');
const Trails = require('../repositories/Trails');

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
 * @api {post} /trails Create trail
 * @apiVersion 1.0.0
 * @apiName PostTrail
 * @apiGroup Trails
 *
 * @apiDescription Signed up users can create trails. They have to be assigned to an existing resort.
 *
 * @apiParam {String} name        Trail name
 * @apiParam {Number} resortId    Resort id
 * @apiParam {String} difficulty  Difficulty
 *
 * @apiExample Example usage:
 * curl -d 'name="Red Dog"&resortId="5"&difficulty="green"' http://localhost/trails
 *
 * @apiSuccess {Number} id          Trail id
 * @apiSuccess {String} name        Trail name
 * @apiSuccess {Number} resortId    Resort id
 * @apiSuccess {String} difficulty  Difficulty
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "id": 22,
 *     "name": "Red Dog",
 *     "resortId": 5,
 *     "difficulty": "green"
 *   }
 *
 * @apiErrorExample {String} Create error
 *    HTTP/1.1 400 Bad Request
 *    Trail already exists
 */
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


/**
 * @api {get} /trails/:id Request trail information
 * @apiVersion 1.0.0
 * @apiName GetTrail
 * @apiGroup Trails
 *
 * @apiDescription Users can view a trail using its ID
 *
 * @apiParam {Number} id Trail id
 *
 * @apiExample Example usage:
 * curl -i http://localhost/trails/1

 * @apiSuccess {Number} id          Trail id
 * @apiSuccess {String} name        Trail name
 * @apiSuccess {Number} resortId    Resort id
 * @apiSuccess {String} difficulty  Difficulty
 *
 * @apiSuccessExample Success-Response
 *   HTTP/1.1 200 OK
 *   {
 *     "id": 22,
 *     "name": "Red Dog",
 *     "resortId": 5,
 *     "difficulty": "green"
 *   }
 *
 * @apiErrorExample {json} Trail not found
 *    HTTP/1.1 404 Not Found
 */
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


/**
 * @api {post} /trails/:id Update a trail
 * @apiVersion 1.0.0
 * @apiName UpdateTrail
 * @apiGroup Trails
 *
 * @apiDescription Update trail information
 *
 * @apiParam {Number} id          Trail id
 * @apiParam {String} name        Trail name
 * @apiParam {Number} resortId    Resort id
 * @apiParam {String} difficulty  Difficulty
 * @apiExample Example usage:
 * curl -d 'difficulty=blue' http://localhost/trails
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "id": 22,
 *     "name": "Red Dog",
 *     "resortId": 5,
 *     "difficulty": "blue"
 *   }
 *
 * @apiUse ServerError
 * @apiUse NotFoundError
 */
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


/**
 * @api {delete} /trails/:id  Delete a trail
 * @apiVersion 1.0.0
 * @apiName DeleteTrail
 * @apiGroup Trails
 *
 * @apiDescription Logged in users can delete a trail
 *
 * @apiParam {Number} id  Trail ID
 *
 * @apiExample Example usage:
 * curl -X 'DELETE' http://localhost/trails/1
 *
 * @apiSuccess {Number}   id          Trail ID.
 * @apiSuccess {String}   name        Trail name.
 * @apiSuccess {Number}   resortId    Resort ID.
 * @apiSuccess {String}   difficulty  Difficulty.
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "id": 22,
 *     "name": "Red Dog",
 *     "resortId": 5,
 *     "difficulty": "blue"
 *   }
 *
 * @apiUse ServerError
 * @apiUse UnAuthorized
 * @apiUse NotFoundError
 */
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


/**
 * @api {get} /trails List all trails
 * @apiVersion 1.0.0
 * @apiName GetTrails
 * @apiGroup Trails
 *
 * @apiDescription Logged in users can view all their favorited trails
 *
 * @apiExample Example usage:
 * curl -i http://localhost/trails
 *
 * @apiSuccess {Object[]} trails Array of trail records
 * @apiSuccess {Number} trails.id Trail id
 * @apiSuccess {String} trails.name Trail name
 * @apiSuccess {Number} trails.resortId Resort id
 * @apiSuccess {String} trails.difficulty Difficulty
 *
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *   [
  *    {
 *       "id": 21,
 *       "name": "GS Bowl",
 *       "resortId": 5,
 *       "difficulty": "blue"
 *     },
 *     {
 *       "id": 22,
 *       "name": "Red Dog",
 *       "resortId": 5,
 *       "difficulty": "blue"
 *     }
 *   ]
 *
 * @apiUse ServerError
 * @apiUse UnAuthorized
 * @apiUse NotFoundError
 */
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

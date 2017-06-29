const express = require('express');
const router = express.Router();
const humps = require('humps');
const _ = require('lodash');
const Trails = require('../repositories/Trails');


/**
 * @api {post} /trails Create trail
 * @apiVersion 1.0.0
 * @apiGroup Trails
 *
 * @apiParam {String} name Trail name
 * @apiParam {Number} resortId Resort id
 * @apiParam {String} difficulty Difficulty
 * @apiParamExample {json} Input
 *    {
 *      "name": "Red Dog",
 *      "resortId": 5,
 *      "difficulty": "green"
 *    }
 *
 * @apiSuccess {Number} id Trail id
 * @apiSuccess {String} name Trail name
 * @apiSuccess {Number} resortId Resort id
 * @apiSuccess {String} difficulty Difficulty
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 22,
 *      "name": "Red Dog",
 *      "resortId": 5,
 *      "difficulty": "green"
 *    }
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
 * @apiGroup Trails
 * @apiVersion 1.0.0
 *
 * @apiParam {id} id Trail id
 * @apiSuccess {Number} id Trail id
 * @apiSuccess {String} name Trail name
 * @apiSuccess {Number} resortId Resort id
 * @apiSuccess {String} difficulty Difficulty
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 22,
 *      "name": "Red Dog",
 *      "resortId": 5,
 *      "difficulty": "green"
 *    }
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
 * @apiGroup Trails
 * @apiVersion 1.0.0
 *
 * @apiParam {id} id Trail id
 * @apiParam {String} name Trail name
 * @apiParam {Number} resortId Resort id
 * @apiParam {String} difficulty Difficulty
 * @apiParamExample {json} Input
 *    {
 *      "difficulty": "blue"
 *    }
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 22,
 *      "name": "Red Dog",
 *      "resortId": 5,
 *      "difficulty": "blue"
 *    }
 *
 * @apiErrorExample {json} Trail not found
 *    HTTP/1.1 404 Not Found
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
 * @api {delete} /trails/:id Delete a trail
 * @apiGroup Trails
 * @apiVersion 1.0.0
 *
 * @apiParam {id} id Trail id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 22,
 *      "name": "Red Dog",
 *      "resortId": 5,
 *      "difficulty": "blue"
 *    }
 *
 * @apiErrorExample {json} Trail not found
 *    HTTP/1.1 404 Not Found
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
 * @apiGroup Trails
 *
 * @apiSuccess {Object[]} trails Array of trail records
 * @apiSuccess {Number} trails.id Trail id
 * @apiSuccess {String} trails.name Trail name
 * @apiSuccess {Number} trails.resortId Resort id
 * @apiSuccess {String} trails.difficulty Difficulty
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [{
 *      },
 *        "id": 21,
 *        "name": "GS Bowl",
 *        "resortId": 5,
 *        "difficulty": "blue"
 *      {
 *        "id": 22,
 *        "name": "Red Dog",
 *        "resortId": 5,
 *        "difficulty": "blue"
 *      }]
 *
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
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

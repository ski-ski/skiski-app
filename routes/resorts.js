const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const humps = require("humps");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Resorts = require("../repositories/Resorts");
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
  * @api {get} /resorts View all resorts
  * @apiVersion 1.0.0
  * @apiName ViewResorts
  * @apiGroup Resorts
  *
  * @apiDescription Users can view all resorts.
  *
  * @apiExample Example usage:
  * curl http://localhost/resorts
  *
  * @apiSuccess {Object[]} ratings Array of objects with resorts.
  *
  * @apiSuccess {Number} id                Resort ID.
  * @apiSuccess {Number} name              Resort Name.
  * @apiSuccess {Number} city              Resort City.
  * @apiSuccess {Number} windspeed         Windspeed at resort.
  * @apiSuccess {String} highTemperature   highTemperature at resort.
  * @apiSuccess {String} lowTemperature    lowTemperature at resort.
  * @apiSuccess {String} snowDepth         snowDepth at resort.
  *
  * @apiSuccessExample Success-Response:
  *
  *   HTTP/1.1 200 OK
  * [
  *   {
  *     id: 1,
  *     name: 'Squaw Valley',
  *     city: 'Olympic_Valley',
  *     windspeed: 0,
  *     high_temperature:0,
  *     low_temperature:0,
  *     snow_depth: 0
  *   },
  *   {
  *     id: 2,
  *     name: 'Heavenly',
  *     city: 'South_Lake_Tahoe',
  *     windspeed: 2,
  *     high_temperature:55,
  *     low_temperature:33,
  *     snow_depth: 0
  *   }
  * ]
  *
  * @apiUse ServerError
  * @apiUse NotFoundError
 */
router.get("/resorts", (req, res) => {
  let resorts = new Resorts();
  let promise = resorts.getResorts();

  promise
    .then(resorts => {
      if (!resorts) {
        res.status(404).send("No users found");
      }
      res.json(humps.camelizeKeys(resorts));
    })
    .catch(err => {
      res.status(500).send(err);
    });
});
/**
  * @api {get} /resorts View a resort
  * @apiVersion 1.0.0
  * @apiName ViewResort
  * @apiGroup Resorts
  *
  * @apiDescription Users can view a resort.
  *
  * @apiParam {Number} id                 Resort ID
  * @apiExample Example usage:
  * curl http://localhost/resorts/:id
  *
  * @apiSuccess {Number} id                Resort ID.
  * @apiSuccess {Number} name              Resort Name.
  * @apiSuccess {Number} city              Resort City.
  * @apiSuccess {Number} windspeed         Windspeed at resort.
  * @apiSuccess {String} highTemperature   highTemperature at resort.
  * @apiSuccess {String} lowTemperature    lowTemperature at resort.
  * @apiSuccess {String} snowDepth         snowDepth at resort.
  *
  * @apiSuccessExample Success-Response:
  *
  *   HTTP/1.1 200 OK
  *   {
  *     id: 2,
  *     name: 'Heavenly',
  *     city: 'South_Lake_Tahoe',
  *     windspeed: 2,
  *     high_temperature:55,
  *     low_temperature:33,
  *     snow_depth: 0
  *   }
  *
  * @apiUse ServerError
  * @apiUse NotFoundError
 */
router.get("/resorts/:id", (req, res) => {
  let resorts = new Resorts();
  let promise = resorts.getResort(req.params.id);
  promise
    .then(resort => {
      if (!resort) {
        return res.status(404).send("No users found");
      }
      return res.json(humps.camelizeKeys(resort));
    })
    .catch(err => {
      res.status(500).send(err);
    });
});
module.exports = router;

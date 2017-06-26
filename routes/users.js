const express = require('express');
const router = express.Router();
const Users = require('../repositories/Users');


/**
 * @api {get} /users/ Request all information for all users
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiSuccess {Object[]} All user data.
 */

router.get('/users', (req, res) => {
  let users = new Users();
  let promise = users.getUsers();

  promise
    .then(users => {
      if (!users) {
        res.status(404).send('No users found');
      }
      res.json(users);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});


// router.get('/users/:id', (req, res) => {
//   let users = new Users();
//   let promise = users.getUser(req.params.id);
//
//   promise
//   .then(user => {
//     if (!user) {
//       res.status(404).send('Not found');
//     }
//     res.json(user);
//   })
//   .catch(err => {
//     res.status(500).send(err);
//   });
// });

module.exports = router;

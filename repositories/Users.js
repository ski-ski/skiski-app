
const knex = require('../knex');
const bcrypt = require('bcrypt');
class Users {
  constructor() {}

  getUsers() {
    return knex('users');
  }

  getUser(id) {
    return knex('users').where('id', id);
  }
  getUserName(email){
		return knex('users').first().where('email', email)
	}

	tryLoginUser(email, password){
		return knex('users').select('hashed_password').first().where({email})
		.then(queryResult => {
			let hashed = queryResult.hashed_password;
			return bcrypt.compare(password, hashed);
		})
	}
}

module.exports = Users;

const _ = require('lodash');

object1 = {
	id: 1,
	favorite_color: "blue",
	first_name: "michael",
	last_name: "murray",
	email: "email@email",
	hashed_password: undefined
}
let {first_name, last_name, email,hashed_password} = object1
let object2 = {first_name, last_name, email,hashed_password}
let filteredObject =  _(object2).omitBy(_.isUndefined).omitBy(_.isNull).value();
console.log(filteredObject);

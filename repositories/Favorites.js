const knex = require("../knex");

class Favorites {
  constructor() {}

  createFavorite(favoriteData) {
    return knex("favorites").insert(favoriteData, "*");
  }

  getFavorite(id) {
    return knex("favorites").where("id", id);
  }

  updateFavorite(id, favoriteData) {
    return knex("favorites").update(favoriteData, "*").where("id", id);
  }

  deleteFavorite(id) {
    return knex("favorites").del().where("id", id).returning("*");
  }

  getFavorites(user_id) {
    return knex("favorites").where("user_id", user_id);
  }
}

module.exports = Favorites;


exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE').index();
    table.integer('trail_id').notNullable().references('trails.id').onDelete('CASCADE').index();
    table.integer('ranking').notNullable();
  });
};

exports.down = function(knex, Promise) {
  console.log('drop favs');
  return knex.schema.dropTable('favorites');
};

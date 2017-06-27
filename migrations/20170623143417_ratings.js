
exports.up = function(knex, Promise) {
  return knex.schema.createTable('ratings', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('users.id').onDelete("CASCADE").index();
    table.integer('trail_id').notNullable().references('trails.id').onDelete("CASCADE").index();
    table.integer('rating').notNullable()
    table.string('review').notNullable().defaultTo('');
    table.timestamps(true, true)
  });
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ratings');
};

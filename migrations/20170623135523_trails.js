
exports.up = function(knex, Promise) {
  return knex.schema.createTable('trails', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().defaultTo('');
    table.integer('resort_id').notNullable().references('resorts.id').onDelete('CASCADE').index();
    table.string('difficulty').notNullable().defaultTo('');
  });
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('trails');
};

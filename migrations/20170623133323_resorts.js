
exports.up = function(knex, Promise) {
  return knex.schema.createTable('resorts', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().defaultTo('');
    table.string('city').notNullable().defaultTo('');
    table.integer('windspeed').notNullable()
    table.integer('high_temperature').notNullable();
    table.integer('low_temperature').notNullable();
    table.integer('snow_depth').notNullable();
  });
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('resorts');
};

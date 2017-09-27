
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', (table) => {
    table.increments()
    table.varchar('first_name', 255).notNullable().defaultTo("")
    table.varchar('last_name', 255).notNullable().defaultTo("")
    table.varchar('email', 255).notNullable().unique()
    table.char('hashed_password', 60).notNullable()
    table.timestamps(true, true).notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};


exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table) {
    table.increments()
    table.varchar('title', 255).notNullable()
    table.varchar('author', 255).notNullable()
    table.varchar('genre', 255).notNullable()
    table.text('description').notNullable()
    table.text('cover_url').notNullable()
    table.timestamp('created_at').notNullable()
    table.timestamp('updated_at').notNullable()
    )
  })
};

exports.down = function(knex, Promise) {

};

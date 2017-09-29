
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('favorites', (t) => {
    t.increments()
    t.integer('book_id').notNullable().references("books.id").onDelete('cascade')
    t.integer('user_id').notNullable().references("users.id").onDelete('cascade')
    t.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('favorites')
};

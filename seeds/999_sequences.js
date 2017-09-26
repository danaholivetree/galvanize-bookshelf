
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw("SELECT setval('books_id_seq', (SELECT MAX(id) FROM books))")
};


//     return knex.raw(SELECT setval('knex_migrations_id_seq', (SELECT MAX(id) FROM books)))

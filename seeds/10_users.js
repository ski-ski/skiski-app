exports.seed = function(knex, Promise) {

  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          first_name: 'Steve',
          last_name: 'Morse',
          email: 'steve@gmail.com',
          hashed_password:
            '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS'
        },
        {
          id: 2,
          first_name: 'Steve',
          last_name: 'Vaughan',
          email: 'steve2@gmail.com',
          hashed_password:
            '$2a$12$C9AYYmcLVGYlGoO4vSZTPubGRsJ6d9ArJULzR48z8fOnTXbSwTUsN'
        }
      ]);
    })
    .then(() =>
      knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))")
    );
};

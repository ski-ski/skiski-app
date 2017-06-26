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
            '$2a$10$Sc1JH2uOZ1Cv0t3hoWoc1OyWCdy6Q6BP07b8zWqjT2A2bBbZr6Ab6'
        },
        {
          id: 2,
          first_name: 'Steve',
          last_name: 'Vaughan',
          email: 'steve2@gmail.com',
          hashed_password:
            '$2a$10$ha5HzJWYkRcwQLhT9kHb.eZJ0sT26edJnHAcbpPrF5tMqo3w26Ux2'
        }
      ]);
    })
    .then(() =>
      knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))")
    );
};

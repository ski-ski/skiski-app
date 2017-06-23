

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/skiki_dev'
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/skiski_test'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};

const pgp = require('pg-promise')();
require('dotenv').config(); // for environment variables

// Database connection string
const connection = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'my_database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
};

const db = pgp(connection);

module.exports = db;

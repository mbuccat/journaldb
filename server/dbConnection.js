const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// set default schema
pool.query(`SET search_path = ${process.env.DB_SCHEMA}`, 
  (error) => {
    if (error) console.log(error);
  }
);

module.exports = pool;

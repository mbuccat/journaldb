const { Pool } = require('pg');

require('dotenv').config();

// parse database url
const url = process.env.DATABASE_URL.split(':');
const host = url[2].split('@')[1];
const user = url[1].slice(2);
const password = url[2].split('@')[0];
const database = url[3].split('/')[1];
const port = url[3].split('/')[0];

const pool = new Pool({
  connectionLimit: 10,
  host,
  user,
  password,
  database,
  port,
});

// set default schema
pool.query(`SET search_path = ${process.env.DB_SCHEMA}`,
  (error) => {
    if (error) console.log(error);
  });

module.exports = pool;

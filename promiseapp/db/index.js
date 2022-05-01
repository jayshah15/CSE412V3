const pgp = require('pg-promise')()
const connectionString = {

    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: '**********' 
}

const db = pgp(connectionString);

module.exports = db;
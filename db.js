const Pool = require("pg").Pool;
require("dotenv").config();

const devConfig = {
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE
};

const proConfig = {
    connectionString: process.env.DATABASE_URL // comes from heroku add-on that we config in heroku
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);

const query = (text, params, callback) => {
    return pool.query(text, params, callback);
};

exports.query = query;
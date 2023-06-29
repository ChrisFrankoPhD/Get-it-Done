const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "oishi69fohpo",
    port: 5432,
    database: "fluetodo"
});

const query = (text, params, callback) => {
    return pool.query(text, params, callback);
};

exports.query = query;
const jwt = require("jsonwebtoken");
require("dotenv").config();

// generate a jwt token given the unique user_id of the user logging in
function jwtGenerator(user_id) {
    const payload = {
        user: {
            id: user_id
        }
    };
    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "7d"});
};

module.exports = jwtGenerator;
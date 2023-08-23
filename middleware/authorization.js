const jwt = require("jsonwebtoken");
require("dotenv").config();

// middlware module that checks any incoming jwttoken to see if it is valid,
module.exports = async (req, res, next) => {
  console.log("authorization middleware");
  try {
    // grab token from request header
    const jwtToken = req.header("token");

    // check if there is no token given
    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }

    // use jwt to verify the token with the secret key
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);
    req.user = payload.user;

    // move to the next middleware in line
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).json("Authoization: Not Authorized");
  }
  console.log("authorization: end of function");
};

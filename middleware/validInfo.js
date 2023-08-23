// middleware module that validates the user info on registration and login
module.exports = (req, res, next) => {
  console.log("vaidate info middleware");
  const { name, email, password } = req.body;

  // function that uses a regular expression to test user emails
  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    // test if each needed credential is given, and if so mak sure email is valid
    if (![email, name, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email Address");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email Address");
    }
  }
  console.log("info validated");
  
  // move to the next middleware in line
  next();
};

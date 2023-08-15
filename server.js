const express = require('express');
const app = express();
const port = 5000;

// MIDDLEWARE
app.use(express.json());

//ROUTES//
// register and login
app.use("/auth", require("./routes/loginReg"));

// dashboard route
app.use("/dashboard", require("./routes/dashboard"));

// Start Server
app.listen(port, () => {
    console.log(`Express server started on port ${port}`);
})


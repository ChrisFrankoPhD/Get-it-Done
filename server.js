const express = require('express');
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
};
//ROUTES//
// register and login
app.use("/auth", require("./routes/loginReg"));

// dashboard route
app.use("/dashboard", require("./routes/dashboard"));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}`);
})



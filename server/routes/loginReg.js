const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require ("../middleware/validInfo")
const authorization = require("../middleware/authorization"); 

// registering
router.post("/register", validInfo, async (req, res) => {
    console.log("register endpoint");
    try {
        // 1. destructure req.body to get name email password
        const {name, email, password} = req.body;

        // 2. check if user exists (if user exists, throw error)
        const user = await db.query(
            "SELECT * FROM users WHERE user_email=$1;",
            [email]
        );

        if (user.rows.length !== 0) {
            return res.status(401).json("User Already Exists")
        };

        // 3. Bcrypt the user password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4. Enter the user into database
        const newUser = await db.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
        );

        // 5. generate the JWT token
        const token = jwtGenerator(newUser.rows[0].user_id);
        res.json({token})
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error")
    }
})

// Login Route
router.post("/login", validInfo, async (req, res) => {
    console.log("login endpoint");
    try {
        // 1. destructure req.body to get name email password
        const {email, password} = req.body;

        // 2. check if user doesn't exist (if user does not exist, throw error)
        const user = await db.query(
            "SELECT * FROM users WHERE user_email=$1;",
            [email]
        );
        if (user.rows.length === 0) {
            return res.status(401).json("Incorrect Credentials")
        };

        // 3. Check if incoming password === database password
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password)
        if (!validPassword) {
            return res.status(401).json("Incorrect Email Or Password")
        }

        // 4. Give them a JWT Token
        const token = jwtGenerator(user.rows[0].user_id)

        res.json({token})
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error")
    }
})

router.get("/verify", authorization, async (req, res) => {
    try {
        console.log("Verify Endpoint");
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error")
    }
})

module.exports = router;
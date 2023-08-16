const router = require("express").Router();
const authorization = require("../middleware/authorization"); 
const db = require("../db");

router.get("/", authorization, async (req, res) => {
    console.log("dashboard: GET route");
    try {
        // console.log(req.user.id);
        const user_data = await db.query(
            "SELECT u.user_name, t.todo_id, t.description, t.crossed FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE u.user_id=$1 ORDER BY t.todo_id asc",
            [req.user.id]
        );
        // console.log(user_data.rows);
        res.json(user_data.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Dashboard: Server Error");
    }
});

// create a todo
router.post("/todos", authorization, async(req, res) => {
    console.log("dashboard: create route");
    try {
        const { description } = req.body;
        const newTodo = await db.query(
            "INSERT INTO todos(user_id, description) VALUES($1, $2) RETURNING todos.todo_id, todos.description", 
            [req.user.id, description]
        );
        console.log(newTodo.rows[0]);
        res.json(newTodo.rows[0]);
    } catch (error) {
        console.error(error.message); 
    }
})

// Update a Todo
router.put("/todos/:todo_id", authorization, async(req, res) => {
    console.log("dashboard: update route");
    try {
        const { todo_id } = req.params;
        const { description } = req.body;
        // console.log(todo_id);
        // console.log(description);

        const updateTodo = await db.query(
            "UPDATE todos SET description=$3 WHERE (user_id=$1 AND todo_id=$2) RETURNING todos.todo_id, todos.description",
            [req.user.id, todo_id, description]
        );

        if (updateTodo.rows.length === 0) {
            return res.json("this todo is not yours")
        }

        res.json(updateTodo.rows[0])
    } catch (error) {
        console.error(error.message);
    }
})

// Update a Todo
router.put("/todos/toggle/:todo_id", authorization, async(req, res) => {
    console.log("dashboard: update route");
    try {
        const { todo_id } = req.params;
        const { cross } = req.body;
        // console.log(todo_id);
        // console.log(description);

        const updateTodo = await db.query(
            "UPDATE todos SET crossed=$3 WHERE (user_id=$1 AND todo_id=$2) RETURNING todos.todo_id, todos.crossed",
            [req.user.id, todo_id, cross]
        );

        if (updateTodo.rows.length === 0) {
            return res.json("this todo is not yours")
        }

        res.json(updateTodo.rows[0])
    } catch (error) {
        console.error(error.message);
    }
})

// Delete a Todo
router.delete("/todos/:todo_id", authorization, async(req, res) => {
    console.log("dashboard: delete route");
    try {
        const { todo_id } = req.params;

        const deleteTodo = await db.query(
            "DELETE from todos WHERE (user_id=$1 AND todo_id=$2) RETURNING todos.todo_id, todos.description",
            [req.user.id, todo_id]
        );

        if (deleteTodo.rows.length === 0) {
            return res.json("this todo is not yours")
        }

        res.json(deleteTodo.rows[0])
    } catch (error) {
        console.error(error.message);
    }
})

// search todos
router.get("/todos/search/:search", authorization, async(req, res) => {
    console.log("dashboard: search route");
    try {
        const { search } = req.params
        if (!search.trim()) {
            const user_data = await db.query(
                "SELECT u.user_name, t.todo_id, t.description FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE u.user_id=$1 ORDER BY t.todo_id asc",
                [req.user.id]
            );
            res.json(user_data.rows);
        } else {
            const user_data = await db.query(
                "SELECT u.user_name, t.todo_id, t.description FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE (u.user_id=$1 AND (description LIKE ('%' || $2 || '%'))) ORDER BY t.todo_id asc",
                [req.user.id, search]
            );
            res.json(user_data.rows);
        }
        // const allTodos = await db.query(
        //     "SELECT * FROM todos WHERE (user_id=$1 AND (description LIKE ('%' || $2 || '%'))) ORDER BY todo_id asc",
        //     [req.user.id, search]
        // );

        // console.log("searching...");
        // res.json(allTodos.rows)
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;
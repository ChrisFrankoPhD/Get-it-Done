const router = require("express").Router();
const authorization = require("../middleware/authorization");
const db = require("../db");

// get all user todo items for the bare dashboard route
router.get("/", authorization, async (req, res) => {
  console.log("dashboard: GET route");
  try {
    // get user data and todos from postgres
    const user_data = await db.query(
      "SELECT u.user_name, t.todo_id, t.description, t.crossed FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE u.user_id=$1 ORDER BY t.todo_id asc",
      [req.user.id]
    );
    // return info to user
    res.json(user_data.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Dashboard: Server Error");
  }
});

// create a todo
router.post("/todos", authorization, async (req, res) => {
  console.log("dashboard: create route");
  try {

    // destructure request body to get description
    const { description } = req.body;

    // crate a new todo with said description 
    const newTodo = await db.query(
      "INSERT INTO todos(user_id, description) VALUES($1, $2) RETURNING todos.todo_id, todos.description",
      [req.user.id, description]
    );

    // return new todo info to the user
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Update a Todo
router.put("/todos/:todo_id", authorization, async (req, res) => {
  console.log("dashboard: update route");
  try {
    // destructure request URI to get todo_id and request body to get new description 
    const { todo_id } = req.params;
    const { description } = req.body;

    // update todo with said description 
    const updateTodo = await db.query(
      "UPDATE todos SET description=$3 WHERE (user_id=$1 AND todo_id=$2) RETURNING todos.todo_id, todos.description",
      [req.user.id, todo_id, description]
    );

    // notify the client if the todo trying to be modified does not belong to them
    if (updateTodo.rows.length === 0) {
      return res.json("this todo is not yours");
    }

    res.json(updateTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Toggle if a todo has been "checked off" or not
router.put("/todos/toggle/:todo_id", authorization, async (req, res) => {
  console.log("dashboard: update route");
  try {
    // destructure request URI to get todo_id and request body to get new state
    const { todo_id } = req.params;
    const { cross } = req.body;

    // update teh crossed state of the todo
    const updateTodo = await db.query(
      "UPDATE todos SET crossed=$3 WHERE (user_id=$1 AND todo_id=$2) RETURNING todos.todo_id, todos.crossed",
      [req.user.id, todo_id, cross]
    );

    // notify the client if the todo trying to be toggled does not belong to them
    if (updateTodo.rows.length === 0) {
      return res.json("this todo is not yours");
    }

    res.json(updateTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a Todo
router.delete("/todos/:todo_id", authorization, async (req, res) => {
  console.log("dashboard: delete route");
  try {
    // destructure request URI to get todo_id 
    const { todo_id } = req.params;

    // delete the todo info from the database
    const deleteTodo = await db.query(
      "DELETE from todos WHERE (user_id=$1 AND todo_id=$2) RETURNING todos.todo_id, todos.description",
      [req.user.id, todo_id]
    );

    // notify the client if the todo trying to be deleted does not belong to them
    if (deleteTodo.rows.length === 0) {
      return res.json("this todo is not yours");
    }

    res.json(deleteTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//// search todos, this has been moved to the client side but is kept here in case we want to bring it back
// router.get("/todos/search/:search", authorization, async(req, res) => {
//     console.log("dashboard: search route");
//     try {
//         const { search } = req.params
//         if (!search.trim()) {
//             const user_data = await db.query(
//                 "SELECT u.user_name, t.todo_id, t.description FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE u.user_id=$1 ORDER BY t.todo_id asc",
//                 [req.user.id]
//             );
//             res.json(user_data.rows);
//         } else {
//             const user_data = await db.query(
//                 "SELECT u.user_name, t.todo_id, t.description FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE (u.user_id=$1 AND (description LIKE ('%' || $2 || '%'))) ORDER BY t.todo_id asc",
//                 [req.user.id, search]
//             );
//             res.json(user_data.rows);
//         }
//         // const allTodos = await db.query(
//         //     "SELECT * FROM todos WHERE (user_id=$1 AND (description LIKE ('%' || $2 || '%'))) ORDER BY todo_id asc",
//         //     [req.user.id, search]
//         // );

//         // console.log("searching...");
//         // res.json(allTodos.rows)
//     } catch (error) {
//         console.error(error.message);
//     }
// })

module.exports = router;

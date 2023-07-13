const express = require('express');
const app = express();
const db = require("./db")
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

// create a todo
// app.post("/todos", async(req, res) => {
//     try {
//         // console.log(typeof(req.body))
//         const { description } = req.body;
//         const newTodo = await db.query(
//             "INSERT INTO todo(description) VALUES($1) RETURNING *", 
//             [description]
//         );
//         console.log(newTodo.rows[0]);
//         res.json(newTodo.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// })

// // get all todos
// app.get("/todos", async(req, res) => {
//     try {
//         const allTodos = await db.query(
//             "SELECT * FROM todo ORDER BY todo_id asc"
//         );
//         res.json(allTodos.rows)
//     } catch (err) {
//         console.error(err.message);
//     }
// })

// // get todo by ID
// app.get("/todos/:id", async(req, res) => {
//     try {
//         const { id } = req.params;
//         // console.log(req);
//         // console.log(req.params);
//         console.log(id);
//         const todo = await db.query(
//             "SELECT * FROM todo WHERE todo_id=$1 LIMIT 1",
//             [id]
//         );
//         console.log(`TODO DELETED`);
//         res.json(todo.rows[0])
//     } catch (err) {
//         console.error(err.message);
//     }
// })

// // Update a Todo
// app.put("/todos/:id", async(req, res) => {
//     try {
//         const { id } = req.params;
//         const { description } = req.body;

//         const updateTodo = await db.query(
//             "UPDATE todo SET description=$2 WHERE todo_id=$1 RETURNING *",
//             [id, description]
//         );
//         res.json(updateTodo.rows[0])
//     } catch (err) {
//         console.error(err.message);
//     }
// })

// // Delete a Todo
// app.delete("/todos/:id", async(req, res) => {
//     try {
//         const { id } = req.params;

//         const deleteTodo = await db.query(
//             "DELETE from todo WHERE todo_id=$1 RETURNING *",
//             [id]
//         );
//         res.json(deleteTodo.rows[0])
//     } catch (err) {
//         console.error(err.message);
//     }
// })

// // search todos, need to figure out how to call this when search is given, different route??
// app.get("/todos/search/:search", async(req, res) => {
//     try {
//         const { search } = req.params
//         const allTodos = await db.query(
//             "SELECT * FROM todo WHERE description LIKE ('%' || $1 || '%') ORDER BY todo_id asc",
//             [search]
//         );
//         // console.log("searching...");
//         res.json(allTodos.rows)
//     } catch (err) {
//         console.error(err.message);
//     }
// })


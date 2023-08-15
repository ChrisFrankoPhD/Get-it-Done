# React Front, Node Back Application

- the goal of this project is to learn how to make an full deployable application that uses react js on the front end, and node js with express on the back end, and to learn how to integrate these seemlessly
- we also want to be able to use PostgreSQL for the database
- the premise of the app is going to be a social media website with profiles, and friends, and a blog, but that is based around the skyscanner API for sharing flight options, suggesting good prices, tracking certain routes, etc

## Setting Up Our Files

- watchign thsi tutorial for the basic set up for the app: https://www.youtube.com/watch?v=w3vs4a03y3I

### Node Server SetUp

- first as usual we want to create a git repo in the normal way, then make one on github and add it as a remote, wont go over this but this is in my git201 notes
- to start with our react and node set-up, we want to create 2 project folders, one where our react front end will live, and one where the node/express backend will live, we will call these 'client' and 'server' respectively
- we want to then want to navigate to the 'server' directory and initialize npm in the server (node backend) directory with `npm init`, and follow the promts to make a package.json file, and make sure the "main" keyword is set to 'server.js' since we will call the main file of the backend that
- we can then make a server.js file in the client directory, then install express with `npm i express`, and install nodemon with `npm i nodemon -D`, where the `-D` indicates it is a dev decpendency, and not used in the actual production 
    - with nodemon, we have to also add the properties `"start": "node server"` and `"dev": "nodemon server"` to the "scripts" object in the package.json file, this makes `npm start` command intiate the regular node server, and the `npm run dev` start the nodemon server, i believe, and nodemon allows us to make changes to the project and ave the server automatically update
- we will install further dependencies later as we need them

### React Client SetUp

- to start this process we will navigate to the 'client' direct adn make our react app with `npx create-react-app .`, which will create a react app in the current directory
- **note** the first time I did this, i was told i was using node 12 and needed at least, and to upgrade I had to install node version manager (nvm), I did this with thec ommand `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash` as described in the NVM github (https://github.com/nvm-sh/nvm#installing-and-updating), then had to restart the terminal and did `nvm --version` to confirm that it was installed, then did `nvm install node` which now installed the newest node 20, and only now did I do `npx create-react-app .`, and it worked
    - **note** create the react app in WSL in vscode is extremely slow, WSL tends to work a lot slower in general i have noticed but it hasbeen creating the ap for over 30 minutes, the network using seems to be particularly slow
- once the react app is set up, we will have a bunch fo default files in the 'src' directory, and in the video i am watching he removes all the default CSS and JS from the app.js and app.css files, and then uses the short hand command `rfce ->` (where -> means tab), to auto fill a standard react functional component with an export
```
import React from 'react'

function App() {
  return (
    <div>App</div>
  )
}

export default App
```
- so just so we have some sort of default component that will be shown

## Backend API Setup (Express)

- so now we want to set up our express API that will serve react data from the backend
- we do this like we did in the course by importing express using the require keyword, and defining a handler for a get request from the front-end:
```
const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.listen(port, () => {
    console.log(`Express server started on port ${port}`);
})
```
- so the main details of this are in the 'completeWebDevBootcamp/NodeJS' notes, but in general we are telling express to send a response of this users JSON object to react whenever a get request is made to the "/api" route
- we then want to write the `app.listen()` function that will get called when we start our server, so here we are telling express to start the server on port 5000, and when it does to call the callback function which will just print the server started message
- so now if we go to our web browser and navigate to locahost:5000, we will see the classic `cannot GET /` message when there is no porper get handler for the route, and if we then go to instead `localhost:5000/api`, we will see printed out on the screen `{"users":["userOne","userTwo","userThree"]}` as expected!
- so nothing we havent done so far int he node course, our next step is to use react to fetch this api, and display the users as we wish with react styling/css/html

## API Fetching With React

- so we notice that we set the port number for express in the above section to 5000, even though react runs by default on port 3000, in deployment we will want these two to run on the same port, and have our backend serve our front end, but for development it is very useful to have them running seperately so we can work on them more independantly
- to do this we run them on seperate ports as we are doing, but we still want react to be able to send requests to our backend, and we do this by adding a "proxy" path to the react package.json file, which tells react to send any request that is unrecognized to the API server, lastly this also lets us make these requests to our backend relative, instead of typing out "http//:localhost:5000/api/" everytime 
- so now the first bit of our 'client/package.json' looks like:
```
{
  "name": "client",
  "version": "0.1.0",
  "proxy": "http://localhost:5000",
  "private": true,
```
- so now that we have this we can set up our react App component to actually make an api request to our server using the `fetch()` method:
```
import React, {useEffect, useState} from 'react';

function App() {

    const [backendData, setBackendData] = useState([{}])

    useEffect(() => {
        fetch("/api")
            .then(response => response.json())
            .then(data => {
                setBackendData(data);
            })
    }, []);

    return (
        <div>App</div>
    )
}

export default App
```
- **note** that the empty array at the end of the useEffect arguments list is telling the function that it has no dependencies, which means it will only run when the component is first rendered, normally we can give some states that useEffect should listen to and rerender on state change, but we give it nothing
- so we see that when the App is loaded, we will make a fetch request to "/api", and use the `setBackendData` handler we defined to set `backendData` to be equal to the fetched data
- the reason we can just call the simple `fetch("/api")` path here is because we set the proxy to be the path to our api server port 
- now this doesnt do anythign visual at the moment, but if we make sure the backend express server is still running, which it is, and then open a side by side terminel in VSCode and start the react server with `npm start`, then we can navigate to localhost:3000 in the browser (which react opens automatically), and open the dev tools and look at the network tap, and if we refresh the page we can see that a fetch request to api is indeed made successfully! So they are communicating!@!
- if we click on the api file, and look at the preview tab, we can see the 'users' json object we told express to send
  - note, this took fucking forever with WSL again, may remake this in regular windows



## Displaying User Data with React

- so we know the API fetching is working, and now we want to work with regular react/JSX to display this data as we normally would with react now that we have access to this data, by changing the return of the component:
```
return (
        <div>
            {(typeof backendData.users === 'undefined') ? (
                <p>Loading...</p>
            ): (
                backendData.users.map((user, i) => (
                    <p key={i}>{user}</p>
                ))
            )}
        </div>
    )
```
- so what this does is we return one large div element of course, as we always do with react, but within that, we have JSX excape, with some conditional rendering
- so we are saying if `backendData.users === 'undefined'`, which will be true before the fetch request is able to properly populate the backendData state, since it will have no `users` property, we will simply render a 'p' element saying loading, 
- otherwise, so if `backendData.users` has been populated, we are going to map the elements of users on to the given function, so for each element of the 'users' list, since we made the vlaue of the users key a list of usernames, we are going to return `<p key={i}>{user}</p>`, where `user` is list element, and `i` is the index
- so in this way we return 3 paragraph elements, one with each username, and they all have a key equal to their index, which react likes since it likes all elements to be unique
- now when we go to the browser, we see the usernames are all listed as elements! we can also add another username to the list and refresh and it will get added too
- so this is the basis for a react/node integrated app, we can see how we can get data from the backend, or hopefully send it with a post request next, adn then we can do whatever we like with the data on the backend, and do whatever we like with the data on the frontend for displaying, we just need to use these principles and make it more complex to build more advanced features

## Setting Up PostgreSQL for the Backend

### Setting Up Command Line for PostgreSQL

- so first off I previously downloaded postgresSQL 15, and we want to be able to access the database from our command line, to do this we need to make sure the path the the PSQL executables is on our system PATH
- when trying to run `psql --version` before doing this, we get errors that `psql` is not a recognizable command
- we do this by using the windows interface, searhcing for 'edit the system environment variables' in the search bar, ging to environment variables, and path, and adding a new row with the path to the psql commands, which for me is `C:\Program Files\PostgreSQL\15\bin`, and saving the changes
- then restart a terminal and we see `psql --version` prints our version number correctly

### Creating A Database and Table

- we can then log into postgres using the command `psql -U postgres`, which logs in as the user 'postgres' which is teh default user that comes with postgres, and we will have to enter our password that we made when we installed postgres
- so this enters a postgres application, like `python` does when we enter that in the command line
- in here we can do `\l` to see all of our databases, of which I only have the default ones, and we can also do 'ctrl + c' as usual to exit the postgres app
- we will create our own new database with `create database fluetodo`, and we see we receive the response `CREATE DATABASE` signifying it was created 
- so we see we can use the SQL commands we learned in the online viewer (in 2023 Ultimate Web Development/SqlCourse/sql101.md) here in the commadn line to modify our new database
- we can then connent to the new database with `\c fluetodo` and then we can see if we have any tables with `\dt`, and we find we get `Did not find any relations`, which makes sense cause we just created it
- so we can add a table with the `CREATE TABLE` command, and if we were writing this in an actual editor we would using indenting to make it more readable, and we can actually do this in the command line since if we add paraenthesis and return without closing them, we get a new line shows before the `#` symbol that we are sitll working int he paranthesis and the command hasnt been set yet `(#`, and then when we are finished with the command we can just enter a line with `);` and it will send, postgres really cares about semi-colons, which is good here
- so we enter:
```
create table todo(
  todo_id SERIAL PRIMARY KEY,
  description VARCHAR(255)
);
```
- which in the command line looks like:
```
fluetodo=# CREATE TABLE todo(
fluetodo(#    todo_id SERIAL PRIMARY KEY,
fluetodo(#    description VARCHAR(255)
fluetodo(# );
CREATE TABLE
```
- where 'create table' is the success method
- and now if we do `\dt`, we can see it returns a nice little table of the different talbes, or relations, we have in this database, and in this case just shows the one, the `todo` table
- and further if we do `select * from todo;`, we see it gives us another print out of the rows of the todo table, including the header row for the column names, and of course that is all we see right now since we have not entered any data, this is just like the online one, but just showing it unformatted, noice

### Connect the Postgres Database to the Server

- so to do this we will want to use the `pg` npm package, which is for postgres in JS, so we will install it with `npm i pg`
- and now we want to set up a database file where we construct our database *client* object by giving it parameters, a client seems to just be a database connecion, and we can define a *Pool* object, which can contain multiple connections or clients:
```
const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password: "oishi69fohpo",
    port: 5432,
    database: "fluetodo"
})

module.exports = pool;
```
- so we are making a connection to the postgres user, with our password, in the default postgres port, and to the database we just made, fluetodo, and we can access this outside of this file with by importing this file and calling `pool`
- now we can either setup the routes we want to call and query the database in the server.js file, and any other associated files we might make along the way, or we can also make the calls to the database run right the db.js file, and export a method that calls this file, like we might for a class, so that way everytime our server wants to connect to the database, it goes through this file
    - i like this encapsulated solution, i ready about it on the node-postgres docs
- so to make the db.js file run all queries we can do:
```
const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password: "oishi69fohpo",
    port: 5432,
    database: "fluetodo"
})

const query = (text, params, callback) => {
    return pool.query(text, params, callback)
}

exports.pool = pool;
exports.query = query;
```
- so here now when we want to make a db query, we can import this file as `db`, and call `db.query("postgres query text", [parameters needed to pass into text])`, and could also include a callback function if we need it
    - in fact, we really only need to `export query` here and not pool, since query calls pool for us, but I have it in there since we are trying this for the first time
- will go over examples for thsi later when we are ready to amke queries, but first we will make our different routes in the server.js file, and make sure they are working correctly

### Making Routes and Testing with Postman

- so we have our express server that we have set up in the server.js file, and we have shown that we can use react to get and post data from this server by setting up routes such as:
```
app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]});
})
```
- where our react component was able to access our backend by calling the "/api" route (which is really localhost:5000/api since we set up a proxy) by doing:
```
fetch("/api")
    .then(response => response.json())
    .then(data => {
        setBackendData(data);
    })
```
- to get data from our backend server.js and set it to a component state, and then use it as react pleases
- well we want to be able to have similar communications between our server and our database, so we need to make similar routes in our server.js file for our database to access
- we start by doing this in the exact same way, where we define a route that our database will access, except this time as a post request, shown in the last function below:
```
const express = require('express');
const app = express();
const pool = require("./db");

const port = 5000;
app.use(express.json());

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]});
})

app.listen(port, () => {
    console.log(`Express server started on port ${port}`);
})

//ROUTES//

// create a todo
app.post("/todos", async(req, res) => {
    try {
        console.log(req.body)
    } catch (err) {
        console.error(err.message);
    }
})
```
- so this is the full code from the file to show a few things, notice first we add the `app.use(express.json());` line after the `port` definition, now this just allows us to later use express' built in json parser when we need it in the below code
- we then have our `//ROUTES//` section, and have a route where we will make the database create a new item in the 'todo' table that we made with postgres, **however for now, we just have some test code in there to make sure the route works**
- first we want to have this in a try/catch block (which we can easily make with the shorthand `trycatch->`, where -> means tab)
- here when we get a post request sent to the '/todos' route, we call the async callback function, that just tries to print the body of the request, so this is where we are using the `json()` functions that we *kinda* imported with `app.use(express.json());` above, we are telling express to get the body of the JSON object that got sent with that request
- and of course if this does not work and we get an error, we print the error message instead
- so now that we have a way for handling requests to this route, we use the application `Postman` to test it
- Postman is a software for testing API requests, and it is very helpful in cases like this, we can easily download Postman from their site online, it is its own stand alont application with a nice UI and everything
- so we can open postman and manke a new request, and we want to choose the 'POST' option, and set the path to `http://localhost:5000/todos`
- we can then go to the body tap below, and make a small JSON object to try and send to our server:
```
{
    "description": "i need to clean my room"
}
```
- so we know the fluetodo database we made had an automatic ID row, and a variable character row named description, so we are not adding this to the database yet, but we want this data to mirror that since we want to add it to the db eventually
- now we want to make sure our backend server is started, again with `npm run dev`, and then we can hit send, and if it works we will see our JSOn body gets printed into the command line on VSCode! `{ description: 'i need to clean my room' }`, sso even though we have set nothing up with Postman, we just sent a request from it to the right route, it was able to comminucate with the server easily!
    - to iterate the `req.body` usage, we can actually change the `console.log(req.body)` line to `console.log(req)`, and we see that we instead print out hundreds of lines of the full request in the terminal, and in those lines we can search and find there is a single property `body: { description: 'i need to clean my room' },`, so the real request includes alot more supplementary info then what we are sending

### Adding Sent Data to PostgreSQL Database 

- okay so we confirmed we can send data and read it with our nice `\todo` route, but now we actually want this todo post handler to add this data to our fluetodo postgreSQL database
- we can do this pretty easily with everything we have set up previously, remember we set up our database 'db.js' file to handle everything with the database for us:
```
const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password: "oishi69fohpo",
    port: 5432,
    database: "fluetodo"
})

const query = (text, params, callback) => {
    return pool.query(text, params, callback)
}

exports.pool = pool;
exports.query = query;
```
- so we just need to import and call our masked query function from the server.js file to add the info given to us in the `post` handler to the db
- we can do this as follows, and i will just show the new import, and the updates '/todo' routes handler:
```
const db = require("./db")

//ROUTES//

// create a todo
app.post("/todos", async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await db.query(
            "INSERT INTO todo(description) VALUES($1)", 
            [description]
        );

        res.json(newTodo);
    } catch (err) {
        console.error(err.message);
    }
})
```
- so we have the same post /todo handler, except instead of just printing the JSON body, we are doing more with it
- first we deconstruct the `req.body` object that we received to save the value as dictionary, this is done with the deconstructing shorthand `const { description } = req.body;`, which is like saying `const description = req.body.description`, so we save having to write the key name twice, we are just saving the description property's value in the variable `description`
- we then want to create a new todo list item in our todo table, and we do this by calling a database query
    - **note**, we are doing this **asynchronously**, this is why we defined the function as `async` at the start of the callback, so now we can call `await` on our `db.query`, which means we are waiting for the response from the db.query before we continue with our code, otherwise we can have issues where we start to try and use the response from the query before the database is finished sending it back, so this is important
- we are calling the imported `db.query()` function and setting its return value as the variable `newTodo`, 
    - db.query() takes a query as a string, and a list of parameters, as well as an optional callback function, which is the same thing the query would take if we called it directly, we are just sending this info to db.js so it can be handled over there
- in this case we want to create a new todo table item, so our query uses the `"INSERT INTO todo(description) VALUES($1)"` syntax, where we tell postgres to insert a new todo item, giving it the parameter `description`, and if we recall the todo table we created, we have an otuomatic ID column, and a description column, so we are handing postgres the description, and then we are telling postgres that the value to insert here is `VALUES($1)`, where `$1` represents the first argument of the provided parameter list
- we see the parameter list we provide is `[description]`, which we only contains the description variabel we just defined with `const { description } = req.body;` from the received JSON above
- so postgres will take this and make a new row in the database, and then return a response that we saved as `newTodo`, so we now in the last line, `res.json(newTodo);`, respond to the initial post request with the response from postgres
- as an example, we recall we recall in the postman test we did was `{ description: 'i need to clean my room' }`, we can do this again now:
    - we see that `{ description: 'i need to clean my room' }` os recieved as `res.body`, 
    - we call `const { description } = req.body;` which makes the variable for us `description = 'i need to clean my room'`, 
    - we then define `newTodo` as the return of the call to db.query(), which will pass send the query `"INSERT INTO todo(description) VALUES($1)"` with the parameter list `[description]`, so the resolved query becomes: "INSERT INTO todo(description) VALUES('i need to clean my room')", 
    - the postgres adds this to the todo table in the fluetodo database, and returns a response for us that again is saved as `newTodo`
    - we then set the response that our API will send back to the client, Postman, with `res.json(newTodo);`, and this gets sent as a json object to Postman
- another reason postman is great is we see teh response Postman gets from our API, and firstly see a repsonse was sent which is great! it gives a bunch of info i dont understand, but mainly it also tells us what SQL command was used, and how many rows were inserted:
```
{
    "command": "INSERT",
    "rowCount": 1,
    "oid": 0,
    "rows": [],
    "fields": [],

... // bunch of random stuff in here
...
}
```
- more importantly, we can go to our terminal and checkout our database again with the command like postgres commands we did earlier: `psql -U postgres`, `\c fluetodo`, `\dt`, `select * from todo;`, and we see that the data was indeed entered into our table as expected, where we have a single row with id '1' and description 'i need to clean my room'
    - also if we add more values into this table, we see the id increments automatically since when we set up the database we did `todo_id SERIAL PRIMARY KEY,`, and the serial tag lets it know it should be an int starting at 1 and increment automatically

### Making PostgreSQL Return the Data that was Added

- okay so remember how the return object from postgres that we set as `newTodo`, and how it told us that we added a single row and the command we gave it, well we can also make it return the data that was sent to it, 
    - and this is a small addition but wanted a new section cause that was a lot of text
- we can edit our `newTodo` variable where we call the db.query() function as so:
```
const newTodo = await db.query(
    "INSERT INTO todo(description) VALUES($1) RETURNING *", 
    [description]
);
```
- notice that we added `RETURNING *` to end of the query, this tell postgres to reutrn all the data that was added, so now if we send a new request with postman again, we see the response object is:
```
{
    "command": "INSERT",
    "rowCount": 1,
    "oid": 0,
    "rows": [
        {
            "todo_id": 4,
            "description": "go for a run"
        }
    ],
    "fields": [
        {
            "name": "todo_id",
            "tableID": 16400,
            "columnID": 1,
            "dataTypeID": 23,
            "dataTypeSize": 4,
            "dataTypeModifier": -1,
            "format": "text"
        },
        {
            "name": "description",
            "tableID": 16400,
            "columnID": 2,
            "dataTypeID": 1043,
            "dataTypeSize": -1,
            "dataTypeModifier": 259,
            "format": "text"
        }
    ],

... // more random stuff that didnt seem to change meaningfully
}
```
- so we see here now the `rows` property is populated with the rows taht were added, in this case just a single row with todo_id of 4 and the description we set in the API call
- we also have the `fields` property popualted with a bunch of info on the two different columns we have, (presumably only the effected ones et shown?, might need to test later)
- the last thing we can do to make this more readable it to change our APIs repsonse (the `res` variable) to be only the `"rows"` property, since htat is really what our front end would want, confirmation of what was added, and more specifically we can return `rows[0]` since we see above that rows is an array and since we are only adding a single item it will always be the first element:
```
const newTodo = await db.query(
            "INSERT INTO todo(description) VALUES($1) RETURNING *", 
            [description]
        );
res.json(newTodo.rows[0]);
``` 
- and we see the response we get back from our server to postman is now:
```
{
    "todo_id": 5,
    "description": "clean the table"
}
```
- and this is much nicer to work with when we enevitably want to send these to the front end instead

### Making Other Routes

#### Get all Route

- we also want to have a simple get request to the same route that will allows us to get all data, and we do this in mostly the same way, but changing the query we give to postgres:
```
// get all todos
app.get("/todos", async(req, res) => {
    try {
        const allTodos = await db.query(
            "SELECT * FROM todo ORDER BY todo_id asc"
        );
        res.json(allTodos.rows)
    } catch (err) {
        console.error(err.message);
    }
})

```
- we can call thr same route exact since the request type is different, we have a GET request to this route, and a POST request to this route, and all we are really changing is the query we are sending postgres depending on the request type
- and in postgres we see the response is:
```
[
    {
        "todo_id": 1,
        "description": "i need to clean my room"
    },
    {
        "todo_id": 2,
        "description": "i need to clean my room"
    },
    {
        "todo_id": 3,
        "description": "finish this coding project"
    },
    {
        "todo_id": 4,
        "description": "go for a run"
    },
    {
        "todo_id": 5,
        "description": "clean the table"
    }
]
```
- and now we have a simple way for our front end to extract all the items from our database todo table

#### Get Single ID Route

- we also want the front end to be able to GET specific items from our database, instead of all of them, since large database queries can take a very long time if the db is hugr
- this means we need a way to differentiate GET requests to the /todo route when they are for specific items instead of for everything, so we need to add a way to encode this in our URL, we do this in the same way we do this when we want to call an API, like the pokemon API for a specific pokemon where we might say 'pokemon/1' to get bulbasaur for example, except we are defining what to do when these queries are recieved:
```
// get todo by ID
app.get("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        console.log(req);
        console.log(req.params);
        console.log(id);
        const allTodos = await db.query(
            "SELECT * FROM todo WHERE todo_id=$1 LIMIT 1",
            [id]
        );
        res.json(allTodos.rows[0])
    } catch (err) {
        console.error(err.message);
    }
})
```
- notice our route is now `"/todos/:id"`, this syntax is telling express that when we get a GET request to a URL with the form `/todo/anything` it routes it to this handler, and within the request packet adds a parameter in the "params" property of `id: anything`
- the key name for this paramter, which is just a object property, will be whatever we set it to in the route, so for us it called `id`, since we called our route `todos/id`, and the value is whatever the user puts in the URL, so if the URL is `todos/3` the parameter would be `id: 3`, or if it was `todo/some_string` it would be `id: "some_string"`
- we can visualize the data structure by printing out the entire `req` object liek we do above, again we see a massive object, but within it is one property we can find call `params`: `params: { id: '3' },`, and if we also print `req.params` we indeed see we get `{ id: '3' }`
- so knowing this we can extract this from the req object easily with the line `const { id } = req.params;`, and then use this in the query call itself by passing the `[id]` array to the query function, and denoting the variable as `$1` in the query, as we did in the POST method: `("SELECT * FROM todo WHERE todo_id=$1 LIMIT 1", [id])`
    - **NOTE** we *could* technically use template literals here, and I had it like that originally: `SELECT * FROM todo WHERE todo_id=${id} LIMIT 1`, but this leaves our databse open to more vulnerabilities according to PostgreSQL docs, and with this method Postgres substitues the parameters itself in a safe way
- the `LIMIT 1` is added since we know the todo_id is a unique identifier, so we will only have 1 id that matches, and we do not want to search the whole database after we find the first one
- and we see in postgres, our response is as we expect:
```
{
    "todo_id": 3,
    "description": "finish this coding project"
}
```

#### Update a Todo

- in order to update a todo, we need some elements of both get a single todo, and the add a todo requests
- to update a resource we will use a PUT request instead of POST of GET, and a PUT request is somewhat similar to a POST, since we are adding data to the database, but the main difference between a POST and a PUT is that in a POST request, we define the URI of a resource that is going to handle the data for us, and determine the location to POST it, for example, we call a POST request to "/todos", and Postgres determines where to place this data in the todo table, 
- in a PUT request, the URI identifies the where this is going to placed in as well, in our PUT we will call "todo/:id", since we need to know which item to update, and the new updated info will be placed there, so this is specified in the URI, whereas in POST the location was not specified
- we can see this in the handler for our new update function:
```
// Update a Todo
app.put("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updateTodo = await db.query(
            "UPDATE todo SET description=$2 WHERE todo_id=$1 RETURNING *",
            [id, description]
        );
        res.json(updateTodo.rows[0])
    } catch (err) {
        console.error(err.message);
    }
})
```
- where the id of the resource to be updated is specified in the route, just like in the single get, and the user is also going to be specifying the updaed description, so we have to grab this from `req.body`, just liek in the POST request
- in the query itself we will then need to reference both these variables, so we pass in a multi-variable array into the parameters as `[id, description]`, then reference them with `$1` and `$2` respecitvely
- here we use the postgres syntax for updating a value `UPDATE todo SET description=$2 WHERE todo_id=$1`, where we say to update the table todo, and set the description to the passed in one for all rows with an id of the passed in id
- we notice we need to be careful to choose correctly here because if we used a selector that is not unique we may overwrite mulitple items here unintentionally 
- we also see we add `RETURNING *` so that we can once again have access to the new info in the return from postgres that will be saved as `updateTodo`, and we put that as our response in `res.json(updateTodo.rows[0])`


#### Delete a Todo

- when deleting, we certainly need to be careful with our code and db query since we do not want to accidentally delete a bunch of things
- but in general this is very similar to the other requetss, but we call a specific DELETE request instead:
```
// Delete a Todo
app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const deleteTodo = await db.query(
            "DELETE from todo WHERE todo_id=$1 RETURNING *",
            [id]
        );
        res.json(deleteTodo.rows[0])
    } catch (err) {
        console.error(err.message);
    }
})
```
- so we see we call `app.delete`, and give it the route `"/todos/:id"` since we want to specify which item to delete, 
- and with the postgres syntax: `DELETE from todo WHERE todo_id=$1 RETURNING *` we are simpyl making sure to specify the id we want to delete, and we see we also return the deleted row, and all wroks as expected

#### Search for Todos

- i made a search function as well, not sure if this is the best way to do it, since he did not do this in the tutorial, but we have to make a newish route by extending '/todo' to 'todo/search/:search', which seems intuitive enough for being a search query
- we end up with:
```
// search todos, need to figure out how to call this when search is given, different route??
app.get("/todos/search/:search", async(req, res) => {
    try {
        const { search } = req.params
        const allTodos = await db.query(
            "SELECT * FROM todo WHERE description LIKE ('%' || $1 || '%') ORDER BY todo_id asc",
            [search]
        );
        res.json(allTodos.rows)
    } catch (err) {
        console.error(err.message);
    }
})
```
- where we define the search query in the regular way of deconstructing the params object, and then in the postgres query we need to use a special syntax to be able to combine the partial match operator `% %` with the variable chooser operator `$1`, we end up with `"SELECT * FROM todo WHERE (description LIKE '%' || $1 || '%') ORDER BY todo_id asc"`
- the main thing here being we cant do `description LIKE '%$1%'` as we normally would if we were workign right in postgres (where we would say `description LIKE '%clean%'`), and instead we need to concatenate the string using postgres' syntax, where `||` is the concatentate operator in postgres, so we are adding the strings '%', $1, and '%' together
- we also put the string in paraenthesis, which is not needed when I tested, but it does do a better job showing it is a single string in the end
- so ehere  if use postman and do a GET to the URI "http://localhost:5000/todos/search/clean", we get the response of:
```
[
    {
        "todo_id": 1,
        "description": "clean my room"
    },
    {
        "todo_id": 5,
        "description": "clean the table"
    }
]
```
- which is exactly what we want!

## Building Our React Frontend

### Intiial Setup

- so far we have set up how we want the backend to work, how express and node will interact with our database, now we want to set up react, and let react interact with our server so that our react frontend will be the one sending the API requests to our server instead of postman
- but first we know we will liekly want to be using bootstrap within our react app for nice and easy styling, so we will add bootstrap 
- to do this we go to the bootstrap website and get the "CDN" links from the bootstrap introduction page, we want to add both of these links to the "client/public/index.html" file, which is the public html file that will be loaded when our webpage initially loads, we add the CSS file to head element of the html, and the JS file to the very bottom of the body element 
- we also want to make some files for the components we imagne we will have, such as the full list todo list, an edit todo view, and an input a todo view, and we call them ListTodo.js, EditTodo.js, and InputTodo.js, and we will keep all these in a new Components folder inside of src
- I am not going to go very in depth in React, just more my choice for this speciific app, since we have full react notes from the ReactCourse folder

### Building InputTodo Component

- so really we are just building a react front end now, and i will go over some of the basics for inital setup since that is the hardest palce to get going sometimes,
- we have our App.js file that we know everything is going to run through, we can erase everything inside the default return statement, and also get rid of the icon import at the top, I am going to leave the `import './App.css';` here
- we want to make one of our components so that we can show someting on the App page, and we will start with the InputTodo component, we can make a very simple functional component that that just returns its name so we can keep track of where it is on the page:
```
const InputTodo = () => {
    return (
        <h1>Input Todo</h1>
    )
}

export default InputTodo
```
- and we want to export default it so that we can import it in the app component, and we when we do so our App.js looks like:
```
import './App.css';
import InputTodo from './Components/InputTodo';

function App() {
  return (
    <>
      <InputTodo />
    </>
  );
}

export default App;
```
- so we import the InputTodo component and then we add it to the App's return statement
- now when we start our server with `npm start`, in the browser on localhost:3000, we can see the "Input Todo" h1 on the page
- we can style this a bit better with bootstrap so it is in the middle:
```
// InputTodo.js File
const InputTodo = () => {
    return (
        <div className="container">
            <div className="row text-center mt-5">
                <h1>Input Todo</h1>
            </div>
        </div>
    )
}

export default InputTodo
```
- and now we see our component is nicely centered
- so i am not going to do this for every design choice, but now we have the start of a component on our page
- we want to think about what functionality we want this app to have, and our component choices, and what we put in each component should be driven by acheiveing that 
- for example, we clearly want our input todo component to have the ability to add items to our todo list, so we want to make some sort of form submission type feature

#### Input Form

- so in react, we build an input form for the add Todo feature in the InputTodo component, our component returns:
```
const InputTodo = () => {
    const [description, setDescription] = useState("");

    const updateDescription = (e) => {
        setDescription(e.target.value);
        // console.log(description);
    }

return (
    <div className="container">
        <div className="row text-center mt-5">
            <h1>Input Todo</h1>
            <form className="w-100 mt-3 d-flex justify-content-center" onSubmit={onSubmitForm} >
                <div className="w-50 d-flex justify-content-center border border-1 border-secondary-subtle bor">
                    <input className=" form-control border-0" name="inputTodo" placeholder="What do you need ToDo?" value={description} onChange={updateDescription} />
                    <button className="btn btn-primary" >Add</button>
                </div>
            </form>
        </div>
    </div>
)
```
- so there is some styling that we can ignore, but we have a form component, and within that we have a input and button component
- first we want to deal with being able to use the input the user puts into the form input, so we create a state by using the `useState()` react hook that we call descirption, since that is the name of the column for the ToDo list items in our database, and set the form value to be equal to that state
    - this may seem confusing at first, since the user types into the form to decide the form value, but here we are setting the form value to the react state, but what we are really doing is making that react is the one true god here, we also have an `onChange` attribute set here that calls the `updateDescription` handler everytime the value of the input changes, and we see that the handler just updates the react state to be equal to the value of the form
    - so what is happening is that with every keystroke, the react state is updated by `updateDescription`, which updates the `description` state to the whatever the user typed, and thus the `value` field of the input now displays what the user typed, so we are working slightly backwards by making the user *really* update the react state, and the form just displaying the react state, but this allows the react state to be the true source of truth of the data, and thus we can pass that state around to other functions if we need it
- so now that we have a way to make the user update the state that we want to eventually send to our server to add to the database, we need to have a way for the user to actually submit the form to trigger that data sending
- we do this on the parent form element and not the button element, since it is the form that is actually going to get submitted in the HTML code, we see that on the form element we have the `onSubmit={onSubmitForm}` property, which will call another handler function that we need to define called `onSubmitForm` when the form is submitted, so when the button is clicked
- we can add this function to the component:
```
const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
        const body = { description };
        const response = await fetch("/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error(err.message);
    }
}
```
- so this above functione gets called when the form is submitted, and the first thing we want to do is `e.preventDefault();`, `e` is the event itself and that is automatically passed to the event handler when we define the  `onSubmit={onSubmitForm}` int he form HTML itself, and the `preventDefault()` function acts on the event by prevent the default behaviour of the event, which in this case is stops the page from being refreshed each time the form is submitted
- after this we want to use a try catch block for the actual logic of the function to make sure we can deal with possble errors, and here we define and set a `body` parameter to an object with the description state as its only property
    - note when we have some variable like `property = value` the syntax `const x = { property }` is the same as saying `const x = {property: value}`, so it is a short form for defining an object, so in our case `const body = { description };` is just `const body = { description: description_state }`
- we then make an asynchronous `fetch()` call to our server settign the response to the `response` variable
- here we have to make sure to choose the appropiate routing and API request type within the `fetch()` method, so here we want to add a Todo to our list, and therefore to the database, so within our server.js file on the backend, we know that functionality is a POST request at the /todos route, so the routing is easy enough we say `fetch("/todos",` to tell it to go to that URI, then we give the fetch request an object of options where we can tell it what data to give and what request type to make, etc
- previously we never had to do this since we were always making GET requests, in which we would just want to get data from a certain route, so everything on our side was handled by the URL we gave it, we can see more about the options we can give the fetch request in the mozilla docs: https://developer.mozilla.org/en-US/docs/Web/API/fetch
    - in general though, we want to give it a `method`, which we specify as `"POST"`, 
    - we also want to give it a list of "headers", headers are a way for us to pass additional information in HTTP requests, they are not always neccesary but are useful to give more info in our requests/responses that the user can use, in our case we just want to set a `Content-Type` of `application/json`, this header indicates the media type of the resource being sent, and we are sending JSON data, **in fact, we see when we eliminate this header, we still get a successful response, but the text is not added to teh database, we just add an empty row instead**
    - lastly, and most importantly, we also want to actually set the body of the request to the info we want to send, wich in this case is the `body` variable we just defined with the `{ description }` object, however we want to call `JSON.stringify(body)` instead of just the body object, since this takes the object and formats it as a string so it can be sent easily and without error in the request
- with these we can send a basic request, and now when we test this and submit the form in the browser, we see we get a request sent back printed in the console, and when we log into our database we can see that whatever we input into the form is correctly added to the database
- **the note below is before fixing an error, we originally had `console.log(response)` immediately after the fetch request, but then changes it to `const data = await response.json();` and `console.log(data)`, which now works as expected**
    - **note, in the browser** it looks like we did not get the right response, since on our server we say `res.json(newTodo.rows[0]);` when we built it above, which should make the response just the relevant rows of daa that were added, but the reponse is a response object with a bunch of info and none of it seems to be the data that was added, but if we look at the network, we see that if we click on the fetch request, we can see teh response, and it looks liek the response we saw in Postman and the one we expect, **however, this is because we did not jsonify our data, we have to do `const data = await response.json();` to get our proper response in a json format, then if we di `console.log(data)`, we get our expected response printed, which in this case was `{todo_id: 17, description: 'test test 8'}`

### Building ListTodo Component

#### Initial Component with State

- so i built this without watching the tutorial video and then am watching it now as i make notes on wat I did so that I can ntoe the differences between the video and my approach and where I went wrong, so I can explain the reasons why my appraoch might be not great, or maybe find some things I did tha seem to be an actual imporvement over the video
- we want to have a component that displays our entire list of course, so that is what we are building, we are going to make it in the ListTodo.js file
- so to build his component, he gets a premade table from the w3school website, that built in headers that he is going to use it seems as delete and edit buttons, my table was made by me and is just a list of ListItems components that I will explain later
- the first thing we need todo is have the basic ListTodo component:
```
import {useEffect, useState} from "react";

const ListTodo = () => {
    const [todos, setTodos] = useState([])
    

    return (
        <main className="container w-50 mt-4">
            <div className="row d-flex flex-column justify-content-center">
                todo list
            </div>
        </main>
    )
}

export default ListTodo
```
- so this does nothin for us at the moment, but we notice that we return some HTML that is going to be in the format of a centered list, and we also have created a state that we are going to store our todo list items in with `const [todos, setTodos] = useState([])`, also notice our course we have imported the `useState` hook from react, but we also inport the `useEffect` hook as well, which allows us to run a defined callback funtcion each time the component render, or whenever some state in our program chnages that we decide, we will use this next

#### Calling the API to Get all Todos

- now of course we want to be able to actually fill the `todos` state by using another fetch request to our server to get that data, this is where we use the `useEffect` hooK:
```
import {useEffect, useState} from "react";

const ListTodo = () => {
    const [todos, setTodos] = useState([])

    const getTodos = async () => {
        try {
            const response = await fetch("/todos")
            const data = await response.json()
            await setTodos(data)
            // console.log("got todos:");
            // console.log(todos[0]);  
        } catch (error) {
            console.error(error.message);
        }   
    }

    useEffect(() => {
        getTodos();
    }, [])

    return (
        <main className="container w-50 mt-4">
            <div className="row d-flex flex-column justify-content-center">
                todo list
            </div>
        </main>
    )
}

export default ListTodo
```
- so above we added the `useEffect` hook, which simply calls another function that we have defined within our component called `getTodos()`, the reason we call this function instead of putting the logic right in useEffect is because we want this fucntion to be asyncronous, but we cannot define the callback of useEffect to be async, we end up with an error
- **note** that we pass `useEffect` an empty array as its dependencies, this is becuase `useEffect` will get called each time one of its dependecies is changed, so we could give it a state, and each tiem the state is updated we would call `useEffect`, in this case we just want it to be called when the page is loaded so we give it an empty array, if we gave it nothing, then it would be called constantly, and that would make too many API calls for us, so we do not want that
- so each time our component renders we call useEffect, and that will get `getTodos`, inside `getTodos()`, we see that is an async function that uses fetch to make a GET reques to the "/todos" route, which is really the http://localhost:5000/todos" route because of the proxy, 
- remember that the default behaviour of fetch is a GET request, so we do not need to pass in an options object witht he request type, and since we are not giving anything to the endpoint, no authorization and we just want to recieve the default data, we do not need any headers or anything
- so teh response we get is saved as response, then we want to parse that json response into useful data with `const data = await response.json()`, and we want to make sure to use `await` again since this takes meaningful time, and alstly we want to set the `todos` state to the new data with `await setTodos(data)`, here we call await but I am not sure it is needed, some places online do it, but it works for me either way
- **note** the reason we do not need to sift through the data when we setTodos is because early on our backend, in server.js, we set the response for these GET requests to `res.json(allTodos.rows)`, so only the data rows themselves are in the response, so now `todos` is a list of objects, each one having an `todo_id` and `description`, we can see this if we print `todos` after setting it:
```
(23) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
0: {todo_id: 1, description: 'clean my room'}
1: {todo_id: 2, description: 'buy a gallon of pcp'}
2: {todo_id: 3, description: 'finish this coding project'}
...
...
```
- so a big array, each item being an object with our data row

#### Using the Todo Data To Build Page

- so now that we have all of our list items in the `todos` state, we want to actually build a bunch of list items with it, in a way that does not depend on the number of items in the list of course, we do this by mapping the array onto a function that builds each list item individually:
```
// Above ListTodo function, but int he same ListTodo.js file: new ListItem Component
const ListItem = ({todoObj}) => {
    return (
        <div className="d-flex border p-0">
            <div className="list-num border-end p-2 text-center d-flex justify-content-center align-content-center flex-wrap">
                <h3 className="m-0">{todoObj.todo_id}</h3>
            </div>
            <div className="list-det lead d-flex flex-column justify-content-center p-2 ">
                <p className="m-0">{todoObj.description}</p> 
            </div>
        </div>
    )
}

// Inside ListTodo Component
useEffect(() => {
        getTodos();
    }, [])
    
    const todoHTML = todos.map((todoObj, idx) => {
        return (
            <ListItem todoObj={todoObj} key={idx} />
        )
    })

    return (
        <main className="container w-50 mt-4">
            <div className="row d-flex flex-column justify-content-center">
                {todoHTML}
            </div>
        </main>
    )

```
- so above we see that with in the ListTodo component, we now have all of our list items in a `{todoHTML}` variable that will be returned in the HTML markup, we build `todoHTML` in the function above by mapping the `todos` state array onto the callback function with `const todoHTML = todos.map((todoObj, idx) => { callback }`, where the callbakc function is called for every item in the array, and the we pass each array item to the function as `todoObj` and the index of said item as `idx`
- so for each item in our map, we are creating a new ListItem component, and to that component constructor, we are passing the data row itself, which is an object in the form `{todo_id: 1, description: 'clean my room'}` as shown above, and we are giving it a `key` of it `idx`, which makes them all unique components, which is needed by react
    - so this means the final `todoHTML` variable is going to consist of HTML markup in the form of:
    ```
    <ListItem todoObj={todoObj-1} key={1} />
    <ListItem todoObj={todoObj-2} key={2} />
    <ListItem todoObj={todoObj-3} key={3} />
    ...
    ```
    - and will fit into our HTML markup returned by the ListTodo component as:
    ```
    return (
        <main className="container w-50 mt-4">
            <div className="row d-flex flex-column justify-content-center">
                <ListItem todoObj={todoObj-1} key={1} />
                <ListItem todoObj={todoObj-2} key={2} />
                <ListItem todoObj={todoObj-3} key={3} />
                ...
            </div>
        </main>
    )
    ```
    - so in the end we are just going to have a variable number of HTML components of eac ListItem
- now we just need to build the HTML for each list item to make this work, which we do in the ListItem component we defined above:
```
// Above ListTodo function, but int he same ListTodo.js file: new ListItem Component
const ListItem = ({todoObj}) => {
    return (
        <div className="d-flex border p-0">
            <div className="list-num border-end p-2 text-center d-flex justify-content-center align-content-center flex-wrap">
                <h3 className="m-0">{todoObj.todo_id}</h3>
            </div>
            <div className="list-det lead d-flex flex-column justify-content-center p-2 ">
                <p className="m-0">{todoObj.description}</p> 
            </div>
        </div>
    )
}
```
- so for each list item, we give the ListItem function the todo object. and we create a simple little table liek structure of the list number and the description itself, and we extract the info from each `todoObj` with typical JS as `{todoObj.todo_id}` and `{todoObj.description}`, and we know how to access them by looking at the printout of the API response itself and seeing that we have the expected `todo_id` and `description` properties
- so this HTML is going to be rendered for each `ListItem` component that is returned by the ListTodo component that we showed above
- now we have a dynamic list of all of our todo list items, currently it is only updated when the page loads, and we want to add some functionality so that when a list item is added, we make a new API call and update the list as well, we can do this in a clunky way by adding `window.location = '/'` to the end of the `onSubmitForm` submission handler for the InputTodo component, and what this does is refresh the page to the default route '/', whenever the button is clicked, but this does a full refresh and does not look good, ideally we would want it to just happen in the background and get updated without a full refresh, will think of a way to do this

#### Building the Delete Button

#### Delete Button HTML 

- up next he is going to build the delete and then edit buttons my implementation does not have those yet, and my vision has them implemented a but different than his, but the functionality should be the same so we will start there
- in my implementation, i will add a delete and edit button to the `ListItem` component when we construct the HTML for each component, this is easy enough using bootstrap, the HTML return of the ListItem component now looks like:
```
return (
    <div className="d-flex border p-0">
        <div className="list-num border-end p-2 text-center d-flex justify-content-center align-content-center flex-wrap">
            <h3 className="m-0">{todoObj.todo_id}</h3>
        </div>
        <div className="list-det lead d-flex flex-column justify-content-center p-2 ">
            <p className="m-0">{todoObj.description}</p> 
        </div>
        <div className="d-flex flex-column ms-auto">
            <button className="btn btn-secondary flex-grow-1">Edit</button>
            <button className="btn btn-danger flex-grow-1" onClick={() => deleteTodo(todoObj, filterTodos)}>Delete</button>
        </div>
    </div>
)
```
- so here we are looking at the two button elements in the new last div element, we see one is for editing and one is for deleting
- the delete button then has an `onClick` property set for the event handler, **where we use an arrow function (`() => function`) to call the `deleteTodo` function,** we have to do this since we are passing the function arguments `(todoObj, filterTodos)`, since if we just did `onClick={deleteTodo(todoObj, filterTodos)}>`, **then the function would get called when the code is executed at the time of component creation, thus deleting each list item when the page loads**, I did this at first by accident and my database was cleared, thats a big oops, instead we just give `onClick` an empty function that points to our function when ever it is clicked
- we also notice we are passing a new `filterTodos` reference to the function, this is actually a function I define in the `ListTodo` component that calls `setState` on our `todos` state, and must be passed from `ListTodo` -> `ListItem` -> `deleteTodo`, where it is finally called
    - our other option here is to pass `todos` and `setTodos` down the chain instead, but this seemed more reasonable

#### Making the Delete Todo click Handler 

- we will see the reason why we must do this in the `deleteTodo` function below:
```
// List Item Component, Showing deleteTodo function
const ListItem = ({todoObj, filterTodos}) => {

    const deleteTodo = async (todoObj, filterTodos) => {
        try {
            const response = await fetch(`/todos/${todoObj.todo_id}`, {
                method: "DELETE",
            })
            const data = await response.json()

            // console.log(todos);
            // setTodos(todos.filter((todo) => todo.todo_id !== todoObj.todo_id));
            // console.log(todos);

            filterTodos(todoObj.todo_id);

            console.log(data);
        } catch (error) {
            console.error(error.message);
        }
    }

// Inside Parent ListTodo Component, Showing filterTodos Function, and Passing it to ListItem Component
const ListTodo = () => {
    const [todos, setTodos] = useState([])

    const filterTodos = (todoId) => {
        // console.log("filterTodos initiated");
        setTodos(todos.filter((todo) => todo.todo_id !== todoId));
    };
...
...
    const todoHTML = todos.map((todoObj, idx) => {
        return (
            <ListItem todoObj={todoObj} key={idx} filterTodos={filterTodos} todos={todos} setTodos={setTodos}/>
        )
    })
```
- so above we can see the chain of passing the `filterTodo` function defined in the Parent `ListTodo` component, which is then passed into `ListItem` as it is being made as a prop, we then see in the `ListItem` component the function is deconstructed in the regular prop way like `const ListItem = ({todoObj, filterTodos}) => {`, so it can now be used within this component, we then define the `deleteTodo` function, where we pass `filterTodos` in once again as an argument, and it finally gets called within the function
    - i had big issues with this that I thought were for a myriad of reasons, but it turns out I was deconstructing the prop incorrectly, at first I kept just listing `filterTodos` as an argument for the `deleteTodos` function, and then it would give me an error that `filterTodos is not a function`, I thought maybe this was due to it being an arrow function defined as a const, so changed the `filterTodos` definition to the regular `function fiterTodos() {}` style, but this didnt work
    - then I realized we need to recieve the prop first in the `ListItem` component, and deconstruct it as a prop with the `{filterTodos}` syntax, only then can we properly pass it into `deleteTodo` to get called appropiately
- before going into `filterTodos` more we will talk of `deleteTodo`
- so `deleteTodo` is called when the delete button is pushed on a `ListItem`, and then we use a try catch block to make a `fetch` API `DELETE` request to our server, calling the `app.delete("/todos/:id"` function, we see for this request we need to specify the `todo_id` in the route, as shown by the route `"/todos/:id"` int he delete request definition, so we do this by the URI in 
```
const response = await fetch(`/todos/${todoObj.todo_id}`
``` 
- where we use a string literal and the passed in `todoObj` to get the id of the todo item, ensuring the proper item is deleted
- we also see since it is a delte request, we need to specify this in the fetch options object with the `method: "DELETE"` property, but we dont need to add anythign else sicne were not passing more info other than the ID in teh route to the server
- we then jsonify the response as `data`, which is actually not needed since we dont do anythign with the response, so i will comment that out, but is useful when testing to pront the response to make sure its working
- then finally we want the updated list to show without having to fully refresh the page, and we can do that by just deleting the todo item from our `todos` state, so that we are insync with the server, so that it no longer displays in the list, then the next tiem the page is actually refreshed, or the GET all list items is run again, we will still be consistent since it was deleted from the server and it is no longer in the `todos` state
- so we accomplish this by "filtering" the todos state, in our case we do that by calling teh `filterTodos(todoObj.todo_id);` function that we passed down the chain from `ListTodo`, looking at this function again:
```
const filterTodos = (todoId) => {
    setTodos(todos.filter((todo) => todo.todo_id !== todoId));
};
```
- here we are able to use the `todos` state and `setTodos` state handler since we are now back in the `ListTodo` component, so this function is really just a mask for the calling `setTodos` in a different component
- we call `setTodos(todos.filter((todo) => todo.todo_id !== todoId));`, which we see acts on the `todos` state with a `filter()` method, the `filter()` method creates a copy of an array that is filtered down based on some conditional given in the callback 
- so in our case we are caling `filter()` on the `todos` state, and the callback of filter can have 3 arugments, the first being the value fromt he array currently being tested, the second being the index of the value, and the third being the array itself, so it is acting like a for loop really, 
- so we pass only thr `todo` value being tested to the callback, which then executes the function `todo.todo_id !== todoId`, and if this returns a value of `false` the array item is filtered out, and kept if the value is `true`, so in our case we look through all the ids of the todo items, and when we find the item where the id matches the one we just clicked delete on, we filter it out,
- so in this way, an array is built by `todos.filter((todo) => todo.todo_id !== todoId)`, with all items but the one that got deleted, then we set this array as the `todo` state with `setTodos()`
    - one note here is that the syntax of the callback function was new to me, normally we see callbacks with curly braces for the logic, but the above is just a quick one line way to write a single expression since that is all we need, the syntax `(todo) => todo.todo_id !== todoId` is equivalent to:
    ```
    (todo) => {
        if (todo.todo_id !== todoId) {
            return true
        } else {
            return false
        }
    }
    ```
- so now we have a properly working delte button that udates our page right away
- we also see we could have passed `todos` and `setTodos` through the cahin from `ListTodo` to `ListItem` to `deleteTodo`, insetad of defining a new funciton as a mentioned above, we actually see in the code block above for `deleteTodo`, I have commented out `setTodos(todos.filter((todo) => todo.todo_id !== todoObj.todo_id));`, since I tried it this way as well, and this is would be the equivalent line for passing the states in and doing it in the function, this worked perfectly, but I liked the other way better, there is certainly merit to just doing it liek this sicne then we dont have to go look back at the other component to figure out what `filterTodos` does

### Building the Edit Button

- **note, the below goes through my implementation without watching the video, I think this is objectively worse in one way, since we have alot of the functionality of the EditTodo component in the parent ListItem component, but I think we can encapsulate everything in the actual EditTodo component with some things learned in the video instead**
- we will have the edit button as a seperate component in its own file, `EditTodo.js`, however the functionality for `EditTodo` is in the `ListTodo` component, since the edit button is part of the child `ListItem` component that we construct for each todo
- we start by making a click handler for the edit button in the `ListItem`:
```
<div className="d-flex flex-column ms-auto">
    <button className="btn btn-secondary flex-grow-1" onClick={() => editModal(todoObj)}>Edit</button>
    <button className="btn btn-danger flex-grow-1" onClick={() => deleteTodo(todoObj, filterTodos)}>Delete</button>
</div>
```
- so we see that when this button is clicked we call the `editModal(todoObj)` function and we pass it the todo object we are working on in this `ListItem`
- we see the in the function itself, we construct the component on click, so that way we are not making all of these EditTodo compoennts immediately on page load, only as we need them:
```
const ListItem = ({todoObj, filterTodos}) => {
    console.log("ListItem");
    console.log(todoObj);

    const [editTodo, setEditTodo] = useState('')

    const editModal = async (todoObj) => {
        console.log("editModal:");
        console.log(todoObj);

        await setEditTodo(<EditTodo todoObj={todoObj} key={todoObj.todo_id} />)
        const modal = document.getElementById(`modal-${todoObj.todo_id}`)

        modal.showModal()
        document.querySelector('body').classList.add('modal-open')

        document.querySelector(`#modal-${todoObj.todo_id} .close`).addEventListener('click', () => {
            modal.close()
            document.querySelector('body').classList.remove('modal-open')
        })

        document.querySelector(`body`).addEventListener('click', (e) => {
            console.log(e.target)
            console.log(document.getElementById(`modal-${todoObj.todo_id}`))
            if(e.target === document.getElementById(`modal-${todoObj.todo_id}`)) {
                console.log('clicked off modal')
                modal.close()
                document.querySelector('body').classList.remove('modal-open')
            }
        })

    }
```
- we also see that we added a new state to the `ListItem` component, one that will keep track of the modal itself, so we build the `EditTodo` component within this state, and that way we can apply the state as a variable to the HTML returned by `ListItem` later
- we see here we call for the construction of the `EditTodo` component int eh `setEditTodo` function, this constructs the component as:
```
const EditTodo = ({todoObj}) => {
    const [description, setDescription] = useState(todoObj.description)

    console.log("building EDITTODO");
    console.log(todoObj);

    const editDescription = (e) => {
        setDescription(e.target.value)
    }

    ...
    ...

    const modalID = `modal-${todoObj.todo_id}`
    console.log(modalID);

    return (
        <dialog id={modalID} className="w-50" onClick={() => setDescription(todoObj.description)}>
            <form className="d-flex border p-0" onSubmit={(e) => onEdit(todoObj, e)}>
                <div className="list-num border-end p-2 text-center d-flex justify-content-center align-content-center flex-wrap">
                    <h3 className="m-0">{todoObj.todo_id}</h3>
                </div>
                <div className="list-det lead d-flex flex-column justify-content-center py-2 px-3 w-100">
                    <input className="form-control border-0" name="editTodo" value={description} onChange={editDescription} /> 
                </div>
                <div className="d-flex flex-column ms-auto">
                        <button className="btn btn-success flex-grow-1" >Save</button>
                        <button type="button" className="close py-1 px-2 align-self-end" onClick={() => setDescription(todoObj.description)}>Close</button>
                </div>
            </form>
        </dialog>
    )
} 
```
- so here we are showing the EditTodo compoent, we need to set a new state for the description of the todo item itself, since if we want to edit it we will need to have an input field that can update the description with an onchnage handler, just like we did for the InputTodo component earlier
- there is alot of HTML returned for styling, but the main points are that we have a form with an input field, and an edit button to submit the description, and a close button to just close it
- we see in the input field we call the onchange handler that will simply update the description state, just liek we had in the inputTodo component, 
- when we submit the form, we see that we call the `onSubmit={(e) => onEdit(todoObj, e)}` function, here since we need to pass in the event `e` from the click, and also the `todoObj`, we use the arrow function notation where the event is passed to function on the click
- the function itslef is defined in the `EditTodo` component as well and is shown below:
```
const onEdit = async (todoObj, e) => {
    e.preventDefault();
    try {
        const body = { description };
        // console.log(body);
        // console.log(JSON.stringify(body));
        const response = await fetch(`/todos/${todoObj.todo_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log(data);
        window.location = '/'
    } catch (err) {
        console.error(err.message);
    }
}
```
- the firsst thing we need to do as usual for form submission is `e.preventDefault();` to stop the page from refreshing immediately
- then we use a try/catch to the body of the JSON request we are going to make to the current `description`, which will be whatever is currently in the edit input field
- we then make a PUT API request, this time again specifying the ID of the todo that we want to edit with the `/todos/${todoObj.todo_id}` route, and also adding options to the request to specify PUT, our content-type, and the body of the request (the new description), just like we did when we make a POST request in `InputTodo`
- from there we just refresh the page with `window.location = '/'`, and we see our todo has successfulyl been edited
- back in the `ListItem` component, specifically the `editModal` function, we also added a significant amount of stylign to make sure our Modal has the functionality we want:
```
const editModal = async (todoObj) => {

        await setEditTodo(<EditTodo todoObj={todoObj} key={todoObj.todo_id} />)
        const modal = document.getElementById(`modal-${todoObj.todo_id}`)

        modal.showModal()
        document.querySelector('body').classList.add('modal-open')

        document.querySelector(`#modal-${todoObj.todo_id} .close`).addEventListener('click', () => {
            modal.close()
            document.querySelector('body').classList.remove('modal-open')
        })

        document.querySelector(`body`).addEventListener('click', (e) => {
            // console.log(e.target)
            // console.log(document.getElementById(`modal-${todoObj.todo_id}`))
            if(e.target === document.getElementById(`modal-${todoObj.todo_id}`)) {
                console.log('clicked off modal')
                modal.close()
                document.querySelector('body').classList.remove('modal-open')
            }
        })
    }
```
- we already covered the construction of the `EditTodo` with `setEditTodo`, but we are actually able to view the edit window as a modal by the `modal.showModal()` method, which is a built in method that brings up a standard dialog element
- it knows which dialog element to bring up because we just previously set `modal` to be the newly constructed `EditTodo` component with `const modal = document.getElementById('modal-${todoObj.todo_id}')`
- we then add a CSS class tot eh body element called `'modal-open'`, which ust adds the `overflow: hidden;` property to the bod so scrolling is disabled
- we also add an event listener to the close button of the modal element that calls `modal.close()`, which is the built in method for stopping the display of the modal, we also remove the `modal-open` class from the body so that scrolling enabled again,
- lastly to add the fucntionality of being able to close the modal by clicking off of the body, we add an event listener to the body that checks the element that was clicked on, and if the element being clicked is the modal element, then we also call `modal.close()`
    - this works since the backdrop when the modal is open is the base modal element, the `<dialog>` element in our EditTodo HTML markup, if we click on the actual edit dialog box of the model, the reutnred element is the more specific `<div>` or `<input>` or whatever element we clicked on, only the empty backdrop still returns the blank `<dialog id='modal-${todoObj.todo_id}'>` 
- lastly, we want to make sure that is we edit the description with the edit dialog box open, we also want it to be reset to the original todo description when we close it, and we can do this by adding `onClick={() => setDescription(todoObj.description)}` to both the parent `<dialog>` element, and the close `<button>` element

#### REFACTOR: Changing EditTodo To Encapsulate All Modal Functionality

- **so we fully built a working EditTodo component in the previous section, but now I want to chnage it up a but to be a bit cleaner in my opionion in a couple of ways**
- in the original implementation, we had an edit `<button>` element in the `ListItem` component, and when we clicked that button it would call a function, also in `ListItem` that would initialize the `EditTodo` component, and also add a bunch of event listeners to the component as well, but the actual HTML for the `EditTodo`, including the modal and everything, was in the seperated `EditTodo` comoonent, so we were splitting the HTML and alot of the functionality of the modal/component bewteen files/components, which I do not like
- the reason we did this was so that we would only render the modal after click, in the video, the whole modal HTML is rendered for each `ListItem` and only shown on button click, I dont like this long term since if we had like 100 list items, we render A TON of HTML for no reason if only a few of them ever get clicked on
- so in the video, he had the edit `<button>` element replaced with the actualy `<EditTodo />` component, and all the HTML was rendered right there, so the upside is everything for the `EditTodo` component is localized in the component itself
- I want to make the best of both world, and at first could not figure out how, then I slept on it, came back, and now we ballin baby
- okay so first, I used his strategy of just placing the `<EditTodo />` component within the `ListItem` HTML where we want the Edit `<button>` element to be, so now `ListItem` looks like:
```
const ListItem = ({todoObj, filterTodos}) => {

    const deleteTodo = async (todoObj, filterTodos) => {
        try {
            const response = await fetch(`/todos/${todoObj.todo_id}`, {
                method: "DELETE",
            })
            const data = await response.json()
            filterTodos(todoObj.todo_id);
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className="d-flex border p-0">
            <div className="list-num border-end p-2 text-center d-flex justify-content-center align-content-center flex-wrap">
                <h3 className="m-0">{todoObj.todo_id}</h3>
            </div>
            <div className="list-det lead d-flex flex-column justify-content-center p-2 ">
                <p className="m-0">{todoObj.description}</p> 
            </div>
            <div className="d-flex flex-column ms-auto">
                <EditTodo todoObj={todoObj} key={todoObj.todo_id} />
                <button className="btn btn-danger flex-grow-1" onClick={() => deleteTodo(todoObj, filterTodos)}>Delete</button>
            </div>
        </div>
    )
}
```
- so now our parent `ListItem` is very clean and only has the `deleteTodo` click handler
- inside `EditTodo`, we now return the Edit `<button>` element, and have abstracted the modal that is made upon click into its own component, and we have an `{editModal}` placeholder that gets filled when the button is clicked
- so this functionality is very similar to how I had it before, bute now it is all inside `EditTodo`:
```
const EditTodo = ({ todoObj }) => {
  const [editModal, setEditModal] = useState("");

  const renderEditModal = async (todoObj) => {
    const key = `modal-${todoObj.todo_id}`;

    await setEditModal(<EditModal todoObj={todoObj} key={key} />);
    const modal = document.getElementById(`modal-${todoObj.todo_id}`);

    modal.showModal();
    document.querySelector("body").classList.add("modal-open");

    document.querySelector(`#modal-${todoObj.todo_id} .close`).addEventListener("click", () => {
        modal.close();
        document.querySelector("body").classList.remove("modal-open");
      });

    document.querySelector(`body`).addEventListener("click", (e) => {
      console.log(e.target);
      console.log(document.getElementById(`modal-${todoObj.todo_id}`));
      if (e.target === document.getElementById(`modal-${todoObj.todo_id}`)) {
        console.log("clicked off modal");
        modal.close();
        document.querySelector("body").classList.remove("modal-open");
      }
    });
  };

  return (
    <>
      <button className="btn btn-secondary flex-grow-1" onClick={() => renderEditModal(todoObj)}>Edit</button>
      {editModal}
    </>
  );
};
```
- so we moved the `[editModal, setEditModal] = useState("");` state into `EditTodo`, and we also now have all of the functionality for the modal, with the click handlers and the opening and closing calls, in `EditTodo` itself in the `renderEditModal` function
- previously I could not do this since hte modal was built in `EditTodo`, so we could not be referencing and controlling the modal opening and closing within the modal itself, it has to be a layer outside, but we fix this here by having `EditTodo` just building the button, and abstrcting the Modal to its own child component in the same file called `EditModal`
- we see that `EditTodo` now calls for the construction of `EditModal` when the Edit `<button>` is clicked through the `renderEditModal` function in the `await setEditModal(<EditModal todoObj={todoObj} key={key} />)` line
- we then add the opening and closing functionality as we normally did
- inside the `EditModal` component, (which is in the same file since it is only used here):
```
const EditModal = ({ todoObj }) => {
  const [description, setDescription] = useState(todoObj.description);

  const editDescription = (e) => {
    setDescription(e.target.value);
  };

  const resetDescription = (e) => {
    if (e.target === document.getElementById(`modal-${todoObj.todo_id}`)) {
      setDescription(todoObj.description);
    }
  };

  const onEdit = async (todoObj, e) => {
    e.preventDefault();
    try {
      const body = { description };
      const response = await fetch(`/todos/${todoObj.todo_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  const modalID = `modal-${todoObj.todo_id}`;
  console.log(modalID);
  return (
    <dialog id={modalID} className="w-50" onClick={(e) => resetDescription(e)}>
      <form className="d-flex border p-0" onSubmit={(e) => onEdit(todoObj, e)}>
        <div className="list-num border-end p-2 text-center d-flex justify-content-center align-content-center flex-wrap">
          <h3 className="m-0">{todoObj.todo_id}</h3>
        </div>
        <div className="list-det lead d-flex flex-column justify-content-center py-2 px-3 w-100">
          <input
            className="form-control border-0"
            name="editTodo"
            value={description}
            onChange={editDescription}
          />
        </div>
        <div className="d-flex flex-column ms-auto">
          <button className="btn btn-success flex-grow-1">Save</button>
          <button
            type="button"
            className="close py-1 px-2 align-self-end"
            onClick={() => setDescription(todoObj.description)}>
            Close
          </button>
        </div>
      </form>
    </dialog>
  );
};
```
- here is where most of the work is actually done, we can see in the return statement we build all of the large HTML for the modal, which has not changed for the most part
- we still ahve the `description` state that is initially set to the listObj description, and lets the user update the state as we type into the input field
- we also have the `onEdit` function for when the form is submitted that deals with the PUT request to edit the data in our database, nothing has changed there
- the only difference now is that we had to alter the functionality for the reseting of `description` back to `listObj.description` when the edit modal is closed, for some reason when we put all of this into its own component, the `onClick` handler for the input field that we had previously: `onClick={() => setDescription(todoObj.description)}` would now get called when we hit the `Save` button, thus our description would get set back to the initial description immediately before the `onEdit` function was called for the PUT request, so we were never actually able to edit anything in the database
    - the original functionality for that is to reset the description when we click off the modal, since clicking off he modal returns the `<dialog>` element for the event target, while clicking on the modal itself returns the more specifc element, in this case the save `<button>`, and through testing we see it was still returning the more specific save `<button>`, but was still running the onClick reset for soem reason
- Now this makes some sense since the "Save" button is part of the parent `<input>` element, so it was calling that onClick handler when we clicked on "Save", but this was not how it worked before abstracting this, so who knows
- we fix thsi easily enough by changing the onClick handler to call a new function `onClick={(e) => resetDescription(e)}`, where we simply use the same condition we use for the modal closing functionality, `if (e.target === document.getElementById(`modal-${todoObj.todo_id}`))` before resettign the description:
```
const resetDescription = (e) => {
    if (e.target === document.getElementById(`modal-${todoObj.todo_id}`)) {
      setDescription(todoObj.description);
    }
  };
```
- so now it only resets if we are clicking off the modal to close it, and if we click on the Save `<button>`, we see the button element gets returns for `e.target` instead, as mentioned above, so the description does not reset and we are gucci
- so in total, this now gives a fully abstracted `EditTodo` element, and we do not have to worry about editing functionalit leaking into the `ListTodo` element

# Adding Login Functionality

- so for adding login we are lookng at a video on JWT for registration, authentication, and login (https://www.youtube.com/watch?v=7UQBMb8ZpuE)
- okay but first I am going to over the info from https://jwt.io/introduction to get an intro into what JWTs are a bit better

## What is JWT and What is it Used For


- JWT stands for JSON web tokens, and it is used for authorization, not authentication
- authentication is the process of checking if we really are the person we claim to be when using a webapp
- authorization is the process is checkin what that person is allowed to do on the webapp, like how i am able to access my data on a website, but not someone elses
- More generally JWON Web Tokens is an open industry standard method for representing claims securely between two parties online 
- so we have some sort of claim with info about a user when they try to login, and we want to be able to make sure that user is authorized to view specific things, and we want to know that the authorization is valid, and has not been tampered with, JWT allows that
- the information in a JWT can be trusted because it is digitally signed, in general signed tokens are used to verify the integrity of the claim within them
- however, in general, JWT does not provide secrecy, the data is not encrypted
- so encryption hides data, signing tokens verifies the integrity of data
    - It is also possible to encrypt a JWT token to hide the payload, but that is supplemental and we are not focusing on that
- As mentioned, we use JWT for authorization, once a user is logged in, all requests after that use a JWT to decide what the user has access to
- it is also used for information exchange, since JWT is signed, we can ensure the sender of teh info is who they say they are, 
- the signiture itself is also calculated using the header/payload, so we can ensure the message hasnt been tampered with either
    - however rememebr, this doesnt mean the message was not read, it is not hidden/encrypted

#### JWT Structure

- JSON web tokens consist of a header, payload, and signature, and part is seperated by dots `.`, in the form of `hhhhhh.pppppp.ssssss`, with the lengths of each varying
- each of these components are a JSON object that has been encoded in Base64, using the "Base64URL" system, which encodes all the information to reconstruct the object in a base64 set that consists of all letters, capital letters, and numbers 0-9, which makes 62, then 2 symbols are used, and that differs by system
- so this is done to make it easier to send since it just becomes a string of characters instead of a multiline object
- the **Header** usually consists of two parts, the token type, which will be JWT in our case, and the signing algorithm used, 
    - for example:
    ```
    {
        "alg": "HS256",
        "typ": "JWT"
    }
    ```
    - this is using the HMAC with SHA-256 algorithm to encode the signature
- The **Payload** conatians the claims, which is the bulk of the info, info about the user and other data that we want our server to know and decide what can be accessed
    - there are different types of claims, registered, public, and private
    - *registered claims* are predefined ones that most systems use and are recommended, like the issuer (`iss`), the expiration time (`exp`), the subject (`sub`), and the audience (`aud`), as well as others
    - *public claims* are customs ones can be defined at will by people using JWT, to share info publically, but in general we want to make sure we are using ones defined in this online registry (https://www.iana.org/assignments/jwt/jwt.xhtml), otherwse we could have conflicts when some system defines a claim the same as us but it means different things
    - *private claims* are custom claims to share information that the parties exchanging them have agreed upon, like my site and my server for example
    - example payload:
    ```
    {
        "sub": "1234567890",
        "name": "John Doe",
        "admin": true
    }
    ```
- the **Signature** is then generated using the base64 encoded header, the encoded payload, a secret key, and the algorithm specified int he header, it is generated by a function, 
    - in our case with HMAC SHA256 algorithm, the encoding would look like:
    ```
    HMACSHA256(
        base64UrlEncode(header) + "." +
        base64UrlEncode(payload),
        secret)
    ```
    - so the secret key allows us to verify that the JWT has been tampered with, since we encrpypt this secret key into the signature, so when the request gets to our server, I believe since we know the header and payload since it is part of the visible part of the JWT (`hhhhhh.pppppp` encoded in base64), we can then plug `hhhhhh` and `pppppp` back into the `HMACSHA256()` with our secret key, and if we get the same signature, we know it had not been tampered with and that it was sent by someone that knows our secret key
    - since if someone who didnt know our key went and chnaged the header or payload to mess with us, they woudl not know what secret to plug into `HMACSHA256()` to match with ours, 
        - so lets say our secret key is `secret1234`, and we made a request on the client side with a header of `hhhhhh` and a payload of `pppppp`, then we would make our signature with: 
        ```
        HMACSHA256(
            'hhhhhh' + "." +
            'pppppp',
            'secret1234'
        )
        ```
        - and lets say this returned a signature of `ssssss`, so therefore, our JWT looks like: `hhhhhh.pppppp.ssssss`
        - now pretend someone intercepted the request and changed the payload from `pppppp` to `pabcdp`
        - now the incoming JWT would read `hhhhhh.pabcdp.ssssss`, and when we recieve it we would then check this request with:
        ```
        HMACSHA256(
            'hhhhhh' + "." +
            'pabcdp',
            'secret1234'
        )
        ```
        - and this functon would return some different signature `fhvimv` since the signature relied on each component of the request, the payload, the header, and the secret key
        - this also relies on the `HMACSHA256()` function not being reversible, for example, the nasty man who intercepted our request could also just change the secret key and input it into `HMACSHA256()` until he got `ssssss` as a result, then sent the request, but this is either impossible, if SHA256 always returns a unique result, or statistically impossible since even if it didnt it would take trillions of guessing and checking since there is no way to predict what the encrpting function will return
- okay so that was over the top and probably wrong in some aprts, but I wanted to understand a bit what I was working with before diving in which the video very well may end up going over 
    
#### JSON Web Token Signatures

- we can use https://jwt.io/ to easily make and mess with JWTs so we can see in real time how they are effected by us changing things
- as mentioned above, the signature is encoded using the header, the payload, and the secrety key we give the function
- the only way we are going to be able to get access to our secret key is through our server, we want it to be hidden within our backend application
- he holds his secret key for this project in a '.env' file in the server folder of the project
- this also enphasizes that we need a good secret key, if i use chris1234, then it is very easy to guess that is the secret key, then all the encryption of the signature is useless

### End Goal Code

- so he has a file that geenrates JWTs, and that is called by a number of routes in the backend express code, 
- then he also has a larger file that is for authorization of JWTs, where we have the function for registering new users and logging in previous users, and these use password excryption which is fun, but also do things like call the making of JWTs for our responses and stuff
- we also have an authorizaition file that is middleware which takes all requests first to authorize all imcoming requests first beofre passing them to the express routes on the backend that do other stuff 

---

## Configuring a Relational Database 

### Visualizing Database Relationships

- We can use the website draw.io that lets us build "Entity Relationship Diagrams" that help us visualize how data in databases are connected
- we see int he defualt diagram that we have a customers table, a Order Table, and a Shipment table, and in each of them we have a 'PK' (primary key) label, and a 'FK' (foreign key) label, and we will go over all of this
- In these diagrams, the "Entities" are our tables in our database, and each Entity has "Attributes", and these are like the columns of our tables, the attributes of each data type
- so the Entity Relationship Diagrams (ERD) show us the entities in a database and the relationship the entities have with eachother 

### Primary Keys

- the primary key is the unique identifier of the item in a table
- we can see how this is important in an example scenario where we have a tbale of users, lets say we used their first name, last name, and age to define them, we would very quickly end up in a scenario where we had two items with data tuples of `(john, smith, 30)`, and we would have no way to uniquely identify them
    - note, we call all the data entires in a row a tuple here
- so we would want to introduce an `person_id` column where each person was given an unique id number, this acts the primary key in this scenario, it is the means by which we can uniquely identify each item in the table, and they must never overlap or be duplicates
- now the ID style is the most obvious form, but it doesnt need to be an ID number, the primary key can also be multiple data items, like we could say the primary key was (first_name, height), which means if two names or two heights overlap thats okay, but every name/height pairing must be unique (**and this is a terrible terrible PK since again we would be limited by this very quickly**)
- so with this we can build a table in our little drawing software to represent a person, and this is just a visualization software, so we can just make a simple table with entries in the drawing board and give the person ID a PK ag in front of it
- note in this software we do not put in items or rows, we just list how the data is going to be arranged, so we can visualize the structure of the DB
- Now our primary key has 3 criteria:
    1. it can never change
    2. it cant be null 
    3. must uniqely identify 1 row in the table 
- we can never have it change since otherwise it can be edited to overlap with a different item, and in this case we end up violating rule 3
- now there are also 3 ways to create a primary key:
    1. surrogate key: generated value, like incremented ID or randomly generated identifier 
    2. natural key: using an attribute that already exists
    3. composite key: combining multiple attributes
- so our person_id from above is a surrogate key, whereas the (name, height) thing would be a composite ey and also would be natural as well
- **for surrogate keys**, we often use Universally Unique Identifier for IDs (https://en.wikipedia.org/wiki/Universally_unique_identifier), which are long strings that are often shown in  base16, with a 8-4-4-4-12 format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, where each x is a base16 character (0 to f), and each character takes 4 bits to store 
    - they are generated randomly, so we dont actually check if there is overlap, which seems wild, but because of the large number of possibilities, we would need to generate 2.71E18 strings to have 50% chance of a single collision, which is wild
- **for a natural key**, a common example is to use a social security number for the government for example, but we wouldnt want to use this for online stuff since we dont need to have people enter their SSN to sign up for a website
- again **for composite key**, we use two different identifiers, so we could use email and phone number or something, but then we would need to have both and people not enter fake ones for a website
- in general we call attributes or sets of attributes that could quialitfy as a PK a **candidate key**

## ToDo DataBase Design

- okay so we want to design the database with our little drawer for the the ToDo app with login functionality
- here we would have 2 tables, each are simple enough on their own
- we would have a our `users` table with 4 rows: `PK`-`user_id`, `user_name`, `user_email`, `user_password`
- then we would have our `todos` table with just 3 rows: `PK`-`todo_id`, `description`, `FK`-`user-id`
- so here we see the tables are linked by the `todos` items having a "foreign key" of a `users` item "primary key", this ensures it is linked to a single unique user
- we will go over more what foreign keys really are and how they work:

## Foreign Keys

- the foreign key is what builds relationships between the tables
- we can imagine our `todos` table holds all todo items for the everyone, and in that table the `users_id` FK column holds different `user_id`'s depending on who created the todo
- it is very important that the FK in the todos table is the PK of the table it points to, otherwise if we used `user_name` as the FK of the `todos` table, we could see there are a ton of user items that have a `user_name` of 'chris' for example (in a site where they allow non-unique usernames)
- so we build realtionships between the tables, and in the little database drawing tool we display this by giving the `user_id` in the `todos` table a header of FK, and then we can use something called *crows foot notation* to draw little arrow type relationships between the linked data attributes 

### Crows Foot Notation

- so there are different arrow type things used for drawing database relationships:

    ![image](./notes/crowsFootNotation.JPG "Crows Foor Notation")

- so when we draw these on tables, each end is connected to an attribute in a data table, and the symbol at the each end of the arrow tells us the type of relationship between the attributes 

    ![image](./notes/oneToOne.JPG "One to One")

- for example, the first arrow with the two single vertical lines means that there must be only a single element from that attribute, we can image an `employees` table and a `contracts` table, where an `employee_id` is the PK of `employees` and also the FK of `contracts`, we draw a connection between them with the "exactly one" cap at each end since an employee must have only one contract, and each contract must have only one employee it is for 

    ![image](./notes/oneToOneOptional.JPG "One to One Optional")

- we can also use one to one optional relationships, so we see a `users` table and a `drivers license` table here, and we know in real life, each user *can* have a *single* drivers license, so we can only have 1 but it is optional whether we have one or not, so 0 or 1, but then for every drivers license, each license *must* have exactly 1 user
- so here we have an asymmetric relationship, so we notice the drivers license NEEDS a user, so the arrow cap on the user side has the exactly 1 symbol, so it is like an arrow pointing from the license user_id FK to the person user_id PK and the arrow tip shows the relationship from the drivers license perspective, conversely, the user can have 1 license, so the arrow direction from person user_id PK to license user_id FK has an arrow tip for "0 or 1"

    ![image](./notes/oneToMany.JPG "One to Many")

- so one more example here, we have a mothers table and a kids table, and here we see since we define the person as a "mother", they must have at least one kid, so the arrow from `mother` to `kids` has a cap of '1 or more' (or many mandatory), while the arrow from kids to mother has the cap of 'exactly 1' since each child has 1 biological mother

    ![image](./notes/oneToManyOptional.JPG "One to Many Optional")

- okay actually lastly we have one to many optional, a users table and cars table, where a car has a single owner, but it may not be owned as well, so we have a '0 or 1' arrow from car to user, but from user to cars we have a '0 or many' arrow, since a user may have no cars, but may also have multiple cars

    ![image](./notes/manyToMany.JPG "Many to Many")

- okay so actually last one for real, here we have students and courses, to be a student you must be taking at least 1 course, but coul take many, so from student to course we have a '1 or more' arrow, and from course to student we have a '0 or more' arrow since wemay have a course that noone enrolls in

---

- so for us, we have a table for our users and a table for our todos, and we know a user can have many todos, but they may also have not made any yet, or can delete all of them, as for our todos, each todo must have a user who created it, and they are all unique so they can only have a singl user, so we make an arrow from users user_id PK to todos user_id FK with a '0 or more' arrow tip, while from todos user_id FK to users user_id PK, we have a 'exactly 1' arrow tip:

    ![image](./notes/todoDatabaseDrawing.JPG "ToDo Database")

## SQL Join Operators

- so now that we understand these concepts, how do we actually create these relationships on our database with SQL/postgres and have them work cleanl
- we do this in SQL with JOIN operators
- in the TOdo applications, we want each user to be able to display theyre own private data
- so we want to be able to combine tables for a given condition, like for example when the user_id or a user, matches the user_id of a todo, that way we get the todos for that user
- in postgres, this looks like: `SELECT * FROM users INNER JOIN todos ON users.user_id = todos.user_id;`
- so here we take everything from users, and join it with the todos items, but only when the users user_id matches the todos user_id
- what we end up with here are `RECORDS`, where it returns a record for each instance of this match, so in this case for eacj todo, where we have 3 joined data attributes where each shows the todo and user info for each todo
- now obviously, we want to only display the todos of one specific user,and not all of them, so we have to add another WHERE clause where we specify the user_id of the user we want to get the onfo for:
```
SELECT * FROM users INNER JOIN todos ON users.user_id = todos.user_id WHERE users.user_id = 'some-user-id';
```
- where some_user_id is an actual user ID and not just a place holder
- now if we do this we only get the RECORDs that have to do with the single user

### Join Operator Types

- okay so above we used the INNER JOIN operator, but in the actual code for the final site he uses the LEFT JOIN operator in this case instead, which still joins the data but in a different way
- there are different types of join operators that we can use to combine records from different tables with a related attribute
- there is:
    - inner join
    - left join
    - right join
    - and full outer join

    ![image](./notes/joinOperatorTypes.JPG "tpyes of join operators")

- **INNER JOIN** selects only the records that matching attributes in both tables, so here we get all of the records from both the `users` and `todos` table that have matching attributes
- **LEFT JOIN** selects all records from the left table, and then all matching records from the right table, so in this case we get all the users even ones without matching attributes, but for the todos we only take ones with matching attributes
    - example, we want to show all users, and for users with posts, we want to show how many posts they have
- **RIGHT JOIN** is the opposite of LEFT JOIN, we take all records from the right table, todos in our case, then only takes the matching records from the left table, users in our case
    - we want to show every post ever made, even if there are some authorless posts, and for each post we also want to show the author info
- **FULL OUTER JOIN**, selects all records on the right and left table even without matching attributes
- so in our example query:
```
SELECT * FROM users INNER JOIN todos ON users.user_id = todos.user_id WHERE users.user_id = 'some-user-id';
```
- `users` is left table, `todos` is right table, `INNER JOIN` is our join operator, `ON users.user_id = todos.user_id` is our matching condition, 
    - then we supplementally filter it further with the WHERE clause

## Creating Our Database

- okay so finally we will be creatign the database we want using the principles we have talked about here,
- we will be creating the database using the design we have been talking about, which we have already shown above:

    ![image](./notes/todoDatabaseDrawing.JPG "ToDo Database")

- so we know we want to create a database, make a users table with a UUID (Universally Unique Identifier) PK, and make a todos table with a FK of the user_id 
- we will write these commands in the database.sql file which allows us to keep track of what we did and write them out nicely before copying them in to the postgres command line application
- also since we are making this as an add on to our current ToDo app, we will be making a new database so that we can arrange it how we want and get practice doing this
- so the first thign we want to do of course is log into our postgres again from the command line, and create our new databse, which I will call todoapp, with: `CREATE DATABASE todoapp;`
- we then want to create our users table, and what I have  noticed that is nice is that with this method of having our todos list a users table that is linked to each one, instead of somehow tracking a list of each todo within the users table (which may seem to make more sense initially), is that with this structure we can add todoos easily and just say what user they belong to with the FK, and also if wew anted to add a new feature, liek liking specific todos, we would simply make a new 'likes' database and be able to retroactively add this feature since we do not need to alter the users or todos table, we would just need to specify a user_id FK and possibly a todo_id FK for each "like"

### Making the Users Table

- okay with that we we can start to create our users table, and we will build up the code for it one line at a time:
    - first we do the initial create table function call:
        ```
        CREATE TABLE users(
        ```
    - then we will specify the user_id column, and we want the type of this column to be a `UUID`, we also want this to generate a value for this column by default since we want all users to have an auto generated user_id, and lastly we need to use the `uuid_generate_v4()` function to generate the UUID, and this is an add on extension to postgres that will actually make the UUID for us:
        ```
        CREATE TABLE users(
            user_id UUID DEFAULT uuid_generate_v4(),
        ```
    - we also want the user to be able to specify a username, so we make a user_name column that can be a varchar, and we also want them to have to make a username so we can specify it as `NOT NULL`:
        ```
        CREATE TABLE users(
            user_id UUID DEFAULT uuid_generate_v4(),
            user_name VARCHAR(255) NOT NULL,
        ```
    - we also want to store the user_email, and here we will also use the VARCHAR type, and also say it is mandatory, the difference here is that we will say it has to be UNIQUE, so two users cant have the same email:
        ```
        CREATE TABLE users(
            user_id UUID DEFAULT uuid_generate_v4(),
            user_name VARCHAR(255) NOT NULL,
            user_email VARCHAR(255) NOT NULL UNIQUE,
        ```
    - and of course we will have a password that is also VARCHAR, and NOT NULL: 
        ```
        CREATE TABLE users(
            user_id UUID DEFAULT uuid_generate_v4(),
            user_name VARCHAR(255) NOT NULL,
            user_email VARCHAR(255) NOT NULL UNIQUE,
            user_password VARCHAR(255) NOT NULL,
        ```
    - now here we want to define our primary key as the user_id of course, which once again makes it the unique identifier for the items in this table:
        ```
        CREATE TABLE users(
            user_id UUID DEFAULT uuid_generate_v4(),
            user_name VARCHAR(255) NOT NULL,
            user_email VARCHAR(255) NOT NULL UNIQUE,
            user_password VARCHAR(255) NOT NULL,
            PRIMARY KEY(user_id)
        );
        ```
- and this is our final command for creating the users database table! before we input this though it is a good practice to write our todos one first, that way we can look at them both and make sure they are structured how we want, it is much easier to make it write the first item then to append our table later

### Making the Todos Table

- so now we want to create the todos table, and we will do so in a similar manner:
    - here we want to make the todo_id just a serialized number, liek we did for the ids previously:
        ```
        CREAT TABLE todos(
            todo_id SERIAL,
        );
        ```
    - then we want to specify the user that this todo belongs to with the user_id from a user, we still need to specify the type here though, but not the function since we are not generating it here:
        ```
        CREATE TABLE todos(
            todo_id SERIAL,
            user_id UUID,
        );
        ```
    - we also want the description of course, and we want that to be a VARCHAR as well, and we want it to be mandatory:
        ```
        CREAT TABLE todos(
            todo_id SERIAL,
            user_id UUID,
            description VARCHAR(255) NOT NULL,
        );
        ```
    - now we need to set up the PRIMARY KEY, and for this one the FOREIGN KEY, the primary key will be th serialized ID, while the FK is going o be the user_id of course
    - however for the FK, we also need to add a REFERENCE, which tells SQL where the FK should point to, and for us we want it to point to the isers table, and in particular the user_id column:
        ```
        CREATE TABLE todos(
            todo_id SERIAL,
            user_id UUID,
            description VARCHAR(255) NOT NULL,
            PRIMARY KEY (todo_id),
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        );
        ```
- and so this process was relatively simple since we designed the database ahead of time, so we really already did the ahrd work, were just writing the commands now

### UUID Extension and Making the Table

- we want to add teh UUID extension to use the uuid_generate_v4() function in our SQL code, and with postgres we do that in the actual database app itself in the command line 
- we download extensions in a similar manner to npm or pip, with different syntax
- here in postgres we run: `CREATE EXTENSION IF NOT EXISTS "extension_name";`, where "extension_name" is the name fo the extension of course, the IF NOT EXISTS part makes sure we only download the extension if we do not have it already
- so the name of the extension we want is `uuid-ossp` so we run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` and the only return we get back is `CREATE EXTENSION` but that seems to mean it worked
- so now we can actually run the create table code for the users table:
```
CREATE TABLE users(
    user_id UUID DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    PRIMARY KEY(user_id)
);

CREATE TABLE todos(
    todo_id SERIAL,
    todo_order SERIAL,
    user_id UUID,
    description VARCHAR(255) NOT NULL,
    PRIMARY KEY (todo_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```
- **note** I added an extra todo_order column that may be helpful if I want to have the user rearrange the ToDos later
- the return we get back from each of these is just `CREATE TABLE`
we can see the columns for the tables we created with the `SELECT * FROM todos;` commands for example, and we can make sure both tables exist with `\dt` which displays tables
- we can see more info on the type of constraints we created with the `\d+ users` command for example, which opens some `+` extra display
- when we do this for users we can see teh data types of each columns, and see the NOT NULL constraints, the uuid_genetate function for the user_id, and more
- we also see a `referenced by` section, where we see the todos table is referencing the user_id column
- we also see if we try to delete the users table with `drop table users;` we get an error that we cannot do that since the todos table depends on users, so we would have to delete todos first then users
    - we dont want to do this of course but good to see the functionality

#### Quick Example Data

- we can try adding a user here and stuff like that to our database as an example we can do `insert into users (user_name, user_email, user_password) VALUES ('chris', 'chris@gmail.com', 'chris1234');` and `insert into users (user_name, user_email, user_password) VALUES ('sara', 'sara@gmail.com', 'sara1234');`
- and now when we select all users we can seethe new user data in there and they both have unique UUIDs as user_id's of `d2771a95-f2b0-472c-bc43-696b80c466ba` and `981480d3-6ef0-44a7-a655-445bec196356` , wich certainly seems unique enough to me
- so its cool to see the added uuid_generate_v4 function works
- we can then add a couple todos for the 'chris' user with `insert into todos (user_id, description) VALUES ('d2771a95-f2b0-472c-bc43-696b80c466ba', 'chris todo');` and `insert into todos (user_id, description) VALUES ('d2771a95-f2b0-472c-bc43-696b80c466ba', 'test this todo');`, and then we can test our join functions:
    - **note, here is used `\x` first to enable a more detailed display mode, which shows the results in the `RECORD` format that shows all data columns detailed**
    - first we can test inner join with `select * from users INNER JOIN todos ON users.user_id = todos.user_id;` and we reievce back:
    ```
    -[ RECORD 1 ]-+-------------------------------------
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    user_name     | chris
    user_email    | chris@gmail.com
    user_password | chris1234
    todo_id       | 1
    todo_order    | 1
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    description   | test this todo
    -[ RECORD 2 ]-+-------------------------------------
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    user_name     | chris
    user_email    | chris@gmail.com
    user_password | chris1234
    todo_id       | 2
    todo_order    | 2
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    description   | chris todo
    ```
    - so we see with the inner join, only pairs were returned
    - now we can test the left join with `select * from users LEFT JOIN todos ON users.user_id = todos.user_id;`, and we get:
    ```
    -[ RECORD 1 ]-+-------------------------------------
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    user_name     | chris
    user_email    | chris@gmail.com
    user_password | chris1234
    todo_id       | 1
    todo_order    | 1
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    description   | test this todo
    -[ RECORD 2 ]-+-------------------------------------
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    user_name     | chris
    user_email    | chris@gmail.com
    user_password | chris1234
    todo_id       | 2
    todo_order    | 2
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    description   | chris todo
    -[ RECORD 3 ]-+-------------------------------------
    user_id       | 981480d3-6ef0-44a7-a655-445bec196356
    user_name     | sara
    user_email    | sara@gmail.com
    user_password | sara1234
    todo_id       | 
    todo_order    | 
    user_id       | 
    description   | 
    ```
    - so here, just liek we described in the theory, we get the sara user returned even though she has no todo to couple with
    - now with this we can test the right join functionality with `select * from users RIGHT JOIN todos ON users.user_id = todos.user_id;`, and we get back:
    ```
    -[ RECORD 1 ]-+-------------------------------------
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    user_name     | chris
    user_email    | chris@gmail.com
    user_password | chris1234
    todo_id       | 1
    todo_order    | 1
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    description   | test this todo
    -[ RECORD 2 ]-+-------------------------------------
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    user_name     | chris
    user_email    | chris@gmail.com
    user_password | chris1234
    todo_id       | 2
    todo_order    | 2
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    description   | chris todo
    ```
    - so we see that this is equivalent to the inner join for us, since we cannot have a todo that is not paired with a user, since that is how we built our database, so right join will always be inner join
    - lastly, we can do FULL OUTER JOIN with `select * from users FULL OUTER JOIN todos ON users.user_id = todos.user_id;`, and we get:
    ```
    -[ RECORD 1 ]-+-------------------------------------
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    user_name     | chris
    user_email    | chris@gmail.com
    user_password | chris1234
    todo_id       | 1
    todo_order    | 1
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    description   | test this todo
    -[ RECORD 2 ]-+-------------------------------------
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    user_name     | chris
    user_email    | chris@gmail.com
    user_password | chris1234
    todo_id       | 2
    todo_order    | 2
    user_id       | d2771a95-f2b0-472c-bc43-696b80c466ba
    description   | chris todo
    -[ RECORD 3 ]-+-------------------------------------
    user_id       | 981480d3-6ef0-44a7-a655-445bec196356
    user_name     | sara
    user_email    | sara@gmail.com
    user_password | sara1234
    todo_id       | 
    todo_order    | 
    user_id       | 
    description   |
    ```
    - and here we see it is the same as the LEFT JOIN, since again, we will never see additional todos, since every todo is coupled with a user, so the full outer join is equivalent to a left join
    - now lastly, and we will only do one example, we can filter these results to show only the user we want, which shows more of a difference when we have more users, but here I can do a left join, but filter it only to show the `sara` user with `select * from users LEFT JOIN todos ON users.user_id = todos.user_id WHERE users.user_id = '981480d3-6ef0-44a7-a655-445bec196356';`, and we get:
    ```
    -[ RECORD 1 ]-+-------------------------------------
    user_id       | 981480d3-6ef0-44a7-a655-445bec196356
    user_name     | sara
    user_email    | sara@gmail.com
    user_password | sara1234
    todo_id       | 
    todo_order    | 
    user_id       | 
    description   | 
    ```

# Setting Up Our Server & DataBase Code

- okay so we are just getting back from an aside here where we learned about structuring our databases when we want to have both log in functionality and a ToDo list functionality, we did this from a video where he combines login and the Todo app here:
    - Part 1: https://www.youtube.com/watch?v=l3njf_tU8us
    - Part 2: https://www.youtube.com/watch?v=25kouonvUbg&list=TLPQMDcwNzIwMjMu1MU2D6T5JQ&index=2
- so I will be referencing my notes from those two videos, which are also availible in the 'DataBaseDesign.md' file
- so in the video he is making a fresh server and the app is just going to be a login app basically, I am going to try to mimic what he is doing but making a login for the ToDo app that we made above
- we have set up the base of the code we need for the server.js and db.js files already int eh first implementation, and now we will add the things we need to add proper JWT log in and the new database system
- the first thing we want to do is to change the database in our db.js file that has all of our database config in it, since we now want to use the new database
    - so for me that is changeing the `database: "fluetodo"` property in the `Pool`object to `database: "todoapp"`
- next we need to do is install the `jsonwebtoken` and `bcrypt` modules to our backend server with `npm i jsonwebtoken bcrypt`
- `jsonwebtoken` is the module we use to generate and verify json web tokens, as we may expect, and `bcrypt` is a way for us to encrypt our passwords so we have a way to encrypt the passwords we put in our database so they are not plain text in there
- okay so we are also going to restructure the project a bit right now, since it looks liek the project he makes is structured different when we have more components, but most of the actual code for the todo functionality will not change which is nice
- one of the reasons we are doing this is because we want to be able to use a "router", which is what we use to determine how the application responds to different requests, it decides how to handle requests of different endpoints so that we use the rigth functions for the right requests 
- to do this we are going to make a "routes" directory in our server folder to hold all of the different routes we can get requests to, this is a way of grouping different routes together that handle similar functions
- in the main "server.js" file that used to handle all different incoming requests, like for example `app.get("/login"...)`, we will now have use the `app.use()` function to define a middleware that gets called when a secific route is hit, for example we will group login/registration/verification under a single "/auth" route, so in server.js we will have: `app.use("/auth", require("./routes/loginReg"));`, so we are saying when the client sends a request to "/auth/login" we come here first and see for all "/auth" requests we want to go through the imported file "loginReg", then only in loginReg will we define what happens to the request when it hits a "/login" Endpoint

## Building Registration Route 

- so within the "routes" folder we want to make a file that will deal with the logic for checking the login/register credentials, and deal with generating our JWT tokens (which we have not exlained yet), will just name the file 'loginReg.js'
- inside this file we want to import the use of the express `Router()` method, as well as the database query function that we previously used in all of our "server.js" api calls so we can use that here as well, lastly we want to make a basic export statement:
```
const router = require("express").Router();
const db = require("../db") 

module.exports = router;
```
- from here we can go into our main `server.js` file and add the following route:
```
app.use("/auth", require("./routes/loginReg"))
```
- so what this is telling us is that when we get a request to the `/auth` URI we want the request to get directed to the `loginReg.js` 
- inside the loginReg file we now want to build out the basic functionality for registering logging in, this will not have anything to do with JWT tokens and proper authorization yet, but we want the basic functionality to be there first
- we can start by checking the database functionality for getting user data, since when we either register or log in we are going to want to make sure we can properly return user data and make sure we can do something if the user already exists and stuff


### Building Register SubRoute

- so to start we can add a register route, and we can outline inside the route how we want the functionality of it to work
- we start by knowing when a user logs in or registers the username/email/password combos will be sent to us by the front end as the body of the request
- from there we want to:
    1. destructure the req.body to get info
    2. check if user exists
    3. Bcrypt the user password
    4. Enter the user into database
    5. generate the JWT token

#### Recieve User Info and Check if Already Exists
 
- we will start with just #1/#2:
```
router.post("/register", async (req, res) => {
    try {
        // 1. destructure req.body to get name email password
        const {name, email, password} = req.body;

        // 2. check if user exists (if )
        const user = await db.query(
            "SELECT * FROM users WHERE user_email=$1;",
            [email]
        )
        res.json(user.rows)

        // 3. Bcrypt the user password

        // 4. Enter the user into database

        // 5. generate the JWT token

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error")
    }
})
```
- so here we make our catch clause send back a server error, wwith code 500 specifically which is nicer handling than we did before
- in the actual logic we want to destructure the body info, and then send a request to the server to get all of te user data with amtching emails, so that we can test to see if teh user already exists
- in postman we can test this by sending a test POST request to "http://localhost:5000/auth/register", so here the route in the file is just "register" but the route we actually send to is "/auth/register", since this file is ecapsulated as "/auth", since that is how we set it up in the server.js file
- we also add a body in post man of :
```
{
    "name": "chris",
    "email": "sara@gmail.com",
    "password": "password"
}
```
- and we see we get a repsponse of:
```
[
    {
        "user_id": "981480d3-6ef0-44a7-a655-445bec196356",
        "user_name": "sara",
        "user_email": "sara@gmail.com",
        "user_password": "sara1234"
    }
]
```
- so it returned the data for the email given!, so now we can easily add logic to say NO since this user exists already
- what we want out of this section is that if the database returns any users, we want to deny the request and say the user already esists, so taht would be if `users.rows.length !== 0`
- so we add a little conditional block:
```
// 2. check if user exists (if )
const user = await db.query(
    "SELECT * FROM users WHERE user_email=$1;",
    [email]
);
if (user.rows.length !== 0) {
    return res.status(401).send("User Already Exists")
}
```
- which now will send a error code of 401 and the message user already exists to the client, we can test it in postman with the same credentials and it works again!
- error 401 stands for unauthorized, which is different than 403 forbidden, and in general this seems to be a matter of debate online on what error code is best for account creations fails, some people say 409 is better
- now tht we have confirmed the user does not exist, we can deal with how we want to store the data

#### BCrypt the Password and Store the Data

- we want to use bcrypt to hash the password before storing it, this invovles adding random strings to the font and end of a password, then encrypting that final string with a hash function:
```
// 3. Bcrypt the user password
const saltRound = 10;
const salt = await bcrypt.genSalt(saltRounds);
const bcryptPassword = await bcrypt.hash(password, salt);
```
- so the `saltRounds` is the number of times we want to go through the salting cycle, we define that then make a "salt" with the `bcrypt.genSalt()` function, lastly we get our final password we are going to store with the `bcrypt.hash()` method that we pass both the password and the salt into
- now we finally want to add this new user to our database:
```
// 4. Enter the user into database
const newUser = await db.query(
    "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, bcryptPassword]
);
```
- here we are simply entering the new user data as a entry into `users`, and we do this using the `$1` notation that we always use with SQL/postrges, also notice we are giving postgres the `bcryptpassword` and not the regular password 
- if we then make our response `res.json(newUser.rows[0])`, and send a request with new userinfo with postman, we can see the response:
```
{
    "user_id": "173abd54-91eb-4ec8-a0a8-b7b15d453e36",
    "user_name": "link",
    "user_email": "link@gmail.com",
    "user_password": "$2b$10$YLm1H9S59DRl3cIfPDBO1e1dAA52Ws9HrsHx6sfECW5rjJl7jbMNO"
}
```
- and we see the password is completely unrecognizable ("triforce1" was the given password)
- our last step is create a Json Web Token to give back to the client to use for the login session

### Create JWT Generator

- in order to make proper JWTs, we are going to want to also install the the 'dotenv' package with npm on our server, this is what allows us to use the secret keys we keep in the environment variables file: ".env" (.env/dotenv, get it?)
- so with this installed we will create a new '.env' file in the server folder, and define some secret key there, in this case my entire .env file is just `jwtSecret = 'secret'`
- we now want to create a new 'jwtGenerator.js' file, and we will make a new utilities folder for this, which is where we will keep our small files that just do a single thing, a specific function, like in this case making a quick JWT
- so this is where we call the functions for tunring our info that we want to send back to the client into an actual json web token, the code for this is relatively simple:
```
const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id) {
    const payload = {
        user: {
            id: user_id
        }
    };
    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"});
};

module.exports = jwtGenerator;
```
- we simply need to import the jwt package, and the dotenv package, which allows us to use the secret key without explicitly importing the file, perhaps this is not trivial since we want to keep the enviromnment variables a hidden file 
- we then define the jwt generator function that only takes a user_id, we will see that this is the user_id of the user that just got created in the loginReg.js file
- we then create a payload, rememebring that the JWT consists of a header, payload, and signature, and our payload here will just be an object consisting of the user_id
    - **NOTE ON OUR PAYLOAD**, as mentioned above, the payload is the part of teh JWT token that we define, we can check this out after by console.logging the payload, and we see for a given user we get:
    ```
    {
        user: { id: 'b82b3509-93f4-4f89-bd91-79f94132d579' },  
        iat: 1689185340,
        exp: 1689188940
    }
    ```
    - and we see the whole payload object, 
    - so the first property of the payload is what we just defined should go in it, the the `user` object with an `id` property, and then we have these weird `iat` and `exp` properties in the payload object
    - `iat` stands for "issued at time", while `exp` is the time of expirey, and these times are in seconds since the initialization of unix, some date in 1970
    - so this is just to keep track of if the token is expired or not
- we then jus return the call to `jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"});` which creates the signature and resulting token for us
- back in the loginReg file we can then simply need to import the jwtGenerator at the start of the file with `const jwtGenerator = require("../utils/jwtGenerator");` and then call this function in the #5 generate JWT section
```
 // 5. generate the JWT token
const token = jwtGenerator(newUser.rows[0].user_id);

res.json({token})
```
- so we create the token with the newly craeted user_id, and then make hat token our response,
- we can test this again in postman and we see we get a crzy JWT token as our response:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYTllYTBiZGItOTA5Ny00MDAyLWJiOTctMTBjMzU0NDEzNmVjIn0sImlhdCI6MTY4OTAyNzI5MiwiZXhwIjoxNjg5MDMwODkyfQ.GDLfyet7ZQUQW1XaoxNgL9i1jQRRHIxIZ66dnivfDMs"
}
```
- so it worked!
- we will leave this here for now and clean it up later when we build the rest, but first we want to do the same thing for the login route


### Build Login SubRoute

- the login route is going to be very similiar to register since in both cases we are recieving names, emails, and passwords
- we can again break the process down into steps:
    - deconstructing the request
    - checking if the user actually exists by the email
    - checking if the passwords are a match 
    - giving them a JWT token
- we also of course have to define the new login route, which is simple enough:
```
router.post("/login", async (req, res) => {
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
            return res.status(401).send("Incorrect Email Or Password")
        }

        // 4. Give them a JWT Token
        const token = jwtGenerator(user.rows[0].user_id)
        res.json(token)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error")
    }
})
```
- so above we only deconstruct the email and password, since that is all we need this time, the username doesnt actually have anything to do with authentication
- then we search for the user_mail again wiht a db query, and this time we want to check that there is at least 1 result, if there is not and the length of the db response is 0, we will give the error this time,
- if there is a result, we will then check to see if the passwods are a match using the `bcrypt` tool, here we use the `bcrypt.compare()` function that takes the given password, and the hashed password from the database, I suppose it is able to tell what the oriignal salt and hashing funciton used was and see if the given password recieves the same output
- so we can test what we have so far with postman again, and we see if we enter a fake email and fake password, we get the expected responses, we can also `console.log(validPassword)` the result from the bcrypt compare function to see if we get the `true` result when it is working as well, and it does
- if the login credentials passes all these tests, we finally make a JWT token as we did before, and make that our response
- and again we see that if given correct credentials, this works

## Creating Middleware

- okay so now that we have given the user a JWToken on login, we are going to want the user to send us that token eevrytime they try to do anything with the app on the actual dashboard, or actual bulk of the app, that way since we gave them the token, we know it is them who is trying to make the changes, so this will be like a token that is valid for the extent of their login session (a session token, if you will)
- but this means for all subsequent requests after logging in, we will want to have some middleware that validates the token before it gets routed to our add todos, or edit todos routes, for example
- we do this with validator middleware files, these files will have express routes that take incoming requests before they get to our routes, validate them for the token any other stuff, then they call a `next()` method that sends the request to the next peice of middleware in line, or to the final route 
- so we are going to make a middleware that authorizes the JWT token sent fromt he client, and a middleware that validates user info when trying to login/register, these will be called 'authorization.js' and 'validInfo.js' respectively and be in the "middleware" directory that is within "server"

### JWT Authorization Middleware

- we are making the "authorization" file first, but we are not actually going to implement it yet since we do not have the client giving us any tokens yet
- this is actually pretty simple, we already have the tokens being created and given to the client on login and on register, we just need a function to check whther those the token the client is giving back is the same one we gave to them
- for this we are going to need to import the "jwt" module, and also the "dotenv" module to access our secret keys
- after that, we just amke a simple function that gets the JWT from the header of the incoming request, and then uses the built in "jwt" module method "verify" to verify it is correct:
```
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async(req, res, next) => {
    console.log("authorization middleware");
    try {
        // grab token from request header
        const jwtToken = req.header("token");

        // check if there is no token given
        if (!jwtToken) {
            return res.status(403).json("Not Authorized");
        }

        // use jwt to verify the token with the secret key, returns the payload of the given JWT token
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        req.user = payload.user;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(403).json("Not Authorized")
    }
}
```
- we see here that the `verify` method returns the payload of the JWT token if verification is successful, so here we set that to be equal to the payload, then we are ammending the incoming request object to add a `user` property that is equal to the the `user` property of the payload, which we can recall we just set above when we created the token with jwtGenerator to be:
```
{
  user: { id: 'b82b3509-93f4-4f89-bd91-79f94132d579' },  
  iat: 1689185340,
  exp: 1689188940
}
```
- **SO now the user id has been added to teh request, and our function that will use this middleware have access to this user id!**
- of course we also have other things built in like the check for if the token is even in the header, and the try/catch block, but it is still relatively simple
- for now we are not oging to implement this into any of the routes, but shortly we are going to use this to verify the JWT tokens before the request gets sent to a different route

### Validate Info Middleware

- now we will work on the "validInfo" file, which is also quite simple
- we simply want to take in the incoming login/register request before it gets to the actual "/login" or "/register" route, and check to see if the email/username/password inf is correct
```
module.exports = (req, res, next) => {
    console.log("vaidate info middleware");
    const { name, email, password } = req.body;

    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if (req.path === "/register") {
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

    next();
};
```
- we do this by first defining a function that checks if the email is a valid email address, now I am not too sure how it does this at the moment, but it seems we are using a "regular expression" object, which is enclosed by `//`, and has a number of escape keys in it such as `\w` or `\.`, but either way this makes sure we have an `@` symbol for example, or that we dont have unallowed characters like `&` or `$`, and have a `.` for `.com`
    - we run the `test()` method on this expression though, which looks for a match between the crazy regular expression and the `userEmail` string, so that wild regula rxpression defines the amtching condition that looks like a typical email apparently
- we then chck the path for register or login, and in each we see if the body actually contained an email, name, and passwrod with the `if (![email, name, password].every(Boolean))` line
    - the `Array.every(function)` method tests all elements of an array to see if they return a True value when given to the provided function, and the overall `.every()` only returns True if all elements pass
    - here we give the simple Boolean function, which just puts all elements into Boolena form, so it will return false if there is an empty string for any of the name/email/passwrod, and thus `every()` will be false
- after we confirm all elements are there we check is the email is valid with the defined email validatorr function we discussed 
- the login check is the same thing except we do not check for the name since we do not require giving a name to login, only to register
- if all checks pass we call the `next()` method that sends the request tot eh next route in line, which will be the "/login" and "/register" routes
- to implement this now go into the "loginReg.js" file, which is where we deal with the actual "/login" and "/register" routes, and we are able to add a middleware stack in the route handlers, for exampe, we add `validInfo` to as the middleware for the register POST request below:
```
// -- loginReg.js File -- //
const validInfo = require ("../middleware/validInfo")
...
...
// registering
router.post("/register", validInfo, async (req, res) => {
    console.log("register endpoint");
    try {
        ...
        ...
```
- so how the routing works is that requests to "/register" get sent here in the loginReg.js file, then when they hit this handler, beofre the callback function is called, the request goes to `validInfo` first, then when `next()` is called within `validInfo`, the request comes to the next middleware inline, which is now this callback function since we have defined no other middlewares here
- we can see that we could define multiple middlewares in a list here for the request to go through before it hits our callback, we could have `middlewares = [mw1, mw2, mw3]` with each `mw#` being a defined middleware function, then we could call `router.post("/route, middlewares, async (req, res) => {...`, so we can create long chains of handling the request before it reaches the endpoint
- neat
- **note,** we do this for the login route as well: `router.post("/login", validInfo, async (req, res) => {`
- so what this is doing for us on the broad scale is when the request for registering/logging in comes in, we direct it to validInfo first to verify that the info is even valid before we start making database calls and messing with it, that way we dont waste our time with the db when we do not need to, 

## Adding Private Routes

- Private routes are going to be routes that the user has to be logged in in order to access, so we are going to want to build a route on our backend that verifies if the user is logged in before they can access their todo list for example
- so the main page from react is going to make a request to our backend to set the authenticated state to either true or false

### Verify Authorization SubRoute

- so we are going to implement a third route in the loginReg file whose job is just to verify that we are authorized, after we are logged in/registered
- to do this we are finally going to use the "authorization.js" file that we made earlier:
```
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async(req, res, next) => {
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
        // console.log("user payload:");
        // console.log(payload.user);
        req.user = payload.user;
    } catch (error) {
        // console.log("Auth Error:");
        console.error(error.message);
        return res.status(403).json("Authoization: Not Authorized")
    }
    console.log("authorization: end of function");
    next();
}
```
- so again this middleware is simply going to check if we have a JWT token, and if so try and verify it using the `jwt` modules built in verify method, if all is good we then we call `next()` to send this to the next step in the cahin, however we do not have any route calling this middlewar yet
- so now we want to make a route for log in verification, when a user opens the webpage, we want to be able to verify them if they still have a valid token, or if they simply refresh the page or move to a different page, we want to verify their token to ensure they are the same user
- so to do this we will make a very simple "/verify" route for the client to send these checks to, and this route will use "authorization.js" as its middleware:
```
// -- loginReg.js File -- //
const authorization = require("../middleware/authorization");
...
...
router.get("/verify", authorization, async (req, res) => {
    try {
        console.log("Verify Endpoint");
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error")
    }
})
```
- so when the client sends a GET fetch request to "/verify", first the authorization middleware gets called and if the JWT token is invalid it returns a "Not Authorized" status (as we see in theauthorization.js file), and if the token is valid then `next()` is eventually run and the request gets sent to the callback here instead, and so here in this callback all we want to do is send the response `res.json(true);`
- we are only sending back `true` since we know if the request made it to the callback then it is verified, since it got through "authorization.js", so we let teh client set the authorized state to `true`
- **also note** we added the `user` part of the JWT payload to the `req` in the authorization function, but we do not use it here in "/verify" since we just want to verify the toekn is a match, we will use the `req.user` property later in the dashboard route

### Dashboard Route

- so now we want to build the dashboard route, this is where we are actually going to load the user info to the page
- this is a private route because the user cannot access this unless we have confirmed that they are verified with the JWT verification/authorzation process
- for this we are going to define a new middleware class in the "server.js" file, we will do it in the same way we did for the "/auth"/loginReg route:
```
// dashboard route
app.use("/dashboard", require("./routes/dashboard"));
```
- so the above was added to server.js, so now when the client sends a request to "/dashboard" we deal with it with the dashboard.js file
- now we can make the start of the dashboard.js file, we wil create it in the routes folder, and for this we just want to extract all of teh user data after the user logs in to build to the dashboard that displays the user data, so we will want to make a simple GET request
```
const router = require("express").Router();
const authorization = require("../middleware/authorization"); 
const db = require("../db");

router.get("/", authorization, async (req, res) => {
    try {
        // console.log("dashboard/ route");
        res.json(req.user.id);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Dashboard: Server Error");
    }
});

module.exports = router;
```
- so we import the `router` package since we are using this as a seperated route, and we also are going to use the `authorization` utility since we want to make sure the user is authorized before we fetch their data, and of course we need `db` to access teh database
- we have a simpel GET request here, with a defined `authorization` middleware, and to test it right now all we want to do is send back a response of `res.json(req.user.id);`
- so we can test this in postman, and we can track how this `req.user` object came to be here
    1. postman (or the client) sends a `login` request to the "auth/login" route with the user info like:
    ```
    {
        "email": "zelda2@gmail.com",
        "password": "zelda2"
    }
    ```
    2. the request gets sent to server.js since this is the homebase of our express server so to speak, and `app.use("/auth", require("./routes/loginReg"));` nibbles up this tasty request since its first route is "/auth" and lets the `"./routes/loginReg"` middware deal with it
    3. inside login.js, this request gets picked up by `router.post("/login", validInfo, async (req, res) => {` since it was to "/auth/login", and this handler sends it over to the `validInfo` middleware before deaing with it
    4. inside `validInfo` we simpyl make sure all the info we want is included, and that the email address is valid, if so then we call `next();` to send it to the next middleware inline, which is none, so it gets sent to the "/login" handler callback
    4. in the "/login" callback we extract the `"email"` and `"password"` properties from the intial request sent by postman (or the client), and use these to grad the user info **including user_id** from the database and confirm the password with bcrypt, then if eveything is good we call `jwtGenerator` and give it the user_id we just extracted from the database with the line `const token = jwtGenerator(user.rows[0].user_id)` to make a JWT token
    5. inside `jwtGenerator`, we set the payload of the JWT to `{ user: {id: user_id} }` giving it the `user_id` that was extracted from the database and given to `jwtGenerator`, we then create and sign the toekn with `jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"})` which uses the apyload we just set, the secret from our hidden enviornment variables, and the expiration time to make a signed token, the payload of which ends up looking like:
        ```
        {
            user: { id: 'b82b3509-93f4-4f89-bd91-79f94132d579' },  
            iat: 1689185340,
            exp: 1689188940
        }
        ```
        - and the base64 token itself looks somehing like: 
        ```
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYjgyYjM1MDktOTNmNC00Zjg5LWJkOTEtNzlmOTQxMzJkNTc5In0sImlhdCI6MTY4OTE4NTM0MCwiZXhwIjoxNjg5MTg4OTQwfQ.r462uqbG5UfntqwxoRc6n8ucnKRWBEUzdRE5nIErv6A
        ```
    6. fianlly the "/login" handler inside "loginReg.js" sends back this token to the client (or postman) with `res.json(token)`
    7. now we can send a request to load our user data since we are logged in, and we do this by sending a GET request in postman (or behind the scences in our client) to "dashboard" with a header of 
    ```
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYjgyYjM1MDktOTNmNC00Zjg5LWJkOTEtNzlmOTQxMzJkNTc5In0sImlhdCI6MTY4OTE4NTM0MCwiZXhwIjoxNjg5MTg4OTQwfQ.r462uqbG5UfntqwxoRc6n8ucnKRWBEUzdRE5nIErv6A`
    ```
    8. once again, this request gets sent to server.js first, and this time this nasty little morsel is gobbled up by `app.use("/dashboard", require("./routes/dashboard"));`, which sends the request straight over to the middleware `"./routes/dashboard"`
    9. inside dashboard.js, we only have a single route, a "/" GET, and since the route from postman was just "/dashboard" and was also a GET request, this picks it up: `router.get("/", authorization, async (req, res) => {`, this handler sends the request first to the defined `authorization` middleware to make sure we have the right credentials
    10. inside authorization.js, we first grab the `token` that postman (or client) set in the header with `const jwtToken = req.header("token")`, and make sure it actually exists with a quick check, 
        - then we use the built in `jwt.verify()` method of the `jwt` package to verify that the JWT token is valid: `const payload = jwt.verify(jwtToken, process.env.jwtSecret)`, this `jwt.verify()` method will return the decoded payload of the JWT, 
        - recall in step (5.) that the payload of the JWT includes the `user` object: `{ user: {id: user_id} }` along with expiration/creation times, 
        - therefore in the next line we do: `req.user = payload.user;`, creating a `user` property in the request object that is equal to `payload.user`, thus adding the `user_id` of the user trying to see their dashboard to the `req` object
        - now finally we call `next()`, sending this request to the callback function of the `router.get("/", ... ...` in dashboard.js
    11. inside the callback, we now have access to he verified users `user_id` through `req.user.id` and we send this back to postman in a response, and in postman we get `"b82b3509-93f4-4f89-bd91-79f94132d579"`, the correct `user_id`!!!
- so now what we want to do is instead of just sending back the `user_id`, we want to use that `user_id` to make a postgres query to get all the user info, including that users todos with the database we made in the relational database part of this tutorial
- **so below we deviate from the JWT tutorial video, and start encompassing bits from the JWT/PERN-Todo combined video**
- so to make our backend send back the actaul useful user info, we want to make a database query with our db module that we made/imorted:
```
router.get("/", authorization, async (req, res) => {
    try {
        console.log("dashboard: route");
        // console.log(req.user.id);
        const user_data = await db.query(
            "SELECT u.user_name, t.todo_id, t.description FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE u.user_id=$1",
            [req.user.id]
        )
        // console.log(user_data.rows);
        res.json(user_data.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Dashboard: Server Error");
    }
});
```
- so here instead of just sending back `req.user.id`, we make a database query with `const user_data = await db.query()`, and we make our query `"SELECT u.user_name, t.todo_id, t.description FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE u.user_id=$1"`, which is alot but we will go over it
    - the basis of this query is just the regular LEFT JOIN query that we learned when going over relational databases, we can simplyfy this query as the typical `"SELECT * FROM users LEFT JOIN todos ON users.user_id = todos.user_id;"`, which is alot more familiar, where we are getting all the info (*) from rows in the `users` table, and combining those that have todos with matching `user_id`'s to make a number of records, and since it is a LEFT JOIN we make all teh combinations of user/todo with amtching records, and also return all users that do not have todos
    - the first new thing we are going to do is just introduce an alias for the reference of `users` and `todos` of `u` and `t` respectively since we state the table names alot in this query, we do this with the `users as u` and `todos as t` clauses in the first instance where we refence the tables directly, so now in the rest of the query we can just use `u` and `t`, this would change our simple starting query to `"SELECT * FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id;"`
    - now we want to filter those resutls down with a WHERE clause, which we are also familiar with, by saying `WHERE u.user_id=$1`, and of course `$1` stands for the reference we pass into the array, the user_id we want to get data for, so now our query is `"SELECT * FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE u.user_id=$1` which completes the task of getting all the data from the proper combo matches we want
    - the last part is to not grab all data **otherwise we would be giving the passwords of the users to the client**, so we want to change the `*` to just be the data we want, in this case we want the user_name, the todo descriptions, and the todo ids, so we replace `*` with `u.user_name, t.todo_id, t.description`, and now we arrive at our final query: `"SELECT u.user_name, t.todo_id, t.description FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE u.user_id=$1"`
- so to reiterate **IT IS VERY IMPORTANT WE SELECT ONLY THE DATA WE NEED TO SHOW THE USER, OTHERWISE WE GIVE THE USER PASSWORD TO THE CLIENT**
- so the user/todo data should now be set as user_data, and we can send this response back to postman, or the client, with `res.json(user_data.rows);`
- and as we expect, in postman we can try this with a logged in user, and get the respnse:
```
[
    {
        "user_name": "zelda2",
        "todo_id": 4,
        "description": "zelda todo"
    },
    {
        "user_name": "zelda2",
        "todo_id": 5,
        "description": "slay gannon ;)))))"
    },
    {
        "user_name": "zelda2",
        "todo_id": 6,
        "description": "get saved buy link"
    },
    {
        "user_name": "zelda2",
        "todo_id": 7,
        "description": "buy a gallon of PCP"
    }
]
```
- so a list of each of the todo combos from the user we filtered by with `user_id`!!!!
- perfecto

## Adding / Modifying Our Todo Route Handlers to the Dashboard Route

- okay so now we want to add the functionality to do all the things with the todo list that we wanted to do previously, like add a todo, edit a todo, get all todos, delete a todo, etc
- now we already have all this functionality from the first iteration of the app, we just need to modify it a bit since we will now be referencing todos to our database with user_id as well, since we need to only be modifying our own todos, also we want to add authorization middleware to each of these handlers to ensure the person modifying them is still loged in and stuff
- we are going to add these to the dashboard parent route, since the dashboard is  where we are loading all of the user info, and now we want to display their list to them here

### Create a Todo

- the original create a Todo handler is in the server.js file and looks like:
```
app.post("/todos", async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await db.query(
            "INSERT INTO todo(description) VALUES($1) RETURNING *", 
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})
```
- the main reason we cant just use this exact method as is is because we need to now be able to specify the `user_id` of the todo being created, since now all todos need to have a foreign key `user_id`
- so in the new handler, that we will put inside dashboard.js, will first be called with the `router.post()` syntax since we are using `router` to route the request to here from server, and will need to also call the `authorization` middleware to verify the user and also add the `user_id` to the request body as `req.user.id` as it did in the "/" dashboard route above:
```
router.post("/todos", authorization, async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await db.query(
            "INSERT INTO todos(user_id, description) VALUES($1, $2) RETURNING todos.todo_id, todos.description", 
            [req.user.id, description]
        );
        res.json(newTodo.rows[0]);
    } catch (error) {
        console.error(error.message); 
    }
})
```
- so here we see teh `router` and `authorization` changes, and besides that we also see the query has changed
- we now specify both `(user_id, description)` instead of just `(description)` as the insert variables, and we also only reutrn the `todos.todo_id, todos.description` instead of `*`, which is less important here than in the above GET all route since there is no password info here, but it is good to return only the info we need 
- besides that it is pretty much the same, so the implementation is relatively simple!
- all of the next routes are also going to use the `router` class, and also will call the `authorization` middleware, so we wont go over that everytime, we will only go over the major changes

### Update a Todo

- original update code:
```
app.put("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updateTodo = await db.query(
            "UPDATE todo SET description=$2 WHERE todo_id=$1 RETURNING *",
            [id, description]
        );
        res.json(updateTodo.rows[0])
    } catch (err) {
        console.error(err.message);
    }
})
```
- once again here we need to be able to only be allowed to update our own todos, so we need to specify the `user_id` in the query, or else you could easily find a way to change other peoples todos
- we do this in the new code with:
```
router.put("/todos/:todo_id", authorization, async(req, res) => {
    try {
        const { todo_id } = req.params;
        const { description } = req.body;

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
```
- so there are some minor changes like we turned `id` into `todo_id`, but the main major changes come in the query where we now use the WHERE clause to search for `WHERE (user_id=$1 AND todo_id=$2)` so we only retrun todos that match the `user_id` from the JWT token AND the `todo_id` from the URL param
- this is important since the user cannot control the JWT token, so they can not just send us a different `user_id` with a fake URL if they wanted, they dont have control over the `user_id` so it restricts them to their own stuff
- the other major change is the addition of the check for if the returned database query has no rows, which happens either if the `todo_id` has not been created, or if the `todo_id` that was sent does not belong to the given `user_id`, so we send a reply of "this todo is not yours", 
    - this cehck isnt neccisarily needed since the database query itself will prevent anything being accessed that shouldn be accessed, but it is good to have a reply if something went wrong and nothing showed up

### Delete a Todo

- old code:
```
app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const deleteTodo = await db.query(
            "DELETE from todo WHERE todo_id=$1 RETURNING *",
            [id]
        );
        res.json(deleteTodo.rows[0])
    } catch (err) {
        console.error(err.message);
    }
})
```
- once again, the same issue where we dont want peopel to delete other peoples todos:
```
router.delete("/todos/:todo_id", authorization, async(req, res) => {
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
```
- the fix here is exactly the same, we use the WHERE clause of `WHERE (user_id=$1 AND todo_id=$2)` to make sure the todo is only returned if it belongs to the right user, and we also add in the check afterward again to send the "not your todo" response

### Bonus: Search Todos

- so this never made it into production on the client side, but I want to implement it here, old search todos code:
```
app.get("/todos/search/:search", async(req, res) => {
    try {
        const { search } = req.params
        const allTodos = await db.query(
            "SELECT * FROM todo WHERE description LIKE ('%' || $1 || '%') ORDER BY todo_id asc",
            [search]
        );
        res.json(allTodos.rows)
    } catch (err) {
        console.error(err.message);
    }
})
```
- once again, this will return all todos that fit the search, not just the users, need to fix:
```
router.get("/todos/search/:search", authorization, async(req, res) => {
    try {
        const { search } = req.params
        const allTodos = await db.query(
            "SELECT * FROM todos WHERE (user_id=$1 AND (description LIKE ('%' || $2 || '%'))) ORDER BY todo_id asc",
            [req.user.id, search]
        );
        res.json(allTodos.rows)
    } catch (error) {
        console.error(error.message);
    }
})
```
- so now we have a complex query with a WHERE clause of `WHERE (user_id=$1 AND (description LIKE ('%' || $2 || '%')))`, so we need the description LIKE to match, and the `user_id` to match for it to be reutrned, and testing postman confirm it works awww yeah

# Client Side JWT Addition

- with the above finished we see we have a fully functional backend, we just need to make a front end that con construct these requests for us properly, and format the data how we like
- I am probably going to make this very not aesthetic, and just try to get the functionality down first, then we can fuck with some colour
- so in general we are going to be storing an authenticated or not authenticated state in the parent App.js folder, and when they try to load the login component for example, if we find the user is already authenticated, we are going to just redirect them to the dahsboard, where the todo list will live, and if they are not authenticated, then we load the login page so they can get authenticated
- we are not going to go over state management system like React Context API, or Redux, since these deserve more time and we want to focus on JWT, 
    - however I want to get into these later

## SetUp

- so we have the basis of our react app set up already, we have our react installation, and all of our componenrs we made for our todo list, and our current panding page in App.js is our ListTodo and InputTodos components
- **however** we are going to install `react-router-dom` and `react-toastify`, 
    - the former lets us create routes different routes on our page, so when we navigate to "http://localhost:3000/about" for example, we bring up a specific view with component for the about page (we are not making an about page, so this is jsut an example), 
    - the latter lets us have little pop up notifications for when we log in or register or soemthing to let the user know we logged in

## React-Router-Dom

- we have used react-router-dom in the movie search project before, but we will go over how we are going to set it up here too
- we set this up in the App.js file, so it will take a bit of modifying to get our current project to still work with the react-router-dom setup, we may just not load any of the todo list components yet until we start working on the dashboard component, since that is where we will actually serve the todo list
- **OKAY WHEN WATCHING THE TUTORIAL I CAME ACROSS OSME QUESTIONS AND DIFFERENCES FROM MY OTHER IMPLEMENTATION OF RRD (REACT ROUTER DOM) IN THE MOVIE SITE, WILL TALK ABOUT THEM HERE**
- **also will add more as i find more things that are different**
    1. we need to import BrowserRouter from RRD, all components that will use RRD need to be excapsulated in a parent Browser Router component, to do this we just wrap the whole ass app in `<BrowserRouter><BrowserRouter />`, but he does it in the video in the App component, just making a parent BrowserRouter component for all the views/components: 
        ```
        function App() {
            return (
                <BrowserRouter>
                    <Route />
                    <Route />
                <BrowserRouter />
            )
        }
        ```
        - but in my experience we instead go into index.js and wrap the App component in browser router:
        ```
        root.render(
            <React.StrictMode>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </React.StrictMode>
        );
        ```
        - then in app have our routes and whatnot, so why the difference?
        - from what I can tell, not a lot of reason, people seem to do both, and it seems as though as long as all your components and routes tat are going to rely on BR are inside the component one way or another, we are gucci
    2. Also, he is using the `<Switch>` component to hold all of his `<Route>` comonents in App, but my movie search app thing uses the `<Routes>` component to hold my `<Route>` components, and this is because he is using v5 of RRD, and I use v6
        - there are lots of changes where they say to use newer element types in v6, in the "upgrading" docs here: https://reactrouter.com/en/main/upgrading/v5
        - for example he also passes in his components to `<Route>` via the `render` attribute, but we will use the `element` attribute instead since we can directly define a component element (like `<ListTodo>`) in the `element` attribute, which makes it easier to pass props to those components

### Initial BrowserRouter

- okay so after that aside we can finally set up the routing in our app
- first we want to go into index.js and import the `BrowserRuuter` component from react-router-dom, to allow our app to use proper URL style routing:
```
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```
- we simply wrap the whole `<App />` component in a `<BrowserRouter>` component, that way the entire App has access to teh states and hooks of BrowserRouter

### Adding Routes in App

- we then want to go into our App component and add teh various routes we want to have for our page
- to do this first we are going to create files for the Login component, the Register component, and the dashboard component, I am going to keep Dashboard.js in its own folder (also called dashboard), have Login.js and Register.js in the main Components folder, and move EditTodo.js, ListTodo.js, and InputTodo.js to its own TodoList folder
- we can add very basic functionality to the new Dashboard/Login/Register components, just so they return their compoent name:
```
// Register.js File //
const Register = () => {
    return (
        <>
            <h1>Register</h1>
        </>
    );
};

export default Register;
```
```
// Login.js File //
const Login = () => {
    return (
        <>
            <h1>Login</h1>
        </>
    );
};

export default Login;
```
```
// Dashboard.js File //
const Dashboard = () => {
    return (
        <>
            <h1>Dashboard</h1>
        </>
    );
};

export default Dashboard;
``` 
- back in App.js we also want to import the Routes, Route, and Navigate components from react-router-dom: `import { Routes, Route, Navigate, } from 'react-router-dom';`, and we will also import each of teh components we just made, as well as useState since we will use it for the authentication state
- so with react-router-dom, all of our different website pages, which can consist of mulitple components or just be a single one, are going to be `<Route>` components, all enclosed in a single parent `<Routes>` component
- we then define a path as an attribute in each `<Route>` component, and when the page naviagtes to that URL, that is the route/component that is rendered:
```
function App() {

  return (
    <>
      <Routes>
        <Route 
          exact path="/login" 
          element={
              <Login />
          } 
        />
        <Route exact path="/register" element={<Register />} />
        <Route 
          exact path="/" 
          element={
              <Dashboard />
          }  
        />
      </Routes>
    </>
  );
}
```
- the whack formatting for the login and dashboard elements will make sense later
- but we see all `<Route>` components are enclosed in a `<Routes>` component, and then each of the individual `<Route>` components call one of the components we made with the `element` attribute, and each `<Route>` has a defined path in the `path` attribute
    - so for example, is the user types in "https://localhost:3000/login" they will his that `<Route>` and be directed to the `<Login />` component

### Adding Authentication State and Redirects

- okay so with that we now want to add a simple way to track the state of te user authentication, which we can do easily with the `useState` hook we added
- we can create a state called `isAuthenticated` and have it set to a default boolean value of false: `const [isAuthenticated, setIsAuthenticated] = useState(false);`
- we then want to be able to pass this state into the components, so that the login component can change this state after logging in and being successfully authenticated with a JWT token, so to do that we are going to need to pass a setState function to the components
- **and** we also want a way of making sure the user is not able to load the `<Dashboard />` component if they are not authenticated, as well as not being able to load the `<Login />` component if they are already logged in
- we do this below:
```
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  }

  return (
    <>
      <Routes>
        <Route 
          exact path="/login" 
          element={
            !isAuthenticated ? (
              <Login setAuth={setAuth} />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route exact path="/register" element={<Register setAuth={setAuth}/>} />
        <Route 
          exact path="/" 
          element={
            isAuthenticated ? (
              <Dashboard setAuth={setAuth} />
            ) : (
              <Navigate to="/login" />
            )
          }  
          setAuth={setAuth}
        />
      </Routes>
    </>
  );
}
```
- so now we have a state for `isAuthenticated`, and we have also create a `setAuth` function that basically just calls `setIsAuthenticated` for us, but this makes it easier for passing the set state functionality as a prop to the components
- in the actual `<Routes>` themselves, we see the `element` attributes have chnages signifcantly, we use the: `condition ? (run if True) : (run if False)` syntax to redirect react-router-dom to a different route if we are or are not autheticated
    - for example in the `<Login>` `<Route>`:
    ```
    element={
        !isAuthenticated ? (
            <Login setAuth={setAuth} />
        ) : (
            <Navigate to="/" />
        )
    }
    ```
    - so if we are not authenticated, the Login component loads as expected, but if we are authenticated, then we redirect the app to the "/" route instead, which we can see is the route with the `<Dashboard>` component
    - and we do the opposite for the dashboard component
- further, since we want each of the Login/Dashboard/Register components to be able to change the `isAuthenticated` state, we also pass in the defined `setAuth` function as a prop to each: `<Login setAuth={setAuth}`
- now for the last step, we want to add a button to test the basic functionality of this to the Login and Dashboard components, that will just have an onClick handler to call `setAuth(true)` and `setAuth(false)` respectively:
```
const Login = ({ setAuth }) => {
    return (
        <>
            <h1>Login</h1>
            <button onClick={() => setAuth(true)} >Login</button>
        </>
    );
};
```
```
const Dashboard = ({ setAuth }) => {
    return (
        <>
            <h1>Dashboard</h1>
            <button onClick={() => setAuth(false)} >Logout</button>
            <InputTodo />
            <ListTodo />
        </>
    );
};
```
- **note, i also added our old Input and ListTodo components to the dasboard to give it some life, they dont work since we changed our backend/db structure, but looks nice**
- and we see now that now if we navigate to the dashboard through the URL by entering just "https://localhost:3000", since the dahsboard route is "/", then we immediately get redirected to "https://localhost:3000/login" since we are not authenticated
- if we then click the login button, `isAuthenticated` gets set to `true` and we are immediately redirect to the dashboard at "https://localhost:3000", then we can click the logout button and `isAuthenticated` gets set to `false` again and we are immediately redirect to "https://localhost:3000/login" again

## Register Component

- so now that we can route to the different components, we want to build out the register component so it looks how we want and actually interacts with the backend and can get that JWT token

### Register Input Form and State

- okay so the first thing to do is to make a form that peopel will input their registration info in, which is easy enough, we have made forms for the InputTodo component already:
```
const Register = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: ""
    });
    const updateInputs = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    };
    return (
        <>
            <div className="container">
                <div className="row text-center mt-5">
                    <h1>Register</h1>
                    <form onSubmit={onSubmitForm} className="w-100 mt-3 d-flex flex-column justify-content-center align-items-center">
                        <input 
                            value={inputs.name} 
                            onChange={updateInputs}
                            type="text" 
                            name="name" 
                            placeholder="Username"
                            className="w-50 form-control d-flex justify-content-center border border-1 border-secondary-subtle mb-3" 
                            />
                        <input 
                            value={inputs.email} 
                            onChange={updateInputs} 
                            className="w-50 form-control d-flex justify-content-center border border-1 border-secondary-subtle mb-3" 
                            type="email" 
                            name="email" 
                            placeholder="Email Address" 
                        />
                        <input 
                            value={inputs.password} 
                            onChange={updateInputs} 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            className="w-50 form-control d-flex justify-content-center border border-1 border-secondary-subtle mb-3"      
                        />
                        <button className="w-50 btn btn-success btn-block">Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
};
```
- so we have a bunch of bootstrap calsses and stuff but the basis of it is quite simple, it is just a `<form>` element with 3 `<input>` elements, one for name, email, and password, and finally a `<button>` for submitting the whole thing
- we see that we have defined a state called `inputs` that we use to hold each of the `name`,`email`, and `password` states in an object, we are going to use the typical `onChange` method with react where we set each of the input `value` attributes to be `input.name` for example, then update the value by calling an `onChange` handler, in this case `updateInputs()`
- we use the same event handler for all of the inputs, and this way every time an input changes all teh states are updated at the same time, and we can guarentee they are always in sync with what is on the screen
- inside `updateInputs()`, we simply call the `setInputs` function, with: `setInputs({...inputs, [e.target.name]: e.target.value});`, which looks confusing at first, but the `...inputs` syntax is just called a "spread" operator

    #### Long Aside on {[]} Notation

    - what this does is just call on each item of a iterable, so we have compressed the iterable, witht he commas and stuff so they are still seperate items, into the `...inputs` reference
    - so when we just call `{...inputs}` for example, we are just cloing the inputs object
    - however in addtion, we are adding another item to the object with the second term `[e.target.name]: e.target.value`, which for the `name` input would be `['name']: value`, and when definign an object literal like this, this defines a new item, which will overwrite the previous item with the key of `name` already in the object from the `...inputs` cloning
        - in general, the last one in line always wins, it just overwrites each time
    - I am not sure why we have to define it in square paranthesis like an array, we see if we remove the paraenthesis we can not compile, and if we do something like `String(e.target.name)` to cast it into a string, then it still doesnt work
    - **Further testing**, if we `console.log([e.target.name])` in the function, we get a printout of `["name"]`, so just the input name in an array in a string, but if we `console.log(e.target.name)` we get `name`, so no string at all
    - then if we do `console.log({[e.target.name]: 'test'})`, we get a proper object printed out of `{name: 'test'}`, so the `name` key is not in a array or even represented as a string liek it is when we log `[e.target.name]` alone
    - we also see if we `console.log({e.target.name: 'test'})` we get an error! this doesnt work either, so it seems in the object literal notation, we have to use the square brackets to identify that we are calling a variable or object properties 
    - we can confirm this by setting a variabel in the function `const test1 = 'chris'`, then try `console.log({test1: 'test'})`, **and we see the printout is:** `{test1: 'test'}`, so it doesnt even recognize the variable, and if we do `console.log({[test1]: 'test'})`, **the printout is now:** `{chris: 'test'}` **WOW**
    - so i guess this is just a pice of JS that went over my head, inside objects we have to use square brackets as an "escape" to reference variables for keys from outside
    - this makes sense since arrays cannot be keys anyway since they are mutable, and mutable bjects cannot be keys
    - **one last test**, we can try the same thing on the value side of the object, with the same `const test1 = 'chris'` definition, we can do `console.log({test: test1})` and we see the reference works and we printout `{test: 'chris'}`, and if we do `console.log({test: [test1]})`, this time we actually cast the reference into an array and get `{test: ['chris']}`
    - good stuff
- okay back to the real world

### OnSubmit Form Handler and Fetch API

- now we want to add an onSubmit handler to the form so that we can actually submit this info and call teh API, this is quite easy since we know exactly the information our backend wants to recieve:
```
const onSubmitForm = async (e) => {
        e.preventDefault()
        try {
            const body = { ...inputs }
            const response = await fetch("/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            const data = await response.json()
            // console.log(data);
            localStorage.setItem("token", data.token)
            setAuth(true)
        } catch (error) {
            console.error(error.message);
        }
    }
```
- so when the button is submitted, we create a copy of the current state of the inputs with and put it int he `body` reference with `const body = { ...inputs }`
- i will say I think the guy in the video made this harder on himself, he instead declares further variables in the component scope, saying `const { name, email, password } = inputs`, and then sets them to body in the handler with `const body = { name, email, password }` which works fine and they get updated everytime the compoennt updates, which is when the state changes, so they are alwasy up to date, but we can simply just reference inputs directly here with the spread notation like I do above
    - he also uses them in his inputs for the html, defining the input names as `name={email}`, where I do `name={inputs.email}`, I liek my direct approach, we will see if it comes back to get me
- we then make a simple fetch POST request liek we did with the InputTodo compoennt before
- we want to make it to the register route, and we know that first has to go to the "/auth" routh, which calls the "loginReg" middleware, so our route is "auth/register"
- we also have to define our fetch options object since it is not a simpel GET, so we define the method as POST, and the headers `content-type` liek we did before, and we also of course have to define the body, by using `body: JSON.stringify(body)` to get the inputs we put into `body` in there as a proper JSON string
- we know from our backend that the register route is going to make a new user in the database with this info, and then send us back a fresh JWT authenticaion token, so we have to convert that JSOn to accept taht token with `const data = await response.json()`
- and now we have to actually interact with our browser, which os cool! We have to add this token to the local storage on our browser with `localStorage.setItem("token", data.token)`, this sets an object like item to our browsrs local storage of "token" : {actual JWT}"
- lastly we call `setAuth(true)`, which we passed to the register as a component to change the state of `isAuthenticated` to true now taht we have a token!
- in fact, we can now go into our browser, and inspect, and if this all worked, we can go to the "application" tab of the dev tools, go to the "storage" section on the left, and find the "local storage" tab, and if in there there is likely multiple options, our is the page name, "http://localhost:3000/" in my case, and we can click on it and see a table of all our local storage items, and the only one there for us is "token: eyJhbGciOi...", and it shows the whole token but I shortened it,
- that is really cool, everything worked and now our browser has this token it can use to give back to our backend the next time we want to load the page
- we will see that right now if we go to the "/login" URL , we do not get automatically redirected though since we haven't yet set up the page to not refresh and reset the `isAuthenticated` state to false everytime we reload the page, however we do still want to it call a verify API to test if our token is valid whenever we load a page

## Login Component

- okay so functionally the login route should be pretty similiar to the register route, we want to have an email/passwrod enter form, and a submit button, except we want to hit the login endpoint of the backend instead of register
- we still are going to want to get a token and put it in local storage as well
- i will add the entirety of login here below, since most of it was just copy and pasted, and copy what has changed from register:
```
import { useState } from "react";
import { Link } from 'react-router-dom';

const Login = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });
    const updateInputs = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    };
    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {
            const body = { ...inputs }
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            const data = await response.json()
            console.log(data);
            if (data.token) {
                localStorage.setItem("token", data.token)
                setAuth(true)
            }
            
        } catch (error) {
            console.error(error.message);
        }
    }
    return (
        <>
            <div className="container">
                <div className="row text-center mt-5">
                    <h1>Login</h1>
                    <form onSubmit={onSubmitForm} className="w-100 mt-3 d-flex flex-column justify-content-center align-items-center">
                        <input value={inputs.email} onChange={updateInputs} className="w-50 form-control d-flex justify-content-center border border-1 border-secondary-subtle mb-3" type="email" name="email" placeholder="Email Address" />
                        <input value={inputs.password} onChange={updateInputs} className="w-50 form-control d-flex justify-content-center border border-1 border-secondary-subtle mb-3" type="password" name="password" placeholder="Password" />
                        <button className="w-50 btn btn-success btn-block mb-3">Submit</button>
                    </form>
                    <Link to="/register">Or Create a New Account</Link>
                </div>
            </div>
        </>
    );
};

export default Login;
```
- so the mojority of the return statement is exactly the same, excet we have gotten rid of the "name" input field, since we want to login with emails instead of name since emails are unique
- we have the same state, and onCHnage handler for the remaining input fields, and since we are just calling the spread operator `...inputs` in the `updateInputs` and `onSubmitForm` handlers we do not need to change the variables to remove `name` at all
- in the fetch request we have changed the route from "auth/register" to "auth/login" of course, and besides that we also added a check to see if we actually get a token back for now:
```
if (data.token) {
    localStorage.setItem("token", data.token)
    setAuth(true)
}
```
- we did this because when I was testing if the login worked correctly, I noticed we got redirected to dashboard with the `setAuth(true)` line even when we entered the wrong password since `setAuth(true)` gets called either way, so I just added as simple cehck to make sure we actually get a token back, which only happens if login is successful, before add the localstorage and `setAuth(true)` to avoid that
    - i imagine we will do a better version of making sure were logged in before redirecting when we have the components done, but this works for now
- the last thing we have added is a link in the HTML to navigate to /register, so the user can click that if they do not have an account, and we also added one to navigate to /login in the register page
- we do this with the `<Link>` component from react-router-dom, which we have to import, it is very simple and looks like: `<Link to="/register">Or Create a New Account</Link>`
- this lets us have a simple button that links to a different `<Route>` that we defined in the App component, and it is nice since we do not have to refresh the page, it just changes to a new route

## Staring Dashboard Component and Updating Old Components

- okay so now we want to make the dashboard component, and this is where we will have to add some things from the original combined JWT/Todos video to make the Todo list all work here in one go, instead of making then remaking the compoennt
- hopefully it goes smoothly, but I will focus on getting the routing/authorization stuff done right frist
- **okay so i lied, we are going to build the barebones dashboard component, but we are also going to make modifications to the ListTodo/EditTodo/InptTodo/DeleteTodo components/functions, so that these all play nicely with our backend API and we can actually have a functioning website before we add in the extra functionality like no logout on refrsh**
- we want our dashboard, our main page, to display the users name, as well as the todo list itself, so our HTML structure for the dashboard is going to look something like:
```
const Dashboard = ({ setAuth }) => {
    const [name, setName] = useState("")
    return (
        <>
            <main className="container mt-4 text-center mt-5">
                <div className="row d-flex flex-column justify-content-center">
                    <h1>{name}'s ToDo List</h1>
                    <InputTodo />
                    <ListTodo />
                </div>
            </main>
            
        </>
    );
};

export default Dashboard;
```
- **note, we chnaged some of the bootstrap styling to make it look more uniform and liek a single component all together when its loaded**
- and so we are going to have to make a fetch request to get the user info
- however, since we already need to make a fetch reqest to get all the Todos of the user, it makes more sense for us to make a single fetch request in the Dashboard component to the "/dashboard/" route we made in the backend, since that endpoint will give us the users name, todo_id, and todo description, for each of teh user's Todos, and thus we can just extract the name from one of the Todos
    - remembering the SQL query from the "/dashboard/" route:
    ```
    const user_data = await db.query(
        "SELECT u.user_name, t.todo_id, t.description FROM users as u LEFT JOIN todos as t ON u.user_id = t.user_id WHERE u.user_id=$1",
        [req.user.id]
    )
    ```
- since we are getting all the Todo information here, it also makes more sense for us to just set all of the returned Todos as a state in our component, and pass that state to the `<ListTodo />` in the return HTML above
- so to do this, we are going to need to implement a state for the `name` that Dashboard will use, and then a state for `allTodos` that will get passed to `<ListTodo />`, and we will also need to make a `useEffect()` function that will call the API to get this data when the dashboard is initially loaded:
```
import InputTodo from '../TodoList/InputTodo';
import ListTodo from '../TodoList/ListTodo';
import { useEffect, useState } from 'react';

const Dashboard = ({ setAuth }) => {
    const [name, setName] = useState("")
    const [allTodos, setAllTodos] = useState([])

    const getProfile = async () => {
        try {
            const response = await fetch("/dashboard", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const data = await response.json();

            setName(data[0].user_name)
            setAllTodos(data)
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getProfile()
    }, [])

    return (
        <>
            <main className="container mt-4 text-center mt-5">
                <div className="row d-flex flex-column justify-content-center">
                    <h1>{name}'s ToDo List</h1>
                    <InputTodo />
                    <ListTodo allTodos={allTodos}/>
                </div>
            </main>
            
        </>
    );
};

export default Dashboard;
```
- so now we have state t store the user's name in: `const [name, setName] = useState("")` and a state to store the Todos in: `const [allTodos, setAllTodos] = useState([])`
- when the page is loaded, `useEffect()` is called, which calls the `getProfile()` async function, once again, we are having `useEffect()` call a seperate `getProfile()` function so that we can make `getProfile()` asynchronous, since we cannot easily make `useEffect()` async on its own
- inside get profile, we make a GET request to the "/dashboard" route ( which is the same as "/dashboard/"), and even though it is just a GET, we have to include the options object so that we have a place to pass the `token` that was given to us by the backend when we first logged in
- we do this by just adding a simple `headers: { token: localStorage.token }` property to the object, and we also specify the method as GET since we have to do that if we are going to give options
- now we do not need to do anything special to access that token, remember how in the Login component we saved the token to the browsers local storage with `localStorage.setItem("token", data.token)`, well now we can just access it in the same way with `localStorage.token`, very easy considering we are working with soemthign we did not initialize ourselves!
- we then simply just await the response, and parse teh JSON response, and we know from the backend that our response, if successful, we be an an array in the form of:
```
[
    {
        "user_name": "zelda2",
        "todo_id": 5,
        "description": "slay gannon"
    },
    {
        "user_name": "zelda2",
        "todo_id": 7,
        "description": "buy a gallon of PCP"
    },
    {
        "user_name": "zelda2",
        "todo_id": 13,
        "description": "im sorry chris that wasn't nice"
    },
    {
        "user_name": "zelda2",
        "todo_id": 4,
        "description": "works?"
    }
]
```
- and this example is for the "zelda2" user I made when testing in postman when making the backend
- but in general it is an array of the `{ user_name, todo_id, description }` objects we defined in the SQL query
- so we can simply now set the state for the `name` state to the `user_name` with `setName(data[0].user_name)`, so we just choose the first todo in the aray and grab the name, and due to our authentication and well made query, each returned todo will always have the same `user_name`
- **also importantly,** if the user has no todos, for a new user, we still get a single object returned since we are doing a `LEFT JOIN` operation, and that would look like:
```
{
    "user_name": "zelda2",
    "todo_id": null,
    "description": null
}
``` 
- so we can still set the name, and simply load no todos since there are none
- however, we also want to set the `allTodos` state in the `useEffect()` function as well, and we do that with `setAllTodos(data)`, whcih is easy enough, and just gives the entire array shown above to the `allTodos` state
- in the last steo for this component, we then want to pass taht state to the `<ListTodo />` so that it can render the Todos without making its own fetch request, and we do that in the HTML return with `<ListTodo allTodos={allTodos}/>`
- this now means we have to edit ListTodo so that it can use this data without making its own request

### Updating ListTodo

- so originally the ListTodo component made its own fetch request on render, via `useEffect()` which called th async `getTodos` function, then inside the HTML return, we return a variable called `todoHTML`, which is its own arrow function that maps the fetched `todos` state onto the `<ListItem>` component
- the ListItem component does not need to be changed at all, since we are still grabbing the `description` and `todo_id` from each todo object that gets passed to it in the `todos` state array, instead we jsut need to change how the populate and update the `todos` state, since we no longer want to do it with a fetch request, but instead with the passed in `allTodos` array from the Dashboard component
- this could be as simple as changing `const todoHTML = todos.map((todoObj, idx) => {` to `const todoHTML = allTodos.map((todoObj, idx) => {`, and that works initially, but we need to have abetter way to keep track of the `allTodos` state within the ListTodo component, and rerender the componenet when `allTodos` cahnges, and this sounds perfect for `useffect()`
- Note, I will exclude the `ListItem` component definition here since it does not change, although we will need to change the `deleteTodo` method later to add the JWT authentication:
```
const ListTodo = ({ allTodos }) => {
    const [todos, setTodos] = useState([])

    const filterTodos = (todoId) => {
        // console.log("filterTodos initiated");
        setTodos(todos.filter((todo) => {
            if (todo.todo_id !== todoId) {
                return true
            } else {
                return false
            }
        }));
    };

    useEffect(() => {
        setTodos(allTodos);
    }, [allTodos])
    
    const todoHTML = todos.map((todoObj, idx) => {
        return (
            <ListItem todoObj={todoObj} key={idx} filterTodos={filterTodos} todos={todos} setTodos={setTodos}/>
        )
    }) 

    return (
        <main className="container mt-4">
            <div className="row d-flex flex-column justify-content-center">
                {todoHTML}
            </div>
        </main>
    )
}

export default ListTodo
```
- so as we can see we have erased the `getTodos()` function entirely, since we do not need to make a request anymore, and we can also see that the `filterTodos()` function actually has not changed whatsoever
- so now all we have to do is accept the `allTodos` state from Dashboard by deconstructing the prop: `const ListTodo = ({ allTodos }) => {`, and now we set the `todos` state directly in `useEffect`:
```
useEffect(() => {
    setTodos(allTodos);
}, [allTodos])
```
- so here we set `todos` to be `allTodos`, but notice that we also set a dependency of `useEffect` to be `[allTodos]`, what this does is tell `useEffect` to rerender our component each time one of the items in the array changes, in this case our only item is `allTodos`
- this is one of the great features of `useEffect`, and is also the reason we are typically apssing an empty array to it `[]`, since this tells `useEffect` it has no dependencies, and also stops `useEffect` from being called every single time a component is rerendered, which ends up in continuous fetch requests being made for some components when the empty array is not passed
- so now, everytime Dashboard updates `allTodos`, like when we add in the proper InputTodo functionality, it will pass the new `allTodos` to ListTodo, and since `allTodos` cahnged, `useEffect` will run and update the `todos` state to the new `allTodos`, and our list will be rendered properly
- so notice all of our todos are not in the `todos` state, so the mapping function for creating ListItem's works as expected: `todos.map((todoObj, idx) => {`

### Updating InputTodo & Adding Soft Refresh

- so I have decided to instead update all the components to work nicely with the new login functionality before adding the additional authentication features from the JWT tutorial 
- I will also add teh "soft reset" functionality here, and by that I mean the ability to update the todo list when we add or edit a todo, without having to refresh the entire page, which is a much nicer user experience, we already have this with the delete todos option, so having it for the whole app will be nice
- for teh InputTodo, we mainly need to change the fetch request so it works with our new backend, which needs JWT wuthentication
```
const InputTodo = ({ setTodosChange }) => {
    const [description, setDescription] = useState("");

    const updateDescription = (e) => {
        setDescription(e.target.value);
        // console.log(description);
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", localStorage.token);
            const body = { description };
            const response = await fetch("/dashboard/todos", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(body)
            });
            const data = await response.json();
            setTodosChange(true)
            setDescription("")
        } catch (err) {
            console.error(err.message);
        }
    }
...
```
- so here we can see that we have chnaged the route from "todos" to "dashboard/todos" as we have to for all of our new todolist routes
- but we also have added the `myHeaders` declaration for constructing the headers of our request, this is common practice in JS, and allows us to make a headers object as we go, then pass that Headers object to the fetch request as `headers: myHeaders`, and it deals with the formatting for us
- we do tis by calling the built in Headers class, and its constructor: `const myHeaders = new Headers();`, this creates a new Headers object for us, then we add items to our Headers object as key/value pairs with teh `append` method, such as: `myHeaders.append("Content-Type", "application/json");` and `myHeaders.append("token", localStorage.token);`
- so this lets us add teh content type header that we already had, and add the new JWT token as well
- when reading up on the HEaders object, it also has a list of forbidden heads it will not let us add, since they can mess with the ones needed by the browser I believe, which is ncie so we dont accidentally break stuff
- we are now ready to send the request and get the response, which we do as normal, now we can see that instead of calling `window.location = '/'` wich did a hard reset of teh page prevously, we instead have created, and passed into the InputTodo component, the state handler for a `todosChange` state, and we set that state to `true` with `setTodosChange(true)`
- this is a new addition that we make in the Dashboard comonent to keep track of when any change happens to our todos, and it is a simple boolean state:   
```
// Dashboard.js File //
const Dashboard = ({ setAuth }) => {
    const [name, setName] = useState("");
    const [allTodos, setAllTodos] = useState([]);
    const [todosChange, setTodosChange] = useState(false)
...
...
    useEffect(() => {
        getProfile();
        setTodosChange(false)
    }, [todosChange])

    return (
        <>
            <main className="container mt-4 text-center mt-5">
                <div className="row d-flex flex-column justify-content-center">
                    <h1>{name}'s ToDo List</h1>
                    <InputTodo setTodosChange={setTodosChange} />
                    <ListTodo allTodos={allTodos} setTodosChange={setTodosChange} />
                </div>
            </main>
            
        </>
    );
};
```
- so we see we create the new state at the top and set teh default of `todosChange` to `false`, then we pass the `setTodosChange` method to both the InputTodo and ListTodo components (we will go over ListTodo more later, for EditTodo)
- lastly, we see that we have included `[todosChange]` as a dependency for `useEffect`, so this means that `useEffect` will run everytime `todosChange` is cahnged
- so we can see the inital state is `false`, then when InputTodo adds a new Todo list item, it calls `setTodosChange(true)`, thus changing `todosChange` and causing `useEffect` to run, which calls `getProfile();` to get all the new Todo items, including the new one that was just added, thus updating the list, and lastly in `useEffect` we call `setTodosChange(false)` to reset the state so if another todo is added, or if another component calls `setTodosChange(true)`, the process happens again and the list is reloaded
- so in this way we have a method of "soft refreshing" the todo list anytime we want by just using the `todosChange` state
- **lastly**, if we notice in the `onSubmitForm()` code above, we also call `setDescription("")` at the end of the function, this is so after we add a todo, the input form goes back to being empty, and the text we just submitted doesnt stick around

### Updating EditTodos

- we can do similar updates tot he EditTodo component, which if we recall is added in as the button element in the ListItem component of ListTodo
- the first change is to add the same soft refresh functionality for after we edit a todo so that the page doesnt have to fully reload for the chnages to show
- we do this in a similar way, passing `setTodosChange` from Dashboard to Listtodo to EditTodo, and finally to EditModal, since the EditModal component is where the change is actually submitted and and the backend Edit API is called
- this happens in the onEdit submit handler for the edit modal form, which is shown below:
```
const onEdit = async (todoObj, e) => {
    e.preventDefault();
    try {
        const body = { description };
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", localStorage.token);

        const response = await fetch(`dashboard/todos/${todoObj.todo_id}`, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(body),
        });
        setTodosChange(true)
    } catch (err) {
        console.error(err.message);
    }
    };
```
- here we can see we call teh `setTodosChange(true)` state change after we make the fetch API request
- we also of course have to update the PUT requets to the edit API by making it include the JWT token
- we do this again with the `Headers();` constructor, making a `myHeaders` object that we add teh content=type and JWT token headers too
- we then make the PUT request as normal 
- besides that small change to the handler, the EditTodo/EditModal component statys the same, as the majority of its functionality deals with making the modal work properly, which is inconsequential to our API

### Updating Delete Todo Function

- Lastly we have to update the `deleteTodo()` function we have for deleting todo elements, initially this is simple enough since all we really need to do is add the JWT token as a header to the DELETE request:
```
const deleteTodo = async (todoObj, filterTodos) => {
    try {
        const response = await fetch(`/dashboard/todos/${todoObj.todo_id}`, {
            method: "DELETE",
            headers: { token: localStorage.token }
        })
        const data = await response.json()
        filterTodos(todoObj.todo_id);
    } catch (error) {
        console.error(error.message);
    }
}
```
- we do not need to construct a `Header` object since we are just using a single header here
- this works as expected for deleting Todos, but we come across a new unintended interaction: when we delete all of our Todos, the next time we load the page we make an API call to fetch our todos of course, and the LEFT JOIN SQL query will return our user_name like we need it still, but since it returns a full single RECORD, we also get  `todo_id: null` and `description: null` properties being returned as well
- so what this does is when we build our ListTodos component, and call the maping function to map our returned todo array onto the ListItem component, we make a ListItem with a `null` description and ID, and end up with a weird empty todo on our list, and its ugly
- so therefore we have to add a conditional to the HTML return of ListTodos, so that we do not return or construct our ListItems when we have a single null return
- to do this we can make our HTML reutnr of ListItem be:
```
return (
    <main className="container mt-4">
        <div className="row d-flex flex-column justify-content-center">
            {
            todos.length !== 0 && 
                todos[0].todo_id !== null && 
                    (todoHTML)
            }
        </div>
    </main>
)
```
- so here what we are doing is using a JS escape in the HTML to add a little shortcut conditional, where we first test if we have a a todo list yet at all with `todos.length !== 0`, then we test if the first todo has a `null` id with `allTodos[0].todo_id !== null` (and we do this since the only way to get a `null` `todo_id` is if there are none, since they are made by default), and then if both of these are true we then allow it to constrct the `todoHTML`
- this notation works since JS tests the conditions one at a time, so the third condition in the "and" (`&&`) statements only gets executed if the previous are true, and in checking if `(todoHTML)` is `true` it gets executed to check, so this is like a little shortcut instead of sayign `if (todos.length !== 0 && allTodos[0].todo_id !== null) {(todoHTML)}`
- **also note, important.** we need to have the initial `todos.length !== 0` condition, even thugh it seems like it sould work fine just by checking the first todo for the null, but the issue is that this render will happen before the initial API call on load is done, so we will not have any items in `todos` at first, and `todos[0]` is undifined, and then it gets mad ):

## Adding JWT Token Handling & Verification

- now that all of our APIs play nicely with the JWT token, we want to make sure we are dealing with the JWT token correctly when the user logs our, and when they revisit the page while the token is still valid so they do not need to log back In

### JWT Logout

- if the user clicks the logout button, we want to clear the token from the local storage so that the next erson to use the device doesnt have access to their account if they go to the same site
- we do this with a simple logout button and handler that will remove the token, first we add a logout button to the HTML return of dashboard. which we had then removed previously, but now it will be better:
```
return (
    <>
        <main className="container text-center mt-4">
            <div className="row d-flex flex-column justify-content-center">
                <div className='d-flex flex-column w-100 align-items-center p-0'>
                    <button className="btn btn-primary align-self-end" onClick={logout}>Logout</button>
                    <h1>{name}'s ToDo List</h1>
                </div>
                <InputTodo setTodosChange={setTodosChange} />
                <ListTodo allTodos={allTodos} setTodosChange={setTodosChange} />
            </div>
        </main>
        
    </>
);
```
- one note on the CSS here is that i find it difficult to have a flexbox here where I want the name to be center then the logout button to be parallel to the name but to the right, we can do this with absolute positioning of coruse but also I feeel like people try to avoid that when possible
- instead what I did here was make it a flex-column flexbox justified to center, then align the logout button end so it goes to one side, this also clearly stacks them, which I didnt actually expect at first, but now I like it stacked since the logout is out of the way of the main viiew, maybe will make a banner at the top later instead for search/logout
- okay but the important functionality here is that the button calls teh logout handler:
```
const logout = (e) => {
    e.preventDefault()
    localStorage.removeItem("token")
    setAuth(false)
}
```
- in the logout handler, we just prevent default so it doesnt refresh, then we do `localStorage.removeItem("token")` to remove the JWT token from out local storage, then simply `setAuth(false)` to force the user to go back to the login page
- if we now try to logout on our site, we can see the token disappear from the applications page of the dev tools as well, it works!

### Adding Token Verification for Returning Users

- okay so now we want a user to be able to be directed right to their page when they arrive at the website if they still have a valid JWT authentication
- we already have this in our backend with the "auth/verify" route, but now we need to call this route in the front end
- we want to call this route right in the App component so that it gets called when the webpage loads
```
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  }

  const verifyToken = async () => {
    try {
      const response = await fetch("auth/verify",
        {
          method: "GET",
          headers: { token: localStorage.token}
        });
      const data = await response.json();
      data === true ? (setAuth(true)) : (setAuth(false));

    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);
```
- so to App we have added a `useEffect()` that will run when the page loads, and all it does it call `verifyToken()` which we have inplemented above
- inside `verifyToken()`, we just make a GET request to the "auth/dashboard" route, and try to add our token as a header, we know that this route returns `true` as the response if the token is verified so we simpyl test that `data === true ? (setAuth(true)) : (setAuth(false));` and set the authentication state to either `true` or `false` accordingly
- we have to make sure not to use a `if (data)` syntax here, since this will return true for all resonses as long as it exists, so our response if we are unverified is a 403 status with "Not Authorized" text, and since there is text `data` resolves as `true`, so we have to use the EXACTLY equal operator `===`
- so now isAuthenticated is true, so we get redirect tot he dashboard immediately

# Deploy Notes

- we want a .git folder within our root directory, which we have already from when we did `git init`
- in heroku, we must have a package.json file within the root directory as well
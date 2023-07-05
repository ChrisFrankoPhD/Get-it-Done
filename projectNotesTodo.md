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
    - so what is happening is that with every keystroke, the react state is updated by `updateDescription`, which updates the `description` state to the whatever the user typed, and thus the `value` field of the input now displays what the user typed, so we are working slightly backwards by making the user *really* update the react state, and the form just displaying the react state, but this allows the react state to be the true source of the data, and thus we can pass that state around to other functions if we need it
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


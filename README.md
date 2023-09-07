# Get it Done

- A planner web app made to better understand how to integrate postgres, expres, react, and node into a single project

## Contents

- [Description](#description)
- [Usage](#using-the-app--program-flow)
    - [Register](#1-register)
    - [Dashboard & ListTodos](#2-dashboard--list)
    - [Create](#3-create-a-list-item)
    - [Edit](#4-edit-items)
    - [Search](#5-search-items)
    - [Delete](#6-delete-items)
    - [Logout](#7-logout)
- [Next Steps](#whats-next)
- [Credit](#credit)

## Description

- Works as a functional to-do list in your browser, has user login functionality, can edit, delete, add, and check-off list items
- Uses React for the front-end design, this allows easy authentication calls to the backend each time a page is rerendered to ensure the user is still authenticated, also allows for seamless editing of the to-do list without the entire app needing to be reloaded
- Uses a Node.js backend with Express.js to make a RESTFUL API structure, each route handles a single operation that makes a single modification to the list database
- The database itself is made in postgresSQL, this allows user todos to be stored and reloaded on subsequent visits

## Using the App & Program Flow

- using the app is straightforward, here I will go through a typical use case while explaining what the program is doing in the background

    ### 1. Register
    
    - you can create a user profile by entering a username, email, and password, this sends a POST request to the backend /auth/register route, which validates the inputs via the "validInfo" middleware and ensures the email is not already registered. Then the password is salted and hashed with the "bcrypt" module, and the user is added to the database using a standard postgres query
        - **Note**, emails are not used for anything, they are simply used as a unique user identifier, usernames can be degenerate
    - A JWT token is created in the backend, which includes the user's newly created UUID, by the "jwt" module and sent back to the user as the response, when the client receives this, an authentication flag in react is set to true, which triggers navigation to the Dashboard

    ### 2. Dashboard & List
    
    - Upon rendering the Dashboard, a GET request to the backend /dashboard route is made, which goes through the "authorization" middleware to confirm the validity of the incoming JWT token, and adds the user's UUID from the token's payload to the request. This request is then used in the /dashboard endpoint to load todos belonging to that user's UUID, which in this case would be none since the account was just created

    ### 3. Create a List Item
    
    - The user can create a todo by entering text into the input field and submitting. In React, the input field lives in the App > Dashboard > InputTodo component. Submission makes a POST request to the /dashboard/todos route with the new todo description in the request body. On the backend, the authorization middleware is called again to validate the JWT token and extract the user's UUID, as it is everytime, and the new todo is added to the database with a foreign key of the user's UUID. 
        - In InputTodo, a flag of `todosChange` flag is set to true with React's useState hook, which propagates this state up to the parent "Dashboard" component, where the `todosChange` state originates, and therefore causes a rerender of the entire dashboard, thereby fetching the user's todos as in step 3 above, so the new todo is displayed instantly
        - `todosChange` is also a dependency of the Dashboard component's `useEffect` hook, which then is automatically called and sets `todosChange` back to false

    ### 4. Edit Items
    
    - In React, this new todo item lives within the App > Dashboard > ListTodo > ListItem component. Within the ListItem, we further have an EditTodo component. The user can then edit the newly created todo with the edit button, which calls upon the EditModal component within EditTodo, the EditModal is only constructed upon clicking on the edit button
        - Within the EditModal the user can submit a modified todo description, this sends a PUT request to the "dashboard/todos/:todo_id" route which updates the appropriate todo description in the database
        - On the client side, the `todosChange` state is once again set to true, causing a rerender of the Dashboard and thus the change is immediately reflected again

    ### 5. Search Items
    
    - The user can also Search through any todos they created with the search bar in the NavBar component. A `searchText` state is created in the parent App component and given to both NavBar and Dashboard, and inside Dashboard is it propagated down to ListTodo. 
        - Navbar updates `searchText` whenever the search input field is changed
        - In ListTodo, if `searchText` is not false, only the todos that include the text from the search query are rendered
        - As described above, the search function is completely on the client side, previously it was handled on the backend, where a postgres query was made to search through all todos and they were returned to the front end, but the search function is much cleaner/faster if handled ont he frontend since all the information must already be there 

    ### 6. Delete Items
    
    - The user can also delete a todo item. The delete functionality lives in the ListItem component, where clicking teh delete button simply makes a DELETE request to the "dashboard/todos/:todo_id" route, where the correct todo is deleted from the database
    - Instead of rerendering Dashboard here, we call a `filterTodos` function, giving it the ID of the todo we just deleted, and the function then filters the current list of all accessible todos (from the last time it loaded them via a GET request) with that todo ID, removing it from the list. Therefore this todo is not displayed, and even though we did not reload the todos from the backend, they are synced. Then on the next full Dashboard rerender, the Dashboard will load directly from the database and everything should still be fully synced. 
    
    ### 7. Logout

    - On logout, which resides in the Navbar, the JWT token is removed from local storage, and `setAuth` is set to false, which navigates us to the login page

## What's Next?

- I would love to add a feature to drag and drop todo items to reorder them, however saving the reordered list in the database is not trivial, will need to think of a good solution

## Credit

- this project was made fully by myself, Chris Franko, but I learnt how to use each of these technologies from Kalob Taulien in the 2023 Ultimate Web Development Bootcamp hosted on Udemy, and learned how to integrate them into a single application from Henry Ly in the PERN Stack Course hosted on YouTube
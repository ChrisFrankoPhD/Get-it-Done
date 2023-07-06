import {useEffect, useState} from "react";
import EditTodo from "./EditTodo";

const ListItem = ({todoObj, filterTodos}) => {
    console.log("ListItem");
    console.log(todoObj);

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

const ListTodo = () => {
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
        console.log(todos); 
    };

    useEffect(() => {
        getTodos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const todoHTML = todos.map((todoObj, idx) => {
        return (
            <ListItem todoObj={todoObj} key={idx} filterTodos={filterTodos} todos={todos} setTodos={setTodos}/>
        )
    }) 

    return (
        <main className="container w-50 mt-4">
            <div className="row d-flex flex-column justify-content-center">
                {todoHTML}
            </div>
        </main>
    )
}

export default ListTodo
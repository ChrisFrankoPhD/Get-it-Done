import {useEffect, useState} from "react";
import EditTodo from "./EditTodo";

const ListItem = ({todoObj, filterTodos, setTodosChange, idx, todos}) => {
    // console.log("ListItem");
    // console.log(todoObj);

    const deleteTodo = async (todoObj, filterTodos) => {
        try {
            const response = await fetch(`/dashboard/todos/${todoObj.todo_id}`, {
                method: "DELETE",
                headers: { token: localStorage.token }
            })
            const data = await response.json()

            filterTodos(todoObj.todo_id);

            // console.log(data);
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className={
            (idx + 1) === todos.length ? (
                "d-flex p-0 align-items-center"
            ) : (
                "d-flex border-bottom p-0 align-items-center"
            )
        } 
        >
            <div className="list-num col-1 p-2 text-center d-flex justify-content-center align-content-center flex-wrap">
                <h3 className="m-0">{idx + 1}</h3>
            </div>
            <div className="col-10 list-det lead d-flex align-content-center flex-wrap p-2 px-3">
                <p className="m-0 text-start">{todoObj.description}</p> 
            </div>
            <div className="col-1 d-flex flex-column">
                <EditTodo todoObj={todoObj} key={todoObj.todo_id} setTodosChange={setTodosChange} />
                <button className="btn btn-danger flex-grow-1 w-100 px-1" onClick={() => deleteTodo(todoObj, filterTodos)}>Delete</button>
            </div>
        </div>
    )
}

const ListTodo = ({ allTodos, setTodosChange }) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allTodos])
    
    const todoHTML = todos.map((todoObj, idx) => {
        const index = Number(idx)
        return (
            <ListItem todoObj={todoObj} key={idx} idx={idx} filterTodos={filterTodos} todos={todos} setTodosChange={setTodosChange} />
        )
    }) 

    return (
        <main className="container mt-4">
            <div className="row d-flex flex-column justify-content-center">
                {
                todos.length !== 0 && 
                    allTodos[0].todo_id !== null && 
                        (todoHTML)
                }
            </div>
        </main>
    )
}

export default ListTodo
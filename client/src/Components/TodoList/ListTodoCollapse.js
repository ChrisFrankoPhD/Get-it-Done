import {useEffect, useState} from "react";
import EditTodo from "./EditTodo";
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

const ListItem = ({todoObj, filterTodos, setTodosChange, idx, todos}) => {
    const [open, setOpen] = useState(false);

    console.log("ListItem");
    console.log(todoObj);

    const deleteTodo = async (todoObj, filterTodos) => {
        try {
            const response = await fetch(`/dashboard/todos/${todoObj.todo_id}`, {
                method: "DELETE",
                headers: { token: localStorage.token }
            })
            const data = await response.json()

            filterTodos(todoObj.todo_id);

            console.log(data);
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className={
            (idx + 1) === todos.length ? (
                "row p-0 align-items-center position-relative"
            ) : (
                "row border-bottom p-0 align-items-center position-relative"
            )
        } 
        >
            <div className="list-num col-1 p-2 text-center d-flex justify-content-center align-content-center flex-wrap">
                <h3 className="m-0">{idx + 1}</h3>
            </div>
            <div className="col-10 list-det lead d-flex align-content-center flex-wrap p-2 px-3">
                <p className="m-0 text-start">{todoObj.description}</p> 
            </div>
            <div className="col-1 d-flex justify-content-end align-items-center position-absolute p-0 top-0 bottom-0 end-0">
                <Button 
                    onClick={() => setOpen(!open)}
                    aria-controls="collapseExample"
                    aria-expanded={open}
                    className="w-100 collapse-button"
                >
                    <div className="h-100 w-100 d-flex justify-content-center align-items-center" >
                        <i className="fas fa-ellipsis-v fa-lg fs-2" style={{color: '#a910e0'}}></i>
                    </div>
                </Button>
                <Collapse in={open} dimension="width">
                        <div id="collapseExample" className="collapsible m-0 p-0 h-100">
                            <div className="d-flex flex-column justify-content-center h-100">
                                <EditTodo todoObj={todoObj} key={todoObj.todo_id} setTodosChange={setTodosChange} />
                                <div className="del-butt fs-6 fw-semibold mb-1 px-2" onClick={() => deleteTodo(todoObj, filterTodos)}>Delete</div>
                            </div>
                        </div>
                </Collapse>
                {/* <button className="btn btn-primary" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample" >...</button> */}
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
import {useEffect, useState} from "react";
import EditTodo from "./EditTodo";

const ListItem = ({todoObj, filterTodos, setTodosChange, idx, todos, modals, setModals}) => {
    // console.log("ListItem");
    // console.log(todoObj);

    const deleteTodo = async (todoObj, filterTodos) => {
        try {
            await fetch(`/dashboard/todos/${todoObj.todo_id}`, {
                method: "DELETE",
                headers: { token: localStorage.token }
            })

            filterTodos(todoObj.todo_id);

            // const data = await response.json()
            // console.log(data);
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className={
            (idx + 1) === todos.length ? (
                "d-flex p-0 align-items-center px-2 list-item"
            ) : (
                "d-flex p-0 align-items-center px-2 list-item border-bottom"
            )
        } 
        >
            <div className="list-num col-md-1 col-1 p-2 text-center d-flex justify-content-center align-content-center flex-wrap ">
                <h3 className="m-0">{idx + 1}</h3>
            </div>
            <div className="col-md-10 col-8 list-det lead d-flex align-content-center flex-wrap p-2 px-3">
                <p className="m-0 text-start">{todoObj.description}</p> 
            </div>
            <div className="col-3 col-md-1 d-flex flex-column align-items-center">
                <EditTodo todoObj={todoObj} key={todoObj.todo_id} setTodosChange={setTodosChange} idx={idx} modals={modals} setModals={setModals} />
                <button className="btn del-butt flex-grow-1 px-1 mb-3 mt-1" onClick={() => deleteTodo(todoObj, filterTodos)}><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    )
}

const ListTodo = ({ allTodos, setTodosChange, searchText }) => {
    const [todos, setTodos] = useState([])
    const [modals, setModals] = useState([])

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
        buildTodoHtml()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allTodos])

    const buildTodoHtml = () => {
        try {
            const tempTodoHtml = todos.map((todoObj, idx) => {
                return (
                    <ListItem todoObj={todoObj} key={idx} idx={idx} filterTodos={filterTodos} todos={todos} setTodosChange={setTodosChange} modals={modals} setModals={setModals} />
                )
            })
            return tempTodoHtml
        } catch (error) {
            console.error(error);
        }
        
    }

    // const todoHTML = todos.map((todoObj, idx) => {
    //     return (
    //         <ListItem todoObj={todoObj} key={idx} idx={idx} filterTodos={filterTodos} todos={todos} setTodosChange={setTodosChange} />
    //     )
    // }) 

    function renderTodoHtml() {
        const searchTodos = (query, componentList) => {
            let searchList = [];
            componentList.map((todoComp) => {
                const description = todoComp.props.todoObj.description.toLowerCase().trim();
                if (description.includes(query.toLowerCase().trim())) {
                    searchList.push(todoComp);
                };
            });
            return searchList;
        };

        const todoHTML = buildTodoHtml();
        if (!searchText.trim()) {
            return (
                <main className="container mt-4">
                    <div className="row d-flex flex-column justify-content-center">
                        {
                        allTodos.length !== 0 && 
                            allTodos[0].todo_id !== null &&
                                (todoHTML)
                        }
                    </div>
                </main>
            )
        } else {
            const searchTodoHTML = searchTodos(searchText, todoHTML);
            return (
                <main className="container mt-4">
                    <div className="row d-flex flex-column justify-content-center">
                        {
                        allTodos.length !== 0 && 
                            allTodos[0].todo_id !== null &&
                                (searchTodoHTML)
                        }
                    </div>
                </main>
            )
        }
    }

    return (renderTodoHtml())
    // return (
    //     <main className="container mt-4">
    //         <div className="row d-flex flex-column justify-content-center">
    //             {
    //             allTodos.length !== 0 && 
    //                 allTodos[0].todo_id !== null &&
    //                     (todoHTML)
    //             }
    //         </div>
    //     </main>
    // )
}

export default ListTodo
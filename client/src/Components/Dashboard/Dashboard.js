import InputTodo from '../TodoList/InputTodo';
import ListTodo from '../TodoList/ListTodo';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";

const Dashboard = ({ searchText, setAuth }) => {
    console.log("dashboard rendered");
    const [name, setName] = useState("");
    const [allTodos, setAllTodos] = useState([]);
    const [todosChange, setTodosChange] = useState(false)

    const getProfile = async () => {
        console.log(allTodos);
        try {
            const response = await fetch("/dashboard", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const data = await response.json();
            // console.log(data);
            if (!data[0].user_name) {
                setAuth(false)
                toast.error("You were automatically logged out after a period of inactivity, please log back in to continue")
            }
            setName(data[0].user_name)
            setAllTodos(data)
            console.log(allTodos);
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getProfile();
        setTodosChange(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todosChange, searchText])

    return (
        <>
            <main className="container text-center mt-4">
                <div className="row d-flex flex-column justify-content-center">
                    <div className='d-flex flex-column w-100 align-items-center p-0'>
                        <h1>{name}'s List</h1>
                    </div>
                    <InputTodo setTodosChange={setTodosChange} />
                    <ListTodo allTodos={allTodos} setTodosChange={setTodosChange} searchText={searchText} />
                </div>
            </main>
            
        </>
    );
};

export default Dashboard;
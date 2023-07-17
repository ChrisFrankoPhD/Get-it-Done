import { toast } from 'react-toastify';
import InputTodo from '../TodoList/InputTodo';
import ListTodo from '../TodoList/ListTodo';
import { useEffect, useState } from 'react';

const Dashboard = ({ setAuth }) => {
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
            console.log(data);

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
    }, [todosChange])

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        setAuth(false)
        toast.success("Logged Out")
    }

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
};

export default Dashboard;
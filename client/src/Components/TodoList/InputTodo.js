import {useState} from "react";

const InputTodo = ({ setTodosChange }) => {
    const [description, setDescription] = useState("");

    const updateDescription = (e) => {
        setDescription(e.target.value);
        // console.log(description);
    }

    const onSubmitForm = async (e) => {
        console.log("onSubmitForm");
        console.log(description);
        e.preventDefault();
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", localStorage.token);
            const body = { description };
            // console.log(body);
            // console.log(JSON.stringify(body));
            const response = await fetch("/dashboard/todos", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(body)
            });
            const data = await response.json();
            console.log(data);
            setTodosChange(true)
            setDescription("")
            // window.location = '/'
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div className="container">
            <div className="row text-center">
                <form className="w-100 mt-3 d-flex justify-content-center flex-grow-1" onSubmit={onSubmitForm} >
                    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center w-100">
                        <input className="todo-input form-control border-1" name="inputTodo" placeholder="What do you need ToDo?" value={description} onChange={updateDescription} />
                        <button className="btn btn-primary mt-2 mt-md-0 add-button" >Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default InputTodo
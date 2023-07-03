import {useState} from "react";

const InputTodo = () => {
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
            const body = { description };
            console.log(body);
            console.log(JSON.stringify(body));
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
}

export default InputTodo
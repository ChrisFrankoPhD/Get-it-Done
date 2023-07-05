import {useState} from "react";

const EditTodo = ({todoObj}) => {
    const [description, setDescription] = useState(todoObj.description);

    console.log("building EDITTODO");
    console.log(todoObj);

    const editDescription = (e) => {
        setDescription(e.target.value)
    }

    const onEdit = async (todoObj, e) => {
        console.log("onEdit");
        console.log(description);
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

    const modalID = `modal-${todoObj.todo_id}`;
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

export default EditTodo
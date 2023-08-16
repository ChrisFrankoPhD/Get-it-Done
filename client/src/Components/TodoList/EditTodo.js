import { useState } from "react";

const EditModal = ({ todoObj, setTodosChange, idx }) => {
  const [description, setDescription] = useState(todoObj.description);

//   console.log("building EditModal");
//   console.log(todoObj);

  const editDescription = (e) => {
    setDescription(e.target.value);
  };

  const resetDescription = (e) => {
    // console.log("reset Description, targets:");
    // console.log(e.target);
    // console.log(document.getElementById(`modal-${todoObj.todo_id}`));
    if (e.target === document.getElementById(`modal-${todoObj.todo_id}`)) {
      setDescription(todoObj.description);
    }
  };

  const onEdit = async (todoObj, e) => {
    // console.log("onEdit");
    e.preventDefault();
    try {
      const body = { description };
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      await fetch(`dashboard/todos/${todoObj.todo_id}`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(body),
      });
    //   const data = await response.json();
    //   console.log(data);
      setTodosChange(true)

      document.querySelector("body").classList.remove("modal-open");
      document.getElementById(`modal-${todoObj.todo_id}`).close()

    } catch (err) {
      console.error(err.message);
    }
  };

  const modalID = `modal-${todoObj.todo_id}`;
//   console.log(modalID);
  return (
    <dialog id={modalID} className="edit-modal" onClick={(e) => resetDescription(e)}>
      <form className="d-flex p-0 edit-form" onSubmit={(e) => onEdit(todoObj, e)}>
        <div className="list-num p-2 text-center d-flex justify-content-center align-content-center flex-wrap modal-idx">
          <h3 className="m-0">{idx + 1}</h3>
        </div>
        <div className="list-det lead d-flex flex-column justify-content-center py-2 px-3 w-100">
          <input
            className="form-control border-1"
            name="editTodo"
            value={description}
            onChange={editDescription}
          />
        </div>
        <div className="d-flex modal-buttons">
          <button className="btn px-1 my-2 modal-save fs-4"><i className="fa-regular fa-floppy-disk"></i></button>
          <button
            type="button"
            className="btn close px-1 my-2 align-self-end modal-close fs-4"
            onClick={() => setDescription(todoObj.description)}>
            <i className="fa-solid fa-circle-xmark"></i>
          </button>
        </div>
      </form>
    </dialog>
  );
};



const EditTodo = ({ todoObj, setTodosChange, idx }) => {
    const [editModal, setEditModal] = useState("");

    //   console.log("building EditTodo Button");
    //   console.log(todoObj);

    const renderEditModal = async (todoObj, idx) => {
        // console.log("renderEditModal:");
        // console.log(todoObj);
        const body = document.querySelector("body");

        console.log("constructing modal");
        const key = `modal-${todoObj.todo_id}`;
        await setEditModal(<EditModal todoObj={todoObj} key={key} setTodosChange={setTodosChange} idx={idx} />);

        const modal = document.getElementById(`modal-${todoObj.todo_id}`);
        modal.showModal();
        body.classList.add('modal-open')

        document.querySelector(`#modal-${todoObj.todo_id} .close`).addEventListener("click", () => {
            modal.close();
            body.classList.remove("modal-open");
        });

        document.querySelector(`body`).addEventListener("click", (e) => {
            // console.log(e.target);
            // console.log(document.getElementById(`modal-${todoObj.todo_id}`));
            if (e.target === document.getElementById(`modal-${todoObj.todo_id}`)) {
                console.log("clicked off modal");
                modal.close();
                document.querySelector("body").classList.remove("modal-open");
            }
        });
    }

  return (
    <>
      <button className="btn edit-butt flex-grow-1 mb-2 mt-3 px-1" onClick={() => renderEditModal(todoObj, idx)}><i className="fa-regular fa-pen-to-square"></i></button>
      {editModal}
    </>
  );
};

export default EditTodo;
import { useState } from "react";

const EditModal = ({ todoObj, setTodosChange, idx, scrollTop }) => {
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
      
      // document.querySelector("body").classList.remove("modal-open");


      // Alternative Solution for Modal Scroll Behaviour
      document.querySelector("html").classList.remove("noscroll");
      window.scrollTo({
        top: -scrollTop,
        left: 0,
        behavior: "instant",
      });
      document.querySelector("html").classList.remove("top");
      document.styleSheets[6].deleteRule(0)
      document.getElementById(`modal-${todoObj.todo_id}`).close()
      document.getElementById(`modal-${todoObj.todo_id}`).remove()

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
          <button className="btn flex-grow-1 px-1 mb-3 mt-1 modal-save fs-4"><i class="fa-regular fa-floppy-disk"></i></button>
          <button
            type="button"
            className="close py-1 px-2 align-self-end modal-close fs-4"
            onClick={() => setDescription(todoObj.description)}>
            <i class="fa-solid fa-circle-xmark"></i>
          </button>
        </div>
      </form>
    </dialog>
  );
};



const EditTodo = ({ todoObj, setTodosChange, idx, modals, setModals }) => {
  const [editModal, setEditModal] = useState("");

//   console.log("building EditTodo Button");
//   console.log(todoObj);

  const renderEditModal = async (todoObj, idx) => {
    // console.log("renderEditModal:");
    // console.log(todoObj);
    const html = document.querySelector("html");
    const body = document.querySelector("body");
    let scrollTop = -((html.scrollTop) ? (html.scrollTop) : (body.scrollTop));

    if (!modals.includes(todoObj)) {

      console.log("constructing modal");
      const key = `modal-${todoObj.todo_id}`;
      await setEditModal(<EditModal todoObj={todoObj} key={key} setTodosChange={setTodosChange} idx={idx} scrollTop={scrollTop} />);
      setModals(() => {
        modals.push(todoObj);
        return modals;
      })

      const modal = document.getElementById(`modal-${todoObj.todo_id}`);
      modal.showModal();

      document.querySelector(`#modal-${todoObj.todo_id} .close`).addEventListener("click", () => {
        // modal.close();
        // document.querySelector("body").classList.remove("modal-open");

        // Part of alternative solution
        modal.close();
        html.classList.remove("noscroll");
        window.scrollTo({
          top: -scrollTop,
          left: 0,
          behavior: "instant",
        });
        html.classList.remove("top");
        document.styleSheets[6].deleteRule(0)
        console.log(`close Modal ${idx + 1}`);
        console.log(`${document.styleSheets[6].cssRules[0].selectorText}, ${document.styleSheets[6].cssRules[1].selectorText}`);
      });

      document.querySelector(`body`).addEventListener("click", (e) => {
        // console.log(e.target);
        // console.log(document.getElementById(`modal-${todoObj.todo_id}`));
        if (e.target === document.getElementById(`modal-${todoObj.todo_id}`)) {
          // console.log("clicked off modal");
          // modal.close();
          // document.querySelector("body").classList.remove("modal-open");

          // Part of alternative solution
          html.classList.remove("noscroll");
          window.scrollTo({
            top: -scrollTop,
            left: 0,
            behavior: "instant",
          });
          html.classList.remove("top");
          document.styleSheets[6].deleteRule(0)
          modal.close();
          console.log(`close Modal ${idx + 1}`);
          console.log(`${document.styleSheets[6].cssRules[0].selectorText}, ${document.styleSheets[6].cssRules[1].selectorText}`);
        }
      });
    } else {

      document.getElementById(`modal-${todoObj.todo_id}`).showModal();
      document.styleSheets[6].insertRule(`html.top {top: ${scrollTop}px}`)
      if (document.documentElement.scrollHeight > window.innerHeight) {
        // html.style.setProperty('--st', -(scrollTop) + "px")
        html.classList.add("noscroll");
        html.classList.add("top");
        console.log(`open Modal ${idx + 1}`);
        console.log(`${document.styleSheets[6].cssRules[0].selectorText}, ${document.styleSheets[6].cssRules[1].selectorText}`);
      }
    }
  };

  return (
    <>
      <button className="btn edit-butt flex-grow-1 mb-2 mt-3 px-1" onClick={() => renderEditModal(todoObj, idx)}><i class="fa-regular fa-pen-to-square"></i></button>
      {editModal}
    </>
  );
};

export default EditTodo;
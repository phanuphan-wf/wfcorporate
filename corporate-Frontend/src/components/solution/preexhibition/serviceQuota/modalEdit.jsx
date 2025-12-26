import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { dataContext } from ".";

export default function ModalEdit(props) {
  const [edit, setEdit] = useState(0);

  useEffect(() => {
    setEdit(props.data.quota);
  }, [props.data]);

  const updataEdit = () => {
    if (edit != props.data.quota) {
      props.edit(props.data.id, edit);
    } else {
      props.onHide();
    }
  };

  return (
    <section
      className="modalEdit w-full h-screen bg-transparent absolute top-0 left-0"
      hidden={!props.show}>
      <div className="bg-white w-1/2 h-fit fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border shadow-lg rounded-xl">
        <header className="border-b px-4 py-4 text-amber-600 font-medium">
          Edit Service Quota
        </header>
        <div className="px-4 py-4">
          <p>Edit service quota of</p>
          <div className="mt-4">
            <label htmlFor="qty">{props.data.name} to </label>
            <input
              id="qty"
              className="w-16 text-center"
              value={edit}
              type="number"
              onChange={(e) => setEdit(e.target.value)}
            />
          </div>
        </div>
        <footer className="flex items-center justify-between py-4 px-4">
          <button className="btn-gray px-2" onClick={() => props.onHide()}>
            Cancel
          </button>
          <button className="btn-green px-4" onClick={updataEdit}>
            Save
          </button>
        </footer>
      </div>
    </section>
  );
}

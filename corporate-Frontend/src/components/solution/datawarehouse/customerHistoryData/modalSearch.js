import React, { useContext, useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

export default function ModalSeach(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_chd;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [search, setSearch] = useState({ customerID: "", Name: "" });
  const [customer, setCustomer] = useState([]);

  const searchClick = async (name) => {
    if (name != "") {
      const res = await Axios.get(url + "/getCustomer/" + name).then((res) => {
        setCustomer(res.data);
      });
    } else {
      setCustomer([]);
    }
  };

  useEffect(() => {
    setSearch({ ...search, Name: props.search });
  }, [props.search]);

  useEffect(() => {
    if (props.show) {
      searchClick(search.Name);
    }
  }, [props.show]);

  const nameClick = (id, cname) => {
    props.fill(id, cname);
  };

  const pressEnter = (e) => {
    if (e.key == "Enter") {
      searchClick(search.Name);
    }
  };

  useEffect(() => {
    if (search.Name == "") {
    }
  }, [search]);

  useEffect(() => {
    //console.log(customer);
  }, [customer]);

  return (
    <div>
      <div
        id="staticModal"
        data-modal-backdrop="static"
        tabIndex="-1"
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full ${
          props.show ? "" : "hidden"
        }`}
      >
        <div className="relative w-full max-w-3xl md:max-w-xl lg:max-w-3xl max-h-full top-[100px] left-1/2 md:left-[calc(50%+120px)] -translate-x-1/2">
          {/*-- Modal content --*/}
          <div className="relative bg-white rounded-lg shadow">
            {/*-- Modal header --*/}
            <div className="p-4 border-b rounded-t">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Customer Search
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-hide="staticModal"
                  onClick={props.onHide}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="flex gap-2">
                <label for="searchtxt">Customer Name: </label>
                <input
                  id="searchtxt"
                  className="w-1/2"
                  onChange={(e) =>
                    setSearch({ ...search, Name: e.target.value })
                  }
                  value={search.Name}
                  onKeyDown={(e) => pressEnter(e)}
                />
                <div
                  className="btn-primary px-2"
                  onClick={() => searchClick(search.Name)}
                >
                  Search
                </div>
              </div>
            </div>

            {/*-- Modal body --*/}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-scroll">
              <ul>
                {customer.map((c) => (
                  <li
                    onClick={() => nameClick(c.customerID, c.name)}
                    className="cursor-pointer w-fit"
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
            {/*-- Modal footer --*/}
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b justify-between">
              <button
                data-modal-hide="staticModal"
                type="button"
                className="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={props.onHide}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
      {props.show && (
        <div
          modal-backdrop=""
          class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"
        ></div>
      )}
    </div>
  );
}

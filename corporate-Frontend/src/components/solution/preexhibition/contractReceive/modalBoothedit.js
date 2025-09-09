import React, { useState, useEffect } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { CgArrowLongRightR } from "react-icons/cg";

export default function ModalBoothedit(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctr;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [history, setHistory] = useState({});
  const [newBooth, setNewBooth] = useState("");

  useEffect(() => {
    if (props.show && props.txtChange) {
      setHistory(props.txtChange);
    }
  }, [props.show]);

  const submitChange = async () => {
    try {
      const res = await Axios.put(
        url + "/boothChange/" + history.hid + "/" + newBooth
      ).then((r) => {
        if (r.status === 200) {
          props.confirm(true);
        }
      });
    } catch (e) {
      if (e.response.status == 404) {
        alert("Booth not found, please add new booth first");
      } else if (e.response.status === 409) {
        alert("Booth already taken");
      } else {
        alert("Error! - cannot change booth, please contact admin");
      }
    }
  };

  useEffect(() => {
    //console.log(history);
  }, [history]);

  useEffect(() => {
    //console.log(newBooth);
  }, [newBooth]);

  return (
    <div
      id="modal-sale-change"
      className={`fixed top-0 left-0 w-screen h-screen z-30 ${
        props.show ? "" : "hidden"
      }`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 bg-white rounded-md border shadow-md px-4 py-3">
        <div className="flex justify-between pb-3 border-b">
          <div>
            <h4 className="text-lg text-green-600 font-medium">
              Change Booth Location
            </h4>
          </div>
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
        <div className="p-4">
          <p>Please fill new available booth number to change</p>
          <div className="flex gap-4 mt-4 justify-center items-center">
            <div>
              <p>old Booth Number : {props.txtChange.booth}</p>
            </div>
            <div className="text-3xl text-yellow-500">
              <CgArrowLongRightR />
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="booth" className="block font-medium">
                new Booth Number :
              </label>
              <input
                type="text"
                id="booth"
                name="booth"
                className="mt-1 focus:ring-red-500 focus:border-white block border-gray-300 rounded-md text-red-600 w-28"
                onChange={(e) => setNewBooth(e.target.value.toUpperCase())}
                value={newBooth}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <div className="flex gap-4">
            <button
              className="btn-primary px-2"
              onClick={() => {
                setNewBooth("");
                props.confirm(false);
              }}
            >
              Cancel
            </button>
            <button className="btn-green px-2" onClick={() => submitChange()}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

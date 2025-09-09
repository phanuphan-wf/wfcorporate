import React from "react";

export default function ModalDelSign(props) {
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
            <h4 className="text-lg text-red-500 font-medium">
              Confirm Delete Product
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
          <p>
            Please confirm to delete this product -{" "}
            <font className="text-red-500">{props.txtDel.name}</font>
          </p>
        </div>
        <div className="flex justify-end mb-4">
          <div className="flex gap-4">
            <button
              className="btn-primary px-2"
              onClick={() => props.confirmDel(false)}
            >
              Cancel
            </button>
            <button
              className="btn-green px-2"
              onClick={() => props.confirmDel(true)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function ModalInfo(props) {
  return (
    <div
      id="modal-info"
      className="fixed w-full h-full bg-slate-600 bg-opacity-50 top-0 left-0"
      hidden={!props.show}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-md md:w-1/3 w-full">
        <div id="header" className="border-b">
          <div id="title" className="py-2">
            {props.text.header}
          </div>
        </div>
        <div id="body" className="py-4">
          {props.text.body}
        </div>
        <div id="footer" className="py-2 flex justify-end">
          <button className="btn-primary px-2" onClick={props.close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

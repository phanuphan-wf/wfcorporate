import React from "react";
import { dataContext } from "./report";



const PrintButton = ({ event, onPrint }) => {
  return (
    <div className="flex justify-end mt-4">
      <button
        className="btn-primary px-2 py-1 rounded"
        onClick={() => onPrint(event)} // ส่งค่า event กลับไป
        disabled={!event} // ป้องกันกดก่อนมีค่า
      >
        Print Report
      </button>
    </div>
  );
};

export default PrintButton;


import React, { useContext, useState, useEffect } from "react";
import { dataContext } from "./smsNumber";

function NumberType(props) {
  const { url, exTypeC } = useContext(dataContext);

  const [exType, setExType] = exTypeC;

  return (
    <div className="border rounded-lg px-4 py-2 border-gray-300 relative">
      <div className="absolute -top-[12px] left-5 bg-white px-4">
        <h2 className="font-medium">SMS Type</h2>
      </div>
      <div className="mt-4">
        <input
          type="radio"
          id="Exhibitor"
          className="accent-red-500 size-4"
          name="type"
          onChange={(e) => setExType("ex")}
          checked={exType === "ex"}
        />
        <label htmlFor="Exhibitor" className="ml-2">
          Exhibitor Number
        </label>
      </div>
      <div className="mt-2">
        <input
          type="radio"
          id="buyer"
          className="accent-red-500 size-4"
          name="type"
          onChange={(e) => setExType("buy")}
          checked={exType === "buy"}
        />
        <label htmlFor="buyer" className="ml-2">
          Buyer Number
        </label>
      </div>
      <div className="mt-2">
        <input
          type="radio"
          id="visitor"
          className="accent-red-500 size-4"
          name="type"
          onChange={(e) => setExType("vis")}
          checked={exType === "vis"}
        />
        <label htmlFor="visitor" className="ml-2">
          Visitor Number
        </label>
      </div>
    </div>
  );
}

export default NumberType;

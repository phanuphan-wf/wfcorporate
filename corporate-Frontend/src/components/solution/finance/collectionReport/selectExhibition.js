// src/components/solution/finance/collectionReport/selectExhibition.js
import React from "react";

function SelectExhibition() {
  return (
    <section id="select-exhibition">
      <div className="border border-zinc-300 rounded-md relative mt-6 p-4 bg-white">
        {/* Header */}
        <div className="absolute bg-white px-2 py-1 -top-3 left-4 text-red-600 font-semibold">
          Exhibition
        </div>

        <div className="flex flex-col space-y-4">
          {/* Exhibition Name */}
          <div className="flex items-center gap-3">
            <label htmlFor="eName" className="w-40 font-medium">
              Exhibition Name
            </label>
            <select
              id="eName"
              className="border border-zinc-300 rounded-md p-2 flex-1"
              defaultValue="0"
            >
              <option value="0">----</option>
              <option value="1">Exhibition 1 (EX1)</option>
              <option value="2">Exhibition 2 (EX2)</option>
            </select>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-3">
            <label htmlFor="vName" className="w-40 font-medium">
              Venue
            </label>
            <span>Hall A, Bangkok</span>
          </div>

          {/* During */}
          <div className="flex items-center gap-3">
            <label htmlFor="during" className="w-40 font-medium">
              During
            </label>
            <span>01/10/2025 - 05/10/2025</span>
          </div>

          {/* Checkbox */}
          <div className="flex justify-end items-center gap-2">
            <input
              type="checkbox"
              id="eFinish"
              className="accent-red-500 w-4 h-4"
            />
            <label htmlFor="eFinish" className="select-none">
              Show Finished Exhibition
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelectExhibition;

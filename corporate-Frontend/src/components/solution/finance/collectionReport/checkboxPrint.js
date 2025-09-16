// src/components/solution/finance/collectionReport/checkboxPrint.js
import React from "react";

function CheckboxPrint() {
  return (
    <section id="checkbox-print">
      <div className="border border-zinc-300 rounded-md relative">
        <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600">
          Print Options
        </div>
        <div className="flex justify-between gap-6 px-3 py-4">
          {/* Print all, Without Sales, Without Zones, Summary */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="chk1"
                className="size-4 accent-red-500 mr-2"
              />
              <label htmlFor="chk1" className="md:text-lb">
                Print all
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="chk2"
                className="size-4 accent-red-500 mr-2"
              />
              <label htmlFor="chk2" className="md:text-lb">
                Without Seperate Sales Rep
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="chk3"
                className="size-4 accent-red-500 mr-2"
              />
              <label htmlFor="chk3" className="md:text-lb">
                Without Seperate Zones
              </label>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="chk4"
              className="size-4 accent-red-500 mr-2"
            />
            <label htmlFor="chk4" className="md:text-lb">
              Summary Report
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CheckboxPrint;

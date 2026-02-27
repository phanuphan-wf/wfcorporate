import { useState, useEffect, useContext } from "react";

// import Axios from "axios";
// import ModalSeach from "./modalSearch";

export default function Filter() {
 

  return (
    <section id="checkbox-print">
      <div className="border border-zinc-300 rounded-md relative mt-6">
        <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600">
          Filter
        </div>

        <div className="flex flex-col px-3 py-4 space-y-3">
          {/* By Sales */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="bySales"
              className="flex items-center font-medium gap-2 w-36">
              By Sales :
            </label>
            {/* <select
              id="bySales"
              className="border rounded-md p-1.5 w-full md:w-100"
              disabled={isDisabled}
            //   value={filter.sales || ""}
              onChange={(e) => setFilter({ ...filter, sales: e.target.value })}>
              <option value="0">All sales</option>
              {sales.map((s, i) => (
                <option key={i} value={s.eid}>
                  {s.name}
                </option>
              ))}
            </select> */}
          </div>

          {/* By Zone */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="byZone"
              className="flex items-center font-medium gap-2 w-36">
              By Zone :
            </label>
            {/* <select
              className="border rounded-md p-1.5 w-full md:w-100"
              id="cmbExhibition"
              value={filter.zone || ""}
              onChange={(e) => setFilter({ ...filter, zone: e.target.value })}
              disabled={isDisabled}>
              <option value="0">All Zone</option>
              {zones.map((z, i) => (
                <option key={i} value={z.zid}>
                  {z.zone}
                </option>
              ))}
            </select> */}
          </div>           
         
        </div>
        
      </div>   



    </section>
  );
}

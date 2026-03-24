import { useState, useEffect, useContext } from "react";
import Axios from "axios";

import { CgMoreO } from "react-icons/cg";

// import ModalSeach from "./modalSearch";

export default function Filter() {
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({
      sales: "0",
      zone: "0"
  });

  return (

    <div className="p-4">
        <button
          className={`rounded-md py-0.5 text-white mt-4 ${
            !showFilter ? "bg-green-600 px-2" : "bg-red-500 px-3"
          } flex items-center gap-2`}
          onClick={() => setShowFilter(!showFilter)}
        >
          {!showFilter ? (
            <>
              <CgMoreO /> <span>Filter</span>
            </>
          ) : (
            <span>Close panel</span>
          )}
      </button>
      

      {showFilter && (
        
          <section id="Filter-By">
            <div className="border border-zinc-300 rounded-md relative mt-6 p-4 bg-white">
              <div className="absolute bg-white px-2 py-1 -top-3 left-4 text-red-600 font-semibold">
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
                  <select
                    id="bySales"
                    className="border rounded-md p-1.5 w-full md:w-100"
                    // disabled={isDisabled}
                  >
                  </select>
                </div>

                {/* By Zone */}
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="byZone"
                    className="flex items-center font-medium gap-2 w-36">
                    By Zone :
                  </label>
                   <select
                    className="border rounded-md p-1.5 w-full md:w-100"
                    id="cmbExhibition"
                    value={filter.zone || ""}
                    >
                  </select>
                </div> 
              </div>
            </div>  
          </section>
        )}
    </div>
  );
}
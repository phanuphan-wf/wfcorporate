import React, { useState } from "react";
import AppRouteFinance from "../../../../AppRouteFinance";

import SelectExhibition from "./selectExhibition";
import PrintOptions from "./PrintOptions";
import Filter from "./Filter";

import { CgMoreO } from "react-icons/cg";

import Axios from "axios";

export default function CollectionReport() {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <section className="2xl:container pt-3 pb-5 px-5">
      <h1 className="text-xl font-semibold mb-2">Collection Report</h1>

      {/* Exhibition Section */}
      <SelectExhibition />

      {/* Print Options */}
      <PrintOptions />

      {/* Filter Button */}
      
      
      <button
        className={`rounded-md py-0.5 text-white mt-4 ${
          !showFilter ? "bg-green-600 px-2" : "bg-red-500 px-3"
        } flex items-center gap-2`}
        onClick={() => setShowFilter(!showFilter)}
      >
        {!showFilter ? (
          <>
            <CgMoreO />
            <span>Filter</span>
          </>
        ) : (
          <span>Close panel</span>
        )}
      </button>

      {/* Filter Section */}
      {showFilter && <Filter />}

      {/* Print Report Button */}
      <div className="flex justify-end mt-6">
        <button className="btn-primary px-2">
          Print Report
        </button>
      </div>
    </section>
  );
}

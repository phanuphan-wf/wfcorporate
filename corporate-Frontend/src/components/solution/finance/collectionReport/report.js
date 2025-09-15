import React, { useState, createContext } from "react";
import AppRouteFinance from "../../../../AppRouteFinance";

import SelectExhibition from "./selectExhibition";
import PrintOptions from "./PrintOptions";
import Filter from "./Filter";
import PrintReport from "./PrintReport";

import { CgMoreO } from "react-icons/cg";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

// สร้าง context
export const dataContext = createContext();

function CollectionReport(props) {
  const [showFilter, setShowFilter] = useState(false);
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cht;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [exhibition, setExhibition] = useState({});
  const [customer, setCustomer] = useState([]);
  const [data, setData] = useState([]);

  return (
    <dataContext.Provider
      value={{
        exhibitionC: [exhibition, setExhibition],
        customerC: [customer, setCustomer],
        dataC: [data, setData],
      }}
    >
      <section className="2xl:container pt-1 pb-5 px-5">
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
        <PrintReport/>
        
      </section>
    </dataContext.Provider>
  );
}

export default CollectionReport;

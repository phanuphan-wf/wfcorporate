import { useState, useEffect, createContext, useRef, useCallback, useContext, useMemo} from "react";
import Axios from "axios";

import SelectExhibition from "./selectExhibition";
import PrintOptions from "./PrintOptions";
import Filter from "./Filter";
// import Print_all from "./Print_all";
// import Without_Zones from "./Without_Zones";
// import Without_Sales from "./Without_Sales";
// import Summary_Report from "./Summary_Report";

import { CgMoreO } from "react-icons/cg";
//import Print_PDF from "./Print_PDF";


export const dataContext = createContext();

function CollectionReport() {
  const initFilter = {
    exID: "",
    sales: "",
    customerid: "",
    customername: "",
    zone: "",
    payment: "", 
  };


  const [filter, setFilter] = useState(initFilter);
  const [printOption, setPrintOption] = useState([]);
  //console.log(filter);
  //console.log(printOption);

  const [showFilter, setShowFilter] = useState(false);   


  // ================== 🧾 ส่วนแสดงผล ==================
  return (

      <dataContext.Provider
          value={{
            filterC: [filter, setFilter],
            PrintOptionsC: [printOption, setPrintOption]
          }}
      >

      <section className="2xl:container pt-1 pb-5 px-5">
        
        <h1 className="text-xl font-semibold mb-2">Collection Report</h1>

        <SelectExhibition/>
      
        <PrintOptions/>

        {/* Filter Button */}
        <button
          className={`rounded-md py-1 px-3 text-white mt-4 flex items-center gap-2 transition-colors ${
            showFilter ? "bg-red-500" : "bg-green-600"
          }`}
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? (
            <>
              <CgMoreO /> 
              <span>Close panel</span>
            </>
          ) : (
            <>
              <CgMoreO />
              <span>Filter</span>
            </>
          )}
        </button>

        {/* Filter Section */}
        {showFilter && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50 shadow-sm animate-fade-in">
            {/* <Filter /> */}
          </div>
        )}


      </section>
    </dataContext.Provider>
  );
}

export default CollectionReport;

import { useState, useEffect, createContext, useRef, useCallback, useContext, useMemo} from "react";
import Axios from "axios";

import SelectExhibition from "./selectExhibition";
import PrintOptions from "./PrintOptions";
import Filter from "./Filter";
// import Print_all from "./Print_all";
// import Without_Zones from "./Without_Zones";
// import Without_Sales from "./Without_Sales";
// import Summary_Report from "./Summary_Report";


//import Print_PDF from "./Print_PDF";


export const dataContext = createContext();

function CollectionReport() {
  const initFilter = {
    exID: "",
    sales: "0",  
    zone: "0",
    customer: "0",
    payment: "0", 
  };


  const [filter, setFilter] = useState(initFilter);
  const [printOption, setPrintOption] = useState([]);
 
   console.log(filter);
  //console.log(printOption);
  const [reportlist, setReportlist] = useState([]);
  //console.log(reportlist);
  
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;  
  
  const getReport = async (params) => {
    try {     
      const res = await Axios.post(url + "/getReport",params);  
      if (res.status === 200) {
        setReportlist(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  }; 

  useEffect(() => {  
    if (filter.exID !== "") {
      getReport(filter);
    } else {
      setReportlist([]); 
    }
  }, [filter.exID]); 

  // ================== 🧾 ส่วนแสดงผล ==================
  return (

      <dataContext.Provider
          value={{
            filterC: [filter, setFilter],
            PrintOptionsC: [printOption, setPrintOption],
            reportC: [reportlist, setReportlist],
          }}
      >

        <section className="2xl:container pt-1 pb-5 px-5">
          
          <h1 className="text-xl font-semibold mb-2">Collection Report</h1>

          <SelectExhibition/>
        
          <PrintOptions/>
        
          <Filter/>    

        </section>

      </dataContext.Provider>
  );
}

export default CollectionReport;

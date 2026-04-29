import { useState, useEffect, createContext, useRef, useCallback, useContext, useMemo} from "react";
import Axios from "axios";

import SelectExhibition from "./selectExhibition";
import PrintOptions from "./PrintOptions";
import Filter from "./Filter";
import Print_all from "./Print_all";
import Without_Zones from "./Without_Zones";
import Without_Sales from "./Without_Sales";
import Summary_Report from "./Summary_Report";


import PrintReport from "./PrintReport";


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

  const exdata = {   
    exName:"",      
    exDate: "",
    venue: "", 
    data: "",
  };

  const [event, setEvent] = useState(exdata); 

  useEffect(() =>{
    console.log(event);    
  },[event]);

  const [printOption, setPrintOption] = useState([]);   
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState(0);

  const handlePreview = () => {
    setShowPreview(true);
    setPreview((prev) => prev + 1); 
  };

  const [payment,setPayment] = useState(0);  
  
  //const [reportlist, setReportlist] = useState([]);
  //console.log(reportlist);   
  const [reportlist, setReportlist] = useState([]);
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;
  const pdfRef = useRef(null);


  // 1. ฟังก์ชันดึงข้อมูลจาก API
  const getReport = async (params) => {
    if (!filter.exID) return;
    try {
      const res = await Axios.post(url + "/getReport", params);
      if (res.status === 200) {
        setReportlist(res.data);
      }
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  // เรียก API เมื่อกดปุ่ม Preview
  useEffect(() => {
    if (preview) {
      getReport(filter);
    }
  }, [preview]); // ทำงานเมื่อ preview เปลี่ยนเป็น true


  useEffect(() => {
    if(filter.exID == "") {     
      setFilter(initFilter); 
      setReportlist([]);
      setPayment(0);
    }
  }, [filter.exID]);

   useEffect(() => {
     //console.log(filter);
   }, [filter]);

   useEffect(() => {
     //console.log(printOption);
   }, [printOption]);

   useEffect(() => {
     //console.log(payment);
   }, [payment]);

  // ================== 🧾 ส่วนแสดงผล ==================
  return (

      <dataContext.Provider
          value={{
            reportC: [reportlist, setReportlist],
            eventC: [event, setEvent],
            filterC: [filter, setFilter],
            PrintOptionsC: [printOption, setPrintOption],  
            paymentC: [payment, setPayment],
          }}
      >

        <section className="2xl:container pt-1 pb-5 px-5">
          
          <h1 className="text-xl font-semibold mb-2">Collection Report</h1>

          <SelectExhibition/>
        
          <PrintOptions/>
        
          <Filter/>   

          <div className="flex justify-end mt-4 gap-2">
              <button
                className="btn-primary px-3 py-1 rounded"
                onClick={handlePreview}
              >
               Preview
              </button>            

              <PrintReport pdfRef={pdfRef}/>

          </div>

          <div ref={pdfRef} className="mt-4">

            {(printOption?.printOption?.printAll === true) && (
              <Print_all preview={preview} />
            )}

            {(printOption?.printOption?.wSale === true) && (
              <Without_Sales preview={preview} />
            )}                    
                        
            {(printOption?.printOption?.wZone === true) && (
              <Without_Zones preview={preview} />
            )}            

            {(printOption?.printOption?.sumReport === true) && (
              <Summary_Report preview={preview} />
            )}
           
          </div>
          

        </section>

      </dataContext.Provider>
  );
}

export default CollectionReport;

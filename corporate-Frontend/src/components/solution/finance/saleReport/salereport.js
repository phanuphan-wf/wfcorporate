import React, { useState, useEffect, createContext, useRef} from "react";
import SelectExhibition from "./selectExhibition";
import PrintOptions from "./printOptions";
import Filter from "./filter";

import Print_all from "./Print_all";
import Without_Zones from "./Without_Zones";
import PrintReport from "./PrintReport";

import SumSale from "./SaleSum";
import SaleSum from "./SaleSum";


import { IoChevronBackOutline } from "react-icons/io5";

export const dataContext = createContext();

export default function SaleReport() { 
  
  const initFilter = {
    exID: "",
    Print_all: "",
    Without_Zones: "",
    sales: "",   
    zone: "",   
  };

  const [filter, setFilter] = useState(initFilter); 

  const isDisabled =!filter.exID || filter.exID === ""; 
  

  // useEffect(() => {
  //    console.log(filter);
  // }, [filter]); 


  const eventData = {
    exName:"",
    exDate:"",
    venue:"",    
    date: "",
  }

  const [event, setEvent] = useState(eventData);

  //console.log(event);

  // useEffect(() => {
  //    console.log(event);
  // }, [event]);

  const salesData = {
    salesID:"",
    salesName:"",
  }

  const [sales, setSales] = useState(salesData);

  
  // useEffect(() => {     
  //   console.log(sales); 
  // }, [sales]);


  const pdfRef = useRef(null);



 return (
    <section className="2xl:container pt-1 pb-5 px-5">
      <h1 className="text-xl font-semibold mb-2">Sales Report</h1>         

      <dataContext.Provider 
           value={{ 
              filterC: [filter, setFilter],
              eventC: [event, setEvent],
              salesC: [sales, setSales], 
           }}      
      >        
       
          <SelectExhibition/>
        
          <PrintOptions />
      
          <Filter />

          <div className="flex justify-end mt-4 gap-2">         

             {sales.salesID && (
                <button
                  onClick={() => setSales(salesData)}
                  className="px-4 py-1.5 rounded-md font-medium btn-primary active:scale-95 inline-flex items-center gap-1"
                > <IoChevronBackOutline /> Back
                </button>
             )}

           
            {filter.exID && <PrintReport pdfRef={pdfRef}/>}                

          </div>           
          
          <div ref={pdfRef}>

              {filter.exID && !sales.salesID && (
                filter.Print_all ? <Print_all /> : <Without_Zones />
              )}  

              {sales.salesID && <SaleSum />}

        
              
          </div>
          
        
      </dataContext.Provider>

    </section>
  );
}
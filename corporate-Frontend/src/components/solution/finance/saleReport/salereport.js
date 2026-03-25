import React, { useState, useEffect, createContext} from "react";
import SelectExhibition from "./selectExhibition";
import PrintOptions from "./printOptions";
import Filter from "./filter";

import Print_all from "./Print_all";
import Without_Zones from "./Without_Zones";

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
 
  const [showPreview, setShowPreview] = useState(false);


  const handlePreview = () =>{
    setShowPreview(true);
  }

  const isDisabled =!filter.exID || filter.exID === ""; 

  useEffect(() => {
    if (isDisabled) {
      setShowPreview(false);
    }   
  },[isDisabled]);

  
  useEffect(() =>{
    if (filter.exID) {
       setShowPreview(false);
    }
  },[filter]);

  useEffect(() => {
     console.log(filter);
  }, [filter]);



 return (
    <section className="2xl:container pt-1 pb-5 px-5">
      <h1 className="text-xl font-semibold mb-2">Sale Report</h1>         

      <dataContext.Provider 
           value={{ 
              filterC: [filter, setFilter]
           }}      
      >        
       
          <SelectExhibition/>
        
          <PrintOptions />
      
          <Filter />

         <div className="flex justify-end mt-4 gap-2"> 

            <button
              disabled={isDisabled}
              onClick={handlePreview}
              className={`px-4 py-1.5 rounded-md transition-colors font-medium ${
                isDisabled 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "btn-primary active:scale-95"
              }`}
            >
              Preview
            </button> 

            <button
              disabled={isDisabled}
             // onClick={handlePreview}
              className={`px-4 py-1.5 rounded-md transition-colors font-medium ${
                isDisabled 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "btn-primary active:scale-95"
              }`}
            >
                 Print Report
            </button> 
            

          </div>

          {showPreview && (
            filter.Print_all ? <Print_all /> : <Without_Zones />
          )}
          
        
      </dataContext.Provider>

    </section>
  );
}
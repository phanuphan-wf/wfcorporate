import React, { useState, useEffect, createContext} from "react";
import SelectExhibition from "./selectExhibition";
import PrintOptions from "./printOptions";
import Filter from "./filter";
import Print_all from "./Print_all";


import { CgMoreO } from "react-icons/cg";

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
  const [showFilter, setShowFilter] = useState(false);  
  
  
  // useEffect(() => {
  //    console.log(filter);
  // }, [filter]);

  

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

          <Print_all/>
        
      </dataContext.Provider>

    </section>
  );
}
import React, { useState, useEffect } from "react";
import SelectExhibition from "./selectExhibition";
import PrintOptions from "./printOptions";
import Filter from "./filter";

import { CgMoreO } from "react-icons/cg";

export default function SaleReport() {  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilter, setShowFilter] = useState(false);  

  useEffect(() => {
    
  }, []);

  

  return (
    <section className="2xl:container pt-1 pb-5 px-5">
        <h1 className="text-xl font-semibold mb-2">Sale Report</h1>
        
        {/* Exhibition Section*/}
        <SelectExhibition onSelect={(data) => setSelectedEvent(data)} />

        {/* PrintOption Section*/}
        <PrintOptions/>               
     
         
        <button
            className={`rounded-md py-0.5 text-white mt-4 ${
                 !showFilter ? "bg-green-600 px-2" : "bg-red-500 px-3"
            } flex items-center gap-2`}
            onClick={() => setShowFilter(!showFilter)}>
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

    </section>


  );
}
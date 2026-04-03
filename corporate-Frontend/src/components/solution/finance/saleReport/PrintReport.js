
import React, { useCallback, useContext } from "react";
import { dataContext } from "./salereport";


export default function PrintReport({pdfRef}) {
  const {filterC} = useContext(dataContext);
  const [filter] = filterC;

  const isDisabled = !filter.exID || filter.exID === ""; 

    return(
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
    );    
}


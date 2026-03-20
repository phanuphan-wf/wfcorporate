import { useContext, useEffect, useState } from "react";
import { dataContext } from "./report";

export default function PrintOptions() {
  const {filterC,PrintOptionsC} = useContext(dataContext);
  const [filter] = filterC;
  const [printOption, setPrintOption] = PrintOptionsC;

  const isDisabled = !filter.exID || filter.exID === "";

  // ✅ กำหนดค่าเริ่มต้น
  const [print, setPrint] = useState({
    printAll: true,
    wSale:  false,
    wZone: false,
    sumReport: false   
  });  

  
  const [nameCheckbox, setNameCheckbox] = useState([]);  

  //console.log(nameCheckbox);

  const handleCheckbox = (name) => {
    setNameCheckbox((prev) => {
      
      if (name === "printAll") return ["printAll"];
      if (name === "sumReport") return ["sumReport"];

      
      if (name === "wSale" || name === "wZone") {
       
        const filtered = prev.filter(item => item !== "printAll" && item !== "sumReport");

        if (filtered.includes(name)) {          
          const updated = filtered.filter(item => item !== name);       
          return updated.length === 0 ? ["printAll"] : updated;
        } else {
         
          return [...filtered, name];
        }
      }

      return prev;
    });
  };
  
  useEffect(() => {
    const printAll = nameCheckbox.includes("printAll");
    const wSale = nameCheckbox.includes("wSale");
    const wZone = nameCheckbox.includes("wZone");
    const sumReport = nameCheckbox.includes("sumReport");

    if (sumReport) {        
        setPrint({ printAll: false, 
                     wSale: false,
                     wZone: false,
                     sumReport: true 
                  });
      
    }else if (wSale || wZone) {
        setPrint({ printAll: false, 
                     wSale: wSale,
                     wZone: wZone,
                     sumReport: false
                  });

    }else{
        setPrint({ printAll: true, 
                     wSale: false,
                     wZone: false,
                     sumReport: false 
                });
    }
  }, [nameCheckbox]);

   
  useEffect(() => {
      setPrintOption((prev) => ({
        ...prev,
        printOption : print
      }));
  }, [print, setPrintOption]);

  return (
    <section id="print-options" className={isDisabled ? "opacity-50 pointer-events-none" : "opacity-100"}>
      <div className="border border-zinc-300 rounded-md relative mt-6 p-4 bg-white">
        {/* Header */}
        <div className="absolute bg-white px-2 py-1 -top-3 left-4 text-red-600 font-semibold">
          Print Options
        </div>

        {/* Checkboxes */}
        <div className="flex items-center justify-between max-md:flex-col">
          <div className="flex flex-wrap gap-6 mt-4">
            {/* Print all */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-500 w-4 h-4"
                checked={print.printAll}
                onChange={() => handleCheckbox("printAll")}
              />
              Print all
            </label>

            {/* Without Sales */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-500 w-4 h-4"
                checked={print.wSale}
                onChange={() => handleCheckbox("wSale")}
              />
              Without Sales
            </label>

            {/* Without Zones */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-500 w-4 h-4"
                checked={print.wZone}
                onChange={() => handleCheckbox("wZone")}
              />
              Without Zones
            </label>
          </div>

          {/* Summary Report */}
          <label className="flex items-center gap-2 cursor-pointer mt-4 md:mt-0">
            <input
              type="checkbox"
              className="accent-red-500 w-4 h-4"
              checked={print.sumReport}
              onChange={() => handleCheckbox("sumReport")}
            />
            Summary Report
          </label>
        </div>
      </div>
    </section>
  );
}

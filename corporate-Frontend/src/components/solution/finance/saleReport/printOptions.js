import React, { useState, useEffect, useContext } from "react";
import { dataContext } from "./salereport";

export default function PrintOptions() {

  const { filterC } = useContext(dataContext);
  const [filter, setFilter] = filterC;

  const [print, setPrint] = useState({
    Print_all: true,
    Without_Zones: false,
  });

  useEffect(() => {
    //console.log("Print Options:", print);
  }, [print]);

  // ฟังก์ชันช่วยจัดการการเปลี่ยนค่า
  const CheckboxChange = (name) => {

    if (name == "Without_Zones") {
        setPrint ({
            Print_all: false,
            Without_Zones: true,
        });
    }else{
        setPrint ({
            Print_all: true,
            Without_Zones: false,
        });
    }   
    
  };


  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
       Print_all: print.Print_all,
       Without_Zones: print.Without_Zones,   
    }));
  },[print, setFilter]);
 

  return (
    <section id="print-options">
      <div className="border border-zinc-300 rounded-md relative mt-6 p-4 bg-white">
        <div className="absolute bg-white px-2 py-1 -top-3 left-4 text-red-600 font-semibold">
          Print Options
        </div>

        <div className="flex items-center justify-between max-md:flex-col">
          <div className="flex flex-wrap gap-6 mt-4">
            {/* Print all */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-500 w-4 h-4"
                // ใช้ checked เพื่อบอกสถานะจาก State
                checked={print.Print_all}
                onChange={() => CheckboxChange("Print_all")}
              />
              Print all
            </label>

            {/* Without Zones */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-500 w-4 h-4"
                checked={print.Without_Zones}
                onChange={() => CheckboxChange("Without_Zones")}
              />
              Without Zones
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
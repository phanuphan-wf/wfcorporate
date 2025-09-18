import { useState, useEffect, useContext } from "react";
import { dataContext } from "./report";

export default function PrintOptions() {
  const { filterC } = useContext(dataContext);

  const [filter, setFilter] = filterC;

  return (
    <section id="print-options">
      <div className="border border-zinc-300 rounded-md relative mt-6 p-4 bg-white">
        {/* Header */}
        <div className="absolute bg-white px-2 py-1 -top-3 left-4 text-red-600 font-semibold">
          Print Options
        </div>

        {/* Checkboxes */}
        <div className="flex items-center justify-between max-md:flex-col">
          <div className="flex flex-wrap gap-6 mt-4">
           
           
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-red-500 w-4 h-4"
                checked={filter.printall}
                onChange={() => {
                if (!filter.printall) {
                  // ✅ ถ้าติ๊ก summary → reset ทุกค่าเหลือแค่ summary: true
                  setFilter({
                    printall: true,
                    withoutSales: false,
                    withoutZones: false,                   
                    summary: false,
                  });
                } else {
                  // ถ้าเอาติ๊กออก → summary = false
                  setFilter({ ...filter, printall: false });
                }
              }}
              />
              Print all
            </label>

            {/* Without Sales */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-red-500 w-4 h-4"
                checked={filter.withoutSales}
                onChange={() =>
                  setFilter({ ...filter, withoutSales: !filter.withoutSales })
                }
              />
              Without Sales
            </label>


          
             {/* Without Zones */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-red-500 w-4 h-4"
                checked={filter.withoutZones}
                onChange={() =>
                  setFilter({ ...filter, withoutZones: !filter.withoutZones })
                }
              />
              Without Zones
            </label>


          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-red-500 w-4 h-4"
              checked={filter.summary}
              onChange={() => {
                if (!filter.summary) {
                  // ✅ ถ้าติ๊ก summary → reset ทุกค่าเหลือแค่ summary: true
                  setFilter({
                    printall: false,
                    withoutSales: false,
                    withoutZones: false,                   
                    summary: true,
                  });
                } else {
                  // ถ้าเอาติ๊กออก → summary = false
                  setFilter({ ...filter, summary: false });
                }
              }}
            />
            Summary Report
          </label>



        </div>
      </div>
    </section>
  );
}

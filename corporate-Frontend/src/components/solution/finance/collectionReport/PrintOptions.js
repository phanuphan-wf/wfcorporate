import { useContext, useEffect, useCallback } from "react";
import { dataContext } from "./report";

export default function PrintOptions() {
  const { filterC } = useContext(dataContext);
  const [filter, setFilter] = filterC;

  // ✅ กำหนดค่าเริ่มต้น
  const safeFilter = {
    printall: filter?.printall ?? true,
    wSale: filter?.wSale ?? false,
    wZone: filter?.wZone ?? false,
    sumReport: filter?.sumReport ?? false,
    order: filter?.order ?? [],
    ...filter,
  };

  // ✅ toggle การเลือก + จัดลำดับ
  const setMode = useCallback(
    (mode) => {
      setFilter((prev) => {
        const newState = { ...prev };
        const order = [...(prev.order || [])];

        const current = !prev[mode];
        newState[mode] = current;

        if (current) {
          if (!order.includes(mode)) order.push(mode);
        } else {
          const idx = order.indexOf(mode);
          if (idx !== -1) order.splice(idx, 1);
        }

        newState.order = order;
        return newState;
      });
    },
    [setFilter]
  );

  useEffect(() => {
    // console.log("✅ filter:", safeFilter);
  }, [safeFilter]);

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
            {/* Print all */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-500 w-4 h-4"
                checked={safeFilter.printall}
                onChange={() => setMode("printall")}
              />
              Print all
            </label>

            {/* Without Sales */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-500 w-4 h-4"
                checked={safeFilter.wSale}
                onChange={() => setMode("wSale")}
              />
              Without Sales
            </label>

            {/* Without Zones */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-500 w-4 h-4"
                checked={safeFilter.wZone}
                onChange={() => setMode("wZone")}
              />
              Without Zones
            </label>
          </div>

          {/* Summary Report */}
          <label className="flex items-center gap-2 cursor-pointer mt-4 md:mt-0">
            <input
              type="checkbox"
              className="accent-red-500 w-4 h-4"
              checked={safeFilter.sumReport}
              onChange={() => setMode("sumReport")}
            />
            Summary Report
          </label>
        </div>
      </div>
    </section>
  );
}

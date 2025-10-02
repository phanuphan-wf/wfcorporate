import { useContext, useEffect, useCallback } from "react";
import { dataContext } from "./report";

export default function PrintOptions() {
  const { filterC } = useContext(dataContext);
  const [filter, setFilter] = filterC;

  // เผื่อกรณี state เริ่มต้นยังไม่มีฟิลด์ ให้กำหนดค่าเริ่มต้นชัดเจน
  const safeFilter = {
    printall: filter?.printall ?? true,
    wSale: filter?.wSale ?? false,
    wZone: filter?.wZone ?? false,
    sumReport: filter?.sumReport ?? false,
    // ...คีย์อื่น ๆ ของคุณ (เช่น exID) ยังคงอยู่เพราะเราจะ merge เสมอ
    ...filter,
  };

  // ให้เลือกได้ทีละโหมด (exclusive) โดย "รักษาคีย์อื่น ๆ" ด้วยการ merge
  const setMode = useCallback((mode) => {
    setFilter((prev) => {
      const base = {
        printall: false,
        wSale: false,
        wZone: false,
        sumReport: false,
      };
      switch (mode) {
        case "printall":
          return { ...prev, ...base, printall: true };
        case "wSale":
          return { ...prev, ...base, wSale: true };
        case "wZone":
          return { ...prev, ...base, wZone: true };
        case "summary":
          return { ...prev, ...base, sumReport: true };
        default:
          return prev;
      }
    });
  }, [setFilter]);

  useEffect(() => {
    console.log("📌 filter เปลี่ยนค่า:", safeFilter);
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
              onChange={() => setMode("summary")}
            />
            Summary Report
          </label>
        </div>
      </div>
    </section>
  );
}

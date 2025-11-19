import { useContext, useEffect, useCallback } from "react";
import { dataContext } from "./report";

export default function PrintOptions() {
  const { filterC } = useContext(dataContext);
  const [filter, setFilter] = filterC;

  // ✅ กำหนดค่าเริ่มต้น
  const safeFilter = {
    printall: true,
    wSale:  false,
    wZone: false,
    sumReport: false,
    order: [],
    userInteracted: false,
    ...filter,
  };

  const setMode = (mode) => {
    setFilter((prev) => {
      const newFilter = { ...prev };
      const newValue = !prev[mode]; // ค่าใหม่ที่จะเป็น (True หรือ False)

      // 1. ตั้งค่าพื้นฐาน
      newFilter[mode] = newValue;
      newFilter.userInteracted = true; // บอกว่า User เริ่มกดแล้ว

      // 2. ดึง Order เดิมมาเตรียมแก้ไข
      let newOrder = [...(prev.order || [])];

      // ----------------------------------------------------------
      // 💡 LOGIC การจัดการความสัมพันธ์ (Exclusive Logic)
      // ----------------------------------------------------------
      
      if (newValue === true) {
        // ✅ กรณี: กำลัง "ติ๊กเลือก" (Turning ON)
        
        // เพิ่มตัวปัจจุบันเข้าไปใน Order (ถ้ายังไม่มี)
        if (!newOrder.includes(mode)) {
          newOrder.push(mode);
        }

        if (mode === "printall") {
          // 🟢 ถ้าเลือก Print All -> ล้างทุกอย่าง
          newFilter.wSale = false;
          newFilter.wZone = false;
          newFilter.sumReport = false;
          
          // Order เหลือแค่ printall ตัวเดียว
          newOrder = ["printall"];
        } 
        else if (mode === "sumReport") {
          // 🟡 ถ้าเลือก Summary -> ล้างทุกอย่าง (ตามเงื่อนไข else เดิมของคุณ)
          newFilter.printall = false;
          newFilter.wSale = false;
          newFilter.wZone = false;

          // Order เหลือแค่ sumReport ตัวเดียว
          newOrder = ["sumReport"];
        } 
        else if (mode === "wSale" || mode === "wZone") {
          // 🔵 ถ้าเลือก Without... -> ล้าง PrintAll และ Summary แต่ "ไม่ล้างกันเอง"
          newFilter.printall = false;
          newFilter.sumReport = false;

          // ลบ printall และ sumReport ออกจาก Order (ถ้ามี)
          newOrder = newOrder.filter(item => item !== "printall" && item !== "sumReport");
        }

      } else {
        // ❌ กรณี: กำลัง "เอาติ๊กออก" (Turning OFF)
        // ลบตัวนั้นออกจาก Order
        newOrder = newOrder.filter((item) => item !== mode);
      }

      // 3. บันทึก Order กลับเข้าไป
      newFilter.order = newOrder;

      return newFilter;
    });
  };

  
  useEffect(() => {
     console.log("✅ filter:", safeFilter);
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

import { useState, useEffect, useContext } from "react";
import { dataContext } from "./report";
import Axios from "axios";
import ModalSeach from "./modalSearch";

export default function Filter() {

  const { filterC, reportC} = useContext(dataContext);
  const [filter, setFilter] = filterC; 
  const [reportList] =  reportC 

  const [isDisabled, setIsDisabled] = useState(true);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;  

  const [sales, setSales] = useState([]);
  const [zones, setZones] = useState([]);
  const [customerName, setCustomerName] = useState([]); 
  //const [payment, setPayment] = useState([]);
  

  //const getPayment = 0;

  useEffect(() => {
    if (filter.exID != 0) {      
      // ✅ ดึงชื่อ Sales ที่ไม่ซ้ำกัน
      const uniqueSales = [...new Set(reportList.map((item) => item.sales))];
      setSales(uniqueSales.map((s) => ({ eid: s, name: s })));

      // ✅ ดึงชื่อ Zone ที่ไม่ซ้ำกัน
      const uniqueZones = [...new Set(reportList.map((item) => item.zone))];
      setZones(uniqueZones.map((z) => ({ zid: z, zone: z })));

      // ✅ ดึงชื่อ Customer ที่ไม่ซ้ำกัน
      const uniqueCustomers = [...new Set(reportList.map((item) => item.name))];
      setCustomerName(uniqueCustomers.map((n) => ({ name: n })));

      setIsDisabled(false);
    } else {      
      setSales([]);
      setZones([]);
      setCustomerName([]);
     // getPayment([]);
      setIsDisabled(true);
    }
  }, [filter.exID],[reportList]);

  
    const [modalShow, setModalShow] = useState(false);
    const closeModal = () => setModalShow(false);

    const [selectedCustomer, setSelectedCustomer] = useState({ id: "", name: "" });

    // 👉 เพิ่มฟังก์ชันตรวจว่าพิมพ์ชื่อก่อนเปิด Modal หรือไม่
    const handleOpenModal = () => {
      if (!selectedCustomer.name.trim()) {
        alert("⚠️ กรุณากรอกชื่อลูกค้าก่อนค้นหา");
        return;
      }
      setModalShow(true);
    };

    // ถ้าอยากให้กด Enter แล้วเปิด modal ได้ด้วย
    const searchName = (e) => {
      if (e.key === "Enter") {
        handleOpenModal();
      }
    };

    const customerClick = (c) => {
      setSelectedCustomer({ id: c.id, name: c.name });
      setFilter((prev) => ({
        ...prev,
        customer: c.id,
        customername: c.name,
      }));
      setModalShow(false); // ✅ ปิด modal หลังเลือก
    };


    const searchCustomerByName = async (name) => {
      try {
        const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_rr;
        const res = await Axios.post(url + "/getCustomer", { name });
        if (res.data?.length > 0) {
          // ถ้าเจอชื่อเดียวตรง ๆ
          setSelectedCustomer({ id: res.data[0].cid, name: res.data[0].name });
          setFilter({ ...filter, customer: res.data[0].cid });
        } else {
          // ถ้าไม่เจอ → เปิด Modal ให้เลือกเอง
          setModalShow(true);
        }
      } catch (error) {
        console.error("❌ Error searching customer:", error);
        setModalShow(true);
      }
    };


    const handleSearchCustomer = (triggerByEnter = false) => {
      const searchText = selectedCustomer.name?.trim();

      // ถ้าไม่กรอกอะไร แล้วกด Enter → เปิด ModalSearch ทันที
      if (triggerByEnter && !searchText) {
        setModalShow(true);
        return;
      }

      if (!searchText) return; // ไม่ทำงานถ้าไม่พิมพ์

      // ✅ ดึงชื่อลูกค้าที่ไม่ซ้ำ
      const uniqueCustomers = [...new Set(reportList.map((item) => item.name))];
      setCustomerName(uniqueCustomers.map((n) => ({ name: n })));

      // ✅ ตรวจสอบว่ามีชื่อตรงกันไหม
      const foundCustomer = uniqueCustomers.find((name) =>
        name.toLowerCase().includes(searchText.toLowerCase())
      );

      if (foundCustomer) {
        // ✅ ถ้ามีชื่อตรงกัน → กรองข้อมูลทันที
        setFilter({
          ...filter,
          customer: foundCustomer,
          customername: foundCustomer,
        });
        console.log("✅ พบลูกค้า:", foundCustomer);
      } else {
        // ❌ ถ้าไม่พบชื่อ → เปิด ModalSearch
        console.log("❌ ไม่พบลูกค้า → เปิด ModalSearch");
        setModalShow(true);
      }
    };





 

  return (
    <section id="checkbox-print">
      <div className="border border-zinc-300 rounded-md relative mt-6">
        <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600">
          Filter
        </div>

        <div className="flex flex-col px-3 py-4 space-y-3">
          {/* By Sales */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="bySales"
              className="flex items-center font-medium gap-2 w-36">
              By Sales :
            </label>
            <select
              id="bySales"
              className="border rounded-md p-1.5 w-full md:w-100"
              disabled={isDisabled}
              value={filter.sales || ""}
              onChange={(e) => setFilter({ ...filter, sales: e.target.value })}>
              <option value="0">All sales</option>
              {sales.map((s, i) => (
                <option key={i} value={s.eid}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* By Zone */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="byZone"
              className="flex items-center font-medium gap-2 w-36">
              By Zone :
            </label>
            <select
              className="border rounded-md p-1.5 w-full md:w-100"
              id="cmbExhibition"
              value={filter.zone || ""}
              onChange={(e) => setFilter({ ...filter, zone: e.target.value })}
              disabled={isDisabled}>
              <option value="0">All Zone</option>
              {zones.map((z, i) => (
                <option key={i} value={z.zid}>
                  {z.zone}
                </option>
              ))}
            </select>
          </div>     

          
          {/* By Customer */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="exname"
              className="flex items-center font-medium gap-2 w-36"
            >
              By Customer :
            </label>

            {/* กล่องครอบช่องค้นหา */}
            <div className="flex w-full gap-2 items-center">
              <div className="relative w-full">
                <input
                  id="exname"
                  className="w-full md:w-100 border rounded px-2 py-1 pr-8" // ✅ เพิ่ม padding ขวาให้เว้นที่สำหรับปุ่ม ✕
                  placeholder="พิมพ์ชื่อลูกค้า..."
                  value={selectedCustomer.name || ""}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, name: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchCustomer();
                  }}
                />

                {/* ✅ ปุ่มกากบาทอยู่ภายในช่อง input */}
                {selectedCustomer.name && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCustomer({ id: "", name: "" });
                      setFilter({ ...filter, customer: "",customername:"" });
                      // reloadDefaultData(); // โหลดข้อมูลกลับมาเหมือนเดิม
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                    title="ล้างชื่อ"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="button"
                className="btn-primary px-3"
                onClick={handleSearchCustomer}
              >
                Search
              </button>
            </div>
          </div>



          {/* By Debt */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="byDebt"
              className="flex items-center font-medium gap-2 w-36">
              By Payment Status :
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentStatus"
                  value="1"
                  onChange={(e) => setFilter({ ...filter, payment: e.target.value })}
                  disabled={isDisabled}
                />

                <span>No Balance Remaining</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentStatus"
                  value="2"
                  onChange={(e) => setFilter({ ...filter, payment: e.target.value })}
                  disabled={isDisabled}
                />

                <span>Balance Remaining</span>
              </label>
            </div>
          </div>
        </div>
        
      </div>

       {/* ✅ ModalSearch แสดงเมื่อหาไม่เจอ */}
        <ModalSeach
          show={modalShow}
          onHide={() => setModalShow(false)}
          search={selectedCustomer.name}   // ส่งคำค้นที่พิมพ์ไปให้ Modal ใช้ค้นต่อ
          fill={(c) => {
            // เมื่อผู้ใช้เลือกชื่อลูกค้าจาก Modal
            setSelectedCustomer({ id: c.id, name: c.name });
            setFilter({ ...filter, customer: c.id, customername: c.name });
            setModalShow(false);
          }}
          exid={filter.exID}
        />



    </section>
  );
}

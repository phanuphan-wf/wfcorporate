import { useState, useEffect, useContext } from "react";
import { dataContext } from "./report";
import Axios from "axios";

import ModalSeach from "./modalSearch";

export default function Filter() {
  const { filterC } = useContext(dataContext);
  const [filter, setFilter] = filterC;

  

  const [isDisabled, setIsDisabled] = useState(true);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;
  // const [sales, setSales] = useState([]);
  // const [zones, setZones] = useState([]);

  const [sales, setSales] = useState([]);
  const [zones, setZones] = useState([]);

  const [payment, setPayment] = useState([]);
  const [customerName, setCustomerName] = useState([]);  // ✅ state เก็บชื่อ

  // ดึง Sales
  const getSales = async () => {
    // console.log(url + "/getSales");
    try {
      const res = await Axios.get(url + "/getSales");
      setSales(res.data);
    } catch (err) {
      // console.error("Error fetching sales:", err);
    }
  };

  // ดึง Zone
  const getZone = async () => {
    // console.log(url + "/getZone/" + filter.exID);
    try {
      const res = await Axios.get(url + "/getZone/" + filter.exID);
      // console.log("Zone API response:", res.data); // <--- ดูข้อมูลที่ได้
      setZones(res.data);
    } catch (err) {
      // console.error("Error fetching Zone:", err);
    }
  };

  //const getPayment = 0;

  useEffect(() => {
    if (filter.exID != 0) {
      getSales();
      getZone();
     // getPayment();

      setIsDisabled(false);
    } else {      
      setSales([]);
      setZones([]);
     // getPayment([]);
      setIsDisabled(true);
    }
  }, [filter.exID]);


  

  const [modalShow, setModalShow] = useState(false);

  const closeModal = () => {
    setModalShow(false);
  };

  const searchName = (e) => {
    if (e.key === "Enter") {
      setModalShow(true);
    }
  };


  //  By Customer

  const [selectedCustomer, setSelectedCustomer] = useState({ id: "", name: "" });

  const customerClick = (customer) => {
    setFilter({ ...filter, customer: customer.id }); // เก็บ id ไว้ใน filter
    setSelectedCustomer(customer);                   // เก็บทั้ง object
    setModalShow(false);
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

            <div className="flex w-full gap-2">
              <input
                id="exname"
                className="w-full md:w-100"
                disabled={isDisabled}
                value={selectedCustomer.name || ""} // ✅ กันกรณี undefined
                readOnly
              />
              <button
                type="button"
                className="btn-primary px-3"
                onClick={() => setModalShow(true)}
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

       <ModalSeach
          show={modalShow}
          onHide={closeModal}
          search={selectedCustomer.name} // ส่งชื่อไป modal ถ้ามี
          fill={customerClick}           // ✅ callback รับค่ากลับมา
        />


    </section>
  );
}

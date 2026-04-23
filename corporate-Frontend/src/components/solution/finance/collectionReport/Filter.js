import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { dataContext } from "./report";
import ModalSeach from "./modalSearch";

import { CgMoreO, CgCloseO } from "react-icons/cg";

export default function Filter() {
  const { filterC,filterByC,reportC } = useContext(dataContext);

  const [filter] = filterC;
  const [filterBy, setFilterBy] = filterByC;
  const [report] = reportC;

  //console.log(filter);
  //console.log(report);
  //console.log(filterByC);

  const [showFilter, setShowFilter] = useState(false);

  const isDisabled = !filter.exID || filter.exID === "";  

  const data = {
      bySale: "0",
      byZone: "0",
      byCustomer: "0",
      byPayment:"0"
  };
  const [filterData, setFilterData] =  useState(data);
  
  //console.log(filterData);

  const [sales, setSales] = useState([]);
  const [zones, setZones] = useState([]);  
  const [customerName, setCustomerName] = useState([]);   
  

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;
  
  
  const getSales = async () => {
    try {      
      const res = await Axios.get(url + "/getSales"); 
      if (res.status === 200) {
        setSales(res.data);
      }      
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };


  const getZones = async (exID) => {
    if (!exID || exID === "0") return;
    try {
      const res = await Axios.get(url + `/getZone/${exID}`); 
      if (res.status === 200) {
        setZones(res.data);
      }
    } catch (error) {
      console.error("Error fetching zones data:", error);
    } 
  };

 

  const [modalShow, setModalShow] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({ id: "", name: "" });

  const SelectCustomer = (selected) => {
    // 1. อัปเดตข้อมูลลูกค้าที่เลือก
    setSelectedCustomer(selected); 

    // 2. ✅ สำคัญ: อัปเดตคำค้นหาใน Input ให้เป็นชื่อเต็มของลูกค้าที่เลือก
    setSearch(selected.name); 

    // 3. อัปเดต State สำหรับใช้กรองข้อมูล (Filter)
    setFilterData((prev) => ({
      ...prev,
      byCustomer: selected.id
    }));

    // 4. ปิด Modal
    setIsSearch(false); 
  };

  console.log(selectedCustomer); 

  const salesChange = (e) => {  
    setFilterData((prev) => ({ 
      ...prev, 
      bySale: e.target.value
    })); 
    setFilterBy((prev) => ({
      ...prev,
      bySale: e.target.value
    }));  
  };

  const zoneChange = (e) => {
    setFilterData((prev) => ({
      ...prev,
      byZone: e.target.value
    })); 
    setFilterBy((prev) => ({
      ...prev,
      byZone: e.target.value
    }))  
  };

  const customerChange = (e) =>{
    setFilterData((prev) =>({
      ...prev,
      byCustomer: e.target.value
    }));  
    setFilterBy((prev) => ({
      ...prev,
      byCustomer: e.target.value
    })); 
  }; 


  useEffect(() => {
    if (isDisabled == true) {
      setShowFilter(false);
      setFilterData(data);
    }
  }, [isDisabled]);


  useEffect(() => {
 
    if (filterData.byPayment === "0" ) {
      setFilterData((prev) => ({
        ...prev,
         byPayment: "0" 
      }));
      setFilterBy((prev) => ({
        ...prev,
        byPayment: "0"
      }));      
    }
    else{
      setFilterData((prev) => ({
        ...prev,
         byPayment: "1" 
      }));
      setFilterBy((prev) => ({
        ...prev,
        byPayment: "1"
      }));     
    }
    
  }, [filterData.byPayment, setFilterData]);

   useEffect(() => {  

    setShowFilter(false);
    setFilterData(data);

    const exID = filter.exID;   
    if (filter.exID !== "") {
      getSales();
      getZones(exID);
    }else {     
      setShowFilter(false);
    }
  }, [filter.exID]);

  //console.log(sales);
  //console.log(zones);

    const [isSearch, setIsSearch] = useState(false);  

    const searchCustomer = (e) => {
      // ถ้าเป็นการกดปุ่ม (ไม่มี e.key) หรือ เป็นการกดปุ่ม Enter
      if (!e.key || e.key === "Enter") {
        setIsSearch(true);
      }
    };
  
    const closeSearch = () => {
      setIsSearch(false);
    };
    const [search, setSearch] = useState("");

    console.log(search);

  return (
    <>
      <button
        disabled={isDisabled}
        className={`rounded-md py-1 px-3 text-white mt-4 flex items-center gap-2 transition-all ${
          isDisabled 
            ? "bg-gray-300 cursor-not-allowed" 
            : showFilter ? "bg-red-500" : "bg-green-600"
        }`}
        onClick={() => setShowFilter(!showFilter)}
      >
        {showFilter ? (
          <>
            <CgCloseO />
            <span>Close panel</span>
          </>
        ) : (
          <>
            <CgMoreO />
            <span>Filter</span>
          </>
        )}
      </button>

      {/* Filter Section */}
      {showFilter && (
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
                  className="border rounded-md p-1.5 w-full md:w-100 bg-white outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  value={sales.eid}
                  onChange={salesChange}
                  >
                <option value="0">----- All Sales -----</option>

                {sales.map((sales, index) => (
                   <option key={index} value={sales.eid}>
                      {sales.name} 
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
                  id="byZone"
                  className="border rounded-md p-1.5 w-full md:w-100 bg-white outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  value={zones.zid}
                  onChange={zoneChange}                
                >
                  <option value="0">----- All Zone -----</option>
                  
                  {zones.map((zone, index) => (
                    <option key={index} value={zone.zid}>
                      {zone.zone} 
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
                      placeholder="customers name"
                      onKeyDown={(e) => searchCustomer(e)}
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                    />

                    {/* ปุ่มล้างข้อมูล เมื่อมีค่าในช่อง */}
                    {search && (
                      <button
                        onClick={() => {
                          setSearch("");
                          setSelectedCustomer({ id: "", name: "" });
                        // setFilter({ ...filter, customer: "0", customername: "0" });
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    )}

                  </div>

                  <button
                    type="button"
                    className="btn-primary px-3"
                    onClick={(e) => searchCustomer(e)}
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
                      value="0"   
                      checked={filterData.byPayment === "0"}
                      onChange={(e) => setFilterData({...filterData, byPayment: e.target.value})}
                      className="accent-red-500 w-4 h-4"
                    />
                    <span>No Balance Remaining</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentStatus" 
                      value="1"        
                      checked={filterData.byPayment === "1"}
                      onChange={(e) => setFilterData({...filterData, byPayment: e.target.value})}
                      className="accent-red-500 w-4 h-4"                
                    />

                    <span>Balance Remaining</span>
                  </label>
                </div>
              </div>
              
          </div>

        </div>

        
      )}

      <ModalSeach
          show={isSearch}
          onHide={closeSearch}
          exid={filter.exID}   
          search={search} 
          fill={SelectCustomer}     
      />
    </>
  );
}
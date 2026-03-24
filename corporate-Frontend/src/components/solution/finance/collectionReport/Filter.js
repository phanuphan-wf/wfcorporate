import { useState, useEffect, useContext } from "react";
import { dataContext } from "./report";
import { CgMoreO, CgCloseO } from "react-icons/cg";

export default function Filter() {
  const { filterC,filterByC,reportC } = useContext(dataContext);

  const [filter] = filterC;
  const [filterBy, setFilterBy] = filterByC;

  const [report] = reportC;

  //console.log(report);
  //console.log(filterByC);

  const [showFilter, setShowFilter] = useState(false);

  const isDisabled = !filter.exID || filter.exID === "";  

  const data = {
      bySale: "",
      byZone: "",
      byCustomer: "",
      byPayment:"0"
  };
  const [filterData, setFilterData] =  useState(data);
  
  //console.log(filterData);

  const [sales, setSales] = useState([]);
  const [zones, setZones] = useState([]);  
  const [customerName, setCustomerName] = useState([]);   
  

  const [modalShow, setModalShow] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  useEffect(() => {
    if (report && report.length > 0) {

      const uniqueSales = [...new Set(report.map(item => item.sales))];
      uniqueSales.sort((a,b) => a.localeCompare(b, 'th'));
      setSales(uniqueSales);

      const uniqueZone = [...new Set(report.map(item => item.zone))];
      uniqueZone.sort((a,b) => a.localeCompare(b, 'th'));
      setZones(uniqueZone);

      const uniqueCustomerName = [...new Set(report.map(item => item.name))];
      uniqueCustomerName.sort((a,b) => a.localeCompare(b, 'th'));
      setCustomerName(uniqueCustomerName);

    }else{
      setSales([]);
      setZones([]);
      setCustomerName([]);
    }
  }, [report]);

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
    setFilterData(data);
  },[filter.exID])

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
                  value={filterData.bySale}
                  onChange={salesChange}
                  >
                <option value="0">----- All Sales -----</option>

                {sales.map((sales, index) => (
                   <option key={index} value={sales}>
                      {sales} 
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
                  value={filterData.byZone}
                  onChange={zoneChange}                
                >
                  <option value="0">----- All Zone -----</option>
                  
                  {zones.map((zone, index) => (
                    <option key={index} value={zone}>
                      {zone} 
                    </option>
                  ))}

                </select>
              </div>   
              
              {/* By Customer */}
              {/* <div className="flex items-center gap-3">
                <label
                  htmlFor="byCustomer"
                  className="flex items-center font-medium gap-2 w-36"
                >
                  By Customer :
                </label>

             
                <select
                    id="byCustomer"
                    className="border rounded-md p-1.5 w-full md:w-100 bg-white outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    value={filterData.byCustomer}
                    onChange={customerChange}                
                >
                    <option value="0">----- All Customer -----</option>                    
                    {customerName.map((name, index) => (
                      <option key={index} value={name}>
                        {name} 
                      </option>
                    ))}

                </select>
              </div> */}


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
                      className ="w-full md:w-100 border rounded px-2 py-1 pr-8" // ✅ เพิ่ม padding ขวาให้เว้นที่สำหรับปุ่ม ✕
                      placeholder ="----- Search Customer -----"
                      //value={selectedCustomer}
                     // onChange={(e) =>
                     //   setSelectedCustomer({ ...selectedCustomer, name: e.target.value })
                     // }
                     // onKeyDown={(e) => {
                        //if (e.key === "Enter") handleSearchCustomer();
                      //}}
                    />

                    {/* ✅ ปุ่มกากบาทอยู่ภายในช่อง input */}
                    {/* {selectedCustomer.name && (
                      <button
                        type="button"                      
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                        title="ล้างชื่อ"
                      >
                        ✕
                      </button>
                    )} */}
                  </div>

                  <button
                    type="button"
                    className="btn-primary px-3"
                    //onClick={handleSearchCustomer}
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
    </>
  );
}
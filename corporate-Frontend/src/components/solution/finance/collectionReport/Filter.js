import { useState, useEffect, useContext } from "react";
import { dataContext } from "./report";

import Axios from "axios";

import { CgMoreO, CgCloseO } from "react-icons/cg";

export default function Filter() {
  const { filterC } = useContext(dataContext);
  const [filter] = filterC;
  const [showFilter, setShowFilter] = useState(false);


  const isDisabled = !filter.exID || filter.exID === "";


  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_clr;


  const [sales, setSales] = useState([]);
  const [zones, setZones] = useState([]);
  const [customerID, setCustomerID] = useState("");
  const [customerName, setCustomerName] = useState([]); 
  const [payment, setPayment] = useState([]);



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
              className="border rounded-md p-1.5 w-full md:w-100"
              
              >
             
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
             
            >
              
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
                />
             
              </div>

              <button
                type="button"
                className="btn-primary px-3"
                // onClick={handleSearchCustomer}
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
                />

                <span>No Balance Remaining</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentStatus"                 
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
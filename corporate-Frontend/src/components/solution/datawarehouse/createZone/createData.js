import { useState, useEffect, useContext } from "react";


export default function CreateData() {   
  
  return (
    <section className="create-box">
      <div className="border rounded-lg relative">
        <div className="absolute z-10 -top-[15px] left-4">
          <h3 className="bg-white px-3 py-1">Create Zone</h3>
        </div>
        <div className="w-full grid grid-cols-2 lg:grid-cols-[1fr_220px_2fr] pt-6 px-4 pb-4 gap-2 md:gap-4">
          <div className="flex items-center gap-2 max-lg:col-span-2">            
            <label htmlFor="createzone" className="w-28 text-left ml-3">Zone name</label>
            <input
              id="createzone"
              name="rowsetto"
              type="text"
              className="accent-red-500"
            />           
          </div>           
        </div>

        <div className="w-full grid grid-cols-2 lg:grid-cols-[1fr_220px_2fr] px-4 pb-4 gap-2 md:gap-4">
          <div className="flex items-center gap-2 max-lg:col-span-2">            
            <label htmlFor="createzone" className="w-28 text-left ml-3">Area</label>
            <input
              name="area"
              type="text"
              className="accent-red-500"
            />    
            <span className="text-sm text-black">Sa.m</span>
          </div>           
        </div>

        <div className="w-full grid grid-cols-2 lg:grid-cols-[1fr_220px_2fr] px-4 pb-4 gap-2 md:gap-4">
          <div className="flex items-center gap-2 max-lg:col-span-2">            
            <label htmlFor="createzone" className="w-28 text-left ml-3">Price</label>
            <input
              name="price"
              type="text"
              className="accent-red-500"
            />    
            <span className="text-sm text-black">Baht</span>
          </div>           
        </div>

        <div className="w-full grid grid-cols-2 lg:grid-cols-[1fr_220px_2fr] px-4 pb-4 gap-2 md:gap-4">
          <div className="flex items-center gap-2 max-lg:col-span-2">            
            <label htmlFor="createzone" className="w-28 text-left ml-3">Booth Qty</label>
            <input
              name="boothQty"
              type="text"
              className="accent-red-500"
            />    
            <span className="text-sm text-black">Bahts</span>
          </div>           
        </div>

        <div className="w-full grid grid-cols-2 lg:grid-cols-[1fr_220px_2fr] px-4 pb-4 gap-2 md:gap-4">
          <div className="flex items-center gap-2 max-lg:col-span-2">            
            <label htmlFor="createzone" className="w-28 text-left ml-3">Deposit</label>
            <input
              name="deposit"
              type="text"
              className="accent-red-500"
            />    
            <span className="text-sm text-black">Baht</span>
          </div>           
        </div>

        <div className="w-full grid grid-cols-2 lg:grid-cols-[1fr_220px_2fr] px-4 pb-4 gap-2 md:gap-4">
          <div className="flex items-center gap-2 max-lg:col-span-2">            
            <label htmlFor="createzone" className="w-28 text-left ml-3">Remark</label>
            <textarea
              rows={3}
              id="remark"
              name="remark"
              type="text"
              className="border border-[#b3b3b3] w-96 rounded-md px-2 py-1 focus:outline-none focus:shadow-[0_0_0_0.2rem_white,0_0_5px_0.25rem_red] focus:border-white"
            />   
            
          </div>           
        </div>


      </div>
    </section>
  );
}

import { useState, useEffect, useContext } from "react";

export default function SelectExid(){
    
    return(
         <div className="my-4 flex max-md:flex-col gap-2 md:items-center">
          <label htmlFor="exname" className="max-md:block">
            Exhibition Name :{" "}
          </label>
          <select
            name="exname"
            className="cmb max-md:w-full"
            // onChange={(e) => setBooth({ ...booth, exid: e.target.value })}
            // value={booth.exid}
            >
            <option value={0}>please select exhibition name</option>
            {/* {exhibition.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name + " (" + item.code + ")"}
              </option>
            ))} */}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-red-500 size-4"
              name="pastex"
            //   onChange={(e) => setPast(e.target.checked)}
            />
            <label htmlFor="pastex">Past Exhibition</label>
          </div>
        </div>
    );

}
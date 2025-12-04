import { useState, useContext } from "react";
import Axios from "axios";



export default function CustomerHistoryListList() {
  

  return (
    <section id="customer-history-list">
      <div className="flex justify-end w-full 2xl:w-4/5 my-4">
        {/* <button className="btn-green px-3" onClick={showList}>
          show history
        </button> */}
      </div>
      {/* <h6>Customer History List</h6> */}
      <div id="hislist" className="w-full mb-8">
        <table className="w-full 2xl:w-4/5">
          <thead>
            <tr>
              <th className="bg-zinc-100 rounded-tl-md">no#</th>
              <th className="bg-zinc-100 border-l-2 border-white">
                Customer Name
              </th>
              <th className="bg-zinc-100 border-l-2 border-white">งวดที่ 1 </th>
              <th className="bg-zinc-100 border-l-2 border-white">งวดที่ 2</th>
              <th className="bg-zinc-100 border-l-2 border-white">วันที่อนุมัติ</th>
              <th className="bg-zinc-100 border-l-2 border-white">อนุมัติโดย</th>
              <th className="bg-zinc-100 border-l-2 border-white">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>
    </section>
  );
}

import React, { useContext, useState, useEffect } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "./customerHistoryData";

export default function CustomerHistoryListList() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_chd;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { customerC, hislistC, filterC } = useContext(dataContext);

  const [customer, setCustomer] = customerC;
  const [hislist, setHislist] = hislistC;
  const [filter, setFilter] = filterC;

  const showList = async () => {
    if (customer.customerID != "") {
      const res = await Axios.get(url + "/getHistory/" + customer.customerID)
        .then((res) => {
          if (filter.during) {
            if (new Date(filter.sdate) >= new Date(filter.edate)) {
              alert("Filter start date must be less than end date");
              return;
            }
          }
          setHislist(res.data);
          let arr = res.data.filter((h) => filter.venue.includes(h.vid));
          if (filter.during) {
            arr = arr.filter(
              (a) =>
                new Date(a.startDate) >= new Date(filter.sdate) &&
                new Date(a.startDate) <= new Date(filter.edate)
            );
          }
          setHisfilter(arr);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const [hisfilter, setHisfilter] = useState([]);

  return (
    <section id="customer-history-list">
      <div className="flex justify-end w-full 2xl:w-4/5 my-4">
        <button className="btn-green px-3" onClick={showList}>
          show history
        </button>
      </div>
      <h6>Customer History List</h6>
      <div id="hislist" className="w-full mb-8">
        <table className="w-full 2xl:w-4/5">
          <thead>
            <tr>
              <th className="bg-zinc-100 rounded-tl-md">no#</th>
              <th className="bg-zinc-100 border-l-2 border-white">
                Exhibition
              </th>
              <th className="bg-zinc-100 border-l-2 border-white">Code</th>
              <th className="bg-zinc-100 border-l-2 border-white">Qty</th>
              <th className="bg-zinc-100 border-l-2 border-white">Volume</th>
              <th className="bg-zinc-100 border-l-2 border-white">Sales</th>
              <th className="w-[25%] bg-zinc-100 border-l-2 border-white rounded-tr-md">
                Credit History
              </th>
            </tr>
          </thead>
          <tbody>
            {hisfilter.map((d, i) => (
              <tr key={i} className="last:border-b-2 border-zinc-100">
                <td className="border-t-2 border-zinc-100">{i + 1}</td>
                <td className="border-t-2 border-l-2 border-zinc-100">
                  {d.exName}
                </td>
                <td className="border-t-2 border-l-2 border-zinc-100">
                  {d.exID}
                </td>
                <td className="border-t-2 border-l-2 border-zinc-100 text-right">
                  {Number(d.qty)
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                </td>
                <td className="border-t-2 border-l-2 border-zinc-100 text-right">
                  {Number(d.volume)
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                </td>
                <td className="border-t-2 border-l-2 border-zinc-100">
                  {d.saleName}
                </td>
                <td className="border-t-2 border-l-2 border-zinc-100">{""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

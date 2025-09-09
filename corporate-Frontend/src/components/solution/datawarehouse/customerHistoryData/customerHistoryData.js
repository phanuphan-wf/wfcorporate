import React, { createContext, useState, useEffect } from "react";

import CustomerHistoryHeader from "./chdHeader";
import CustomerHistoryList from "./chdList";

import AppProtectRoute from "../../../../AppProtectRoute";

export const dataContext = createContext();

export default function CustomerHistoryData() {
  const [customer, setCustomer] = useState({ customerID: "", Name: "" });

  const [hislist, setHislist] = useState([]);

  const initFilter = {
    during: false,
    sdate: "",
    edate: "",
    venue: [1, 3, 2, 10],
  };
  const [filter, setFilter] = useState(initFilter);

  useEffect(() => {
    //console.log(hislist);
  }, [hislist]);

  /* Check if user is authorized to view this page must insert before return part */
  const show = AppProtectRoute.find(
    (x) => x.path === "datawarehouse/customerhistorydata"
  ).show;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!show.some((x) => x.dept === user.Dept && x.acc === user.ALevel)) {
    return (
      <section className="2xl:container">
        <h1 className="text-xl text-red-500">
          You are not authorized to view this page
        </h1>
      </section>
    );
  }

  return (
    <dataContext.Provider
      value={{
        customerC: [customer, setCustomer],
        hislistC: [hislist, setHislist],
        filterC: [filter, setFilter],
      }}
    >
      <section id="customer-data">
        <div>
          <h1 className="text-xl my-3">Customer History Data</h1>
        </div>
        <CustomerHistoryHeader />
        <CustomerHistoryList />
      </section>
    </dataContext.Provider>
  );
}

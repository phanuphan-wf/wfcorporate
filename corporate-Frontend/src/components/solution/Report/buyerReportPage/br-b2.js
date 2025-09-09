import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";

import { DataContext } from "../buyerReport";
import BuyingPaymentChart from "../buyerReportChart/buyingPaymentChart";
import DecisionTimeChart from "../buyerReportChart/decisionTimeChart";

export default function BRB2(props) {
  const { data } = useContext(DataContext);
  const { loading } = useContext(DataContext);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_byr;

  return (
    <div>
      <div className="flex flex-col md:flex-row w-full items-center justify-center">
        <div className={`${loading ? "hidden" : ""} md:w-4/5`}>
          {data.length > 0 ? <BuyingPaymentChart data={data} /> : ""}
          {data.length > 0 ? <DecisionTimeChart data={data} /> : ""}
        </div>
      </div>
    </div>
  );
}

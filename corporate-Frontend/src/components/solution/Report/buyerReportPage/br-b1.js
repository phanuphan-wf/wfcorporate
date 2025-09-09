import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";

import { DataContext } from "../buyerReport";
import InterestChart from "../buyerReportChart/interestChart";
import BuyingVolumeChart from "../buyerReportChart/buyingVolumeChart";
import BuyingPeriodChart from "../buyerReportChart/buyingPeriod";

export default function BRB1(props) {
  const { data } = useContext(DataContext);
  const { loading } = useContext(DataContext);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_byr;

  return (
    <div>
      <div className="flex flex-col md:flex-row w-full items-center">
        <div className={`${loading ? "hidden" : ""} md:w-1/2`}>
          {data.length > 0 ? <InterestChart data={data} /> : ""}
        </div>
        <div className={`${loading ? "hidden" : ""} md:w-1/2`}>
          {data.length > 0 ? <BuyingVolumeChart data={data} /> : ""}
          {data.length > 0 ? <BuyingPeriodChart data={data} /> : ""}
        </div>
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";

import { DataContext } from "../buyerReport";
import OnlineVolumeChart from "../buyerReportChart/onlineVolumeChart";

export default function BRM2(props) {
  const { initData } = useContext(DataContext);
  const { loading } = useContext(DataContext);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_byr;

  return (
    <div>
      <div className="flex flex-col md:flex-row w-full items-center justify-center">
        <div className={`${loading ? "hidden" : ""} md:w-full`}>
          {initData.length > 0 ? <OnlineVolumeChart data={initData} /> : ""}
        </div>
      </div>
    </div>
  );
}

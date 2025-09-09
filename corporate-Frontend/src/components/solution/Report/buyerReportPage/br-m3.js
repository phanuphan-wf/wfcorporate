import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";

import { DataContext } from "../buyerReport";
import Occu_MediaChart from "../buyerReportChart/occu_mediaChart";
import Age_MediaChart from "../buyerReportChart/age_mediaChart";

export default function BRM3(props) {
  const { initData } = useContext(DataContext);
  const { loading } = useContext(DataContext);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_byr;

  return (
    <div>
      <div className="flex flex-col w-full items-center justify-center">
        <div className={`${loading ? "hidden" : ""} md:w-full`}>
          {initData.length > 0 ? <Age_MediaChart data={initData} /> : ""}
        </div>
        <div className={`${loading ? "hidden" : ""} md:w-full`}>
          {initData.length > 0 ? <Occu_MediaChart data={initData} /> : ""}
        </div>
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";

import { DataContext } from "../buyerReport";
import ProvinceChart from "../buyerReportChart/provinceChart";
import DistrictChart from "../buyerReportChart/districtChart";

export default function BRD2(props) {
  const { data } = useContext(DataContext);
  const { loading } = useContext(DataContext);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_byr;

  return (
    <div>
      <div className="flex flex-col md:flex-row w-full">
        <div className={`${loading ? "hidden" : ""} md:w-1/2`}>
          {data.length > 0 ? <ProvinceChart data={data} /> : ""}
        </div>
        <div className={`${loading ? "hidden" : ""} md:w-1/2`}>
          {data.length > 0 ? <DistrictChart data={data} /> : ""}
        </div>
      </div>
    </div>
  );
}

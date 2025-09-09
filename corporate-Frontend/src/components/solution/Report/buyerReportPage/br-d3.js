import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";

import { DataContext } from "../buyerReport";
import Income_OccuChart from "../buyerReportChart/income_occuChart";

export default function BRD3(props) {
  const { data } = useContext(DataContext);
  const { loading } = useContext(DataContext);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_byr;

  return (
    <div>
      <div className="flex flex-col md:flex-row w-full">
        <div className={`${loading ? "hidden" : ""} w-full`}>
          {data.length > 0 ? <Income_OccuChart data={data} /> : ""}
        </div>
      </div>
    </div>
  );
}

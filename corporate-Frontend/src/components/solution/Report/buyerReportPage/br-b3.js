import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";

import { DataContext } from "../buyerReport";
import ProductChart from "../buyerReportChart/productChart";

export default function BRB3(props) {
  const { data } = useContext(DataContext);
  const { loading } = useContext(DataContext);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_byr;

  return (
    <div>
      <div className="flex flex-col md:flex-row w-full items-center justify-center">
        <div className={`${loading ? "hidden" : ""} md:w-4/5`}>
          {data.length > 0 ? <ProductChart data={data} /> : ""}
        </div>
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";

import SexChart from "../buyerReportChart/sexChart";
import AgeChart from "../buyerReportChart/ageChart";
import IncomeChart from "../buyerReportChart/incomeChart";
import ResidentChart from "../buyerReportChart/residentChart";
import RegistChart from "../buyerReportChart/registChart";
import { DataContext } from "../buyerReport";

export default function BR1(props) {
  const { data } = useContext(DataContext);
  const { loading } = useContext(DataContext);
  const { selectEx } = useContext(DataContext);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_byr;

  const [visNo, setVisNo] = useState({});

  const getVis = async () => {
    const res = await Axios.get(url + "/getVistotal/" + selectEx).then(
      (res) => {
        setVisNo(res.data);
      }
    );
  };

  useEffect(() => {
    if (selectEx != "0") {
      getVis();
    }
  }, [selectEx]);

  return (
    <div>
      <div className="flex flex-col md:flex-row w-full">
        <div className={`${loading ? "hidden" : ""} md:w-1/4`}>
          {data.length > 0 ? (
            <div className="flex flex-row md:flex-col items-center justify-around h-full max-md:gap-4">
              <div className="w-full whitespace-nowrap text-center bg-blue-600 rounded-md px-2 py-2">
                <div className="text-white px-2 pb-2">Total Registration</div>
                <div className="bg-white text-xl py-2 rounded">
                  {visNo.visitor}
                </div>
              </div>
              <div className="w-full whitespace-nowrap text-center bg-green-600 rounded-md px-2 py-2">
                <div className="text-white px-2 pb-2">Total Transaction</div>
                <div className="bg-white text-xl py-2 rounded">
                  {visNo.buyer}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={`${loading ? "hidden" : ""} md:w-1/3`}>
          {data.length > 0 ? <SexChart data={data} /> : ""}
        </div>
        <div className={`${loading ? "hidden" : ""} md:w-1/2`}>
          {data.length > 0 ? <AgeChart data={data} /> : ""}
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full">
        <div className={`${loading ? "hidden" : ""} md:w-1/3`}>
          {data.length > 0 ? <IncomeChart data={data} /> : ""}
        </div>
        <div className={`${loading ? "hidden" : ""} md:w-1/3`}>
          {data.length > 0 ? <RegistChart data={data} /> : ""}
        </div>
        <div className={`${loading ? "hidden" : ""} md:w-1/3`}>
          {data.length > 0 ? <ResidentChart data={data} /> : ""}
        </div>
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";

import { DataContext } from "../buyerReport";
import MediaReturnChart from "../buyerReportChart/mediaReturnChart";
import RoasTable from "../buyerReportChart/roasTable";

export default function BRM1(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_byr;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { initData } = useContext(DataContext);
  const { loading } = useContext(DataContext);
  const { selectEx } = useContext(DataContext);
  const [budget, setBudget] = useState([]);

  const getBudget = async () => {
    const res = await Axios.get(url + "/getBudget/" + selectEx).then((res) =>
      setBudget(res.data)
    );
  };

  useEffect(() => {
    if (bearer != undefined) {
      getBudget();
    }
  }, [bearer]);

  return (
    <div>
      <div className="flex flex-col md:flex-row w-full items-center justify-center">
        <div className={`${loading ? "hidden" : ""} w-full md:w-3/5 lg:w-2/3`}>
          {initData.length > 0 ? (
            <MediaReturnChart data={initData} budget={budget} />
          ) : (
            ""
          )}
        </div>
        <div
          className={`${
            loading ? "hidden" : ""
          } max-md:mt-4 max-md:w-4/5 md:w-2/5 lg:w-1/3`}
        >
          {budget.length > 0 ? (
            <RoasTable data={initData} budget={budget} />
          ) : (
            ""
          )}
          {selectEx == "K124" && (
            <span className="text-red-500 text-sm">วิทยุ for รถแห่</span>
          )}
        </div>
      </div>
    </div>
  );
}

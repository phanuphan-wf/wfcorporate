import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";

import { DataContext } from "../buyerReport";

export default function BRHM(props) {
  const { loading } = useContext(DataContext);
  const { selectEx } = useContext(DataContext);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_byr;

  const img = true;

  useEffect(() => {
    //console.log(img);
  }, [img]);

  return (
    <div>
      <div className="flex flex-col w-full items-center justify-center">
        <div className={`${loading ? "hidden" : ""}`}>
          {img ? (
            <img
              src={
                "https://worldfair.blob.core.windows.net/heatmap/hm-" +
                selectEx.toLowerCase() +
                ".jpg"
              }
              alt={"heatmap-" + selectEx}
              className="max-h-screen"
            />
          ) : (
            <span className="text-lg text-red-500">
              This show is no heatmap upload
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

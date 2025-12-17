import { useEffect, useState, useContext } from "react";
import Axios from "axios";
import * as d3 from "d3";
import useHeader from "../../../hook/useHeader";

import { dataContext } from "./exhibitorBadge";

export default function ReceiveHist(props) {
  const { exID, exDataC } = useContext(dataContext);
  const [exData, setExData] = exDataC;
  const bearer = useHeader();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_frontdesk;

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [histlist, setHistlist] = useState([]);

  const getHist = async () => {
    const res = await Axios.get(
      url + "/getBadgeHist/" + exData.id + "/" + exID
    ).then((res) => {
      if (res.status == 200) {
        setHistlist(res.data);
      }
    });
  };

  useEffect(() => {
    if (exData.id != "" && bearer) {
      getHist();
    } else {
      setHistlist([]);
    }
  }, [exData]);

  const [recsum, setRecsum] = useState(0);

  useEffect(() => {
    let sum = d3.sum(histlist, (h) => h.recNo);
    setRecsum(sum);
  }, [histlist]);

  function formatDateTime(dateString) {
    const locale = "en-US";

    return new Date(dateString).toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return (
    <div className="border-t mt-6">
      <div className="py-3">Received Badge</div>
      <div>
        <table className="w-full">
          <thead className="border-b-2">
            <tr>
              <td>Name</td>
              <td>Mobile</td>
              <td>Location</td>
              <td>Time</td>
              <td>Received</td>
              <td>Badge</td>
            </tr>
          </thead>
          <tbody>
            {histlist.map((h, i) => (
              <tr
                key={i}
                className={`${h.type == "Exhibitor" ? "bg-green-100" : ""}`}>
                <td>{h.name}</td>
                <td>{h.mobile}</td>
                <td>{h.loc}</td>
                <td>{formatDateTime(h.recTime)}</td>
                <td>{h.recNo}</td>
                <td
                  className={`${h.type == "Exhibitor" ? "text-red-500" : ""}`}>
                  {h.type}
                </td>
              </tr>
            ))}
          </tbody>
          {recsum > 0 && (
            <tfoot className="border-t-2">
              <tr>
                <td colSpan={4} className="text-right pr-10">
                  Amount Received
                </td>
                <td>{recsum}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

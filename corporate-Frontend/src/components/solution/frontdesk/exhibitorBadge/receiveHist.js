import React, { useEffect, useState } from "react";
import Axios from "axios";
import * as d3 from "d3";

export default function ReceiveHist(props) {
  useEffect(() => {
    Axios.defaults.headers.common = {
      Authorization: "Bearer " + props.bearer,
    };
  }, [props.bearer]);

  const [histlist, setHistlist] = useState([]);

  const getHist = async () => {
    const res = await Axios.get(
      props.url + "/getBadgeHist/" + props.cus + "/" + props.ex
    ).then((res) => {
      if (res.status == 200) {
        setHistlist(res.data);
      }
    });
  };

  useEffect(() => {
    if (props.cus != "") {
      getHist();
    } else {
      setHistlist([]);
    }
  }, [props.cus]);

  const [recsum, setRecsum] = useState(0);

  useEffect(() => {
    let sum = d3.sum(histlist, (h) => h.recNo);
    setRecsum(sum);
  }, [histlist]);

  const dateConvert = (value) => {
    let date = value.substring(0, value.indexOf("T"));
    let time = value.substring(value.indexOf("T") + 1, value.indexOf("T") + 6);
    let y = date.substring(0, date.indexOf("-"));
    let md = date.substring(value.indexOf("-") + 1, value.indexOf("T"));
    let m = md.substring(0, md.indexOf("-"));
    let d = md.substring(md.indexOf("-") + 1);

    return d + "-" + m + "-" + y + " " + time;
  };

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
            </tr>
          </thead>
          <tbody>
            {histlist.map((h, i) => (
              <tr key={i}>
                <td>{h.name}</td>
                <td>{h.mobile}</td>
                <td>{h.loc}</td>
                <td>{dateConvert(h.recTime)}</td>
                <td>{h.recNo}</td>
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

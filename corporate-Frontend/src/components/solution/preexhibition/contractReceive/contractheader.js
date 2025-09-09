import React, { useContext, useEffect } from "react";
import Axios from "axios";
import { dataContext } from "../contractReceive";
import useHeader from "../../../hook/useHeader";

export default function ContractHeader(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctr;
  const bearer = useHeader();

  const { exhibitionC, contractDetailC, resetC } = useContext(dataContext);

  const [exhibition, setExhibition] = exhibitionC;
  const [contractDetail, setContractDetail] = contractDetailC;
  const [reset, setReset] = resetC;

  const month = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = () => {
    var y = [];
    for (var i = -1; i < 2; i++) {
      y.push(new Date().getFullYear() + i);
    }
    return y;
  };

  const getContractNo = async () => {
    const res = await Axios.get(url + "/getContractNo/" + exhibition).then(
      (r) =>
        setContractDetail({
          ...contractDetail,
          ContractID: Number(r.data + 1),
          SignDate:
            new Date().getMonth() +
            1 +
            "/" +
            new Date().getDate() +
            "/" +
            new Date().getFullYear(),
        })
    );
  };

  useEffect(() => {
    if (exhibition != "0") {
      getContractNo();
    }
  }, [exhibition, reset]);

  const convertDate = (o, v) => {
    let oldd = contractDetail.Contract;
    let d =
      o == "dd"
        ? v
        : oldd.substring(oldd.indexOf("/") + 1, oldd.lastIndexOf("/"));
    let m = o == "mm" ? v : oldd.substring(0, oldd.indexOf("/"));
    let y = o == "yy" ? v : oldd.substring(oldd.lastIndexOf("/") + 1);

    let newd = m + "/" + d + "/" + y;

    setContractDetail({ ...contractDetail, SignDate: newd });
  };

  return (
    <div className="contract-header w-full flex items-center justify-between max-sm:flex-wrap max-sm:gap-2">
      <div className="flex flex-wrap items-center">
        <label htmlFor="cNo" className="mr-2 flex-shrink-0">
          Contract No
        </label>
        <input
          id="cNo"
          className="flex-auto text-right px-3"
          value={
            contractDetail.ContractID != 0 ? contractDetail.ContractID : ""
          }
        />
      </div>
      <div className="flex items-center max-sm:flex-wrap">
        <label htmlFor="cDate" className="mr-2">
          Contract Date
        </label>
        <div>
          <select
            className="cmb"
            onChange={(e) => convertDate("dd", e.target.value)}
          >
            {Array.from({ length: 31 }, (_, i) => {
              if (i + 1 == new Date().getDate()) {
                return (
                  <option value={i + 1} selected>
                    {i + 1}
                  </option>
                );
              } else {
                return <option value={i + 1}>{i + 1}</option>;
              }
            })}
          </select>
          <select
            className="cmb"
            onChange={(e) => convertDate("mm", Number(e.target.value) + 1)}
          >
            {month.map((m, i) => {
              if (i == new Date().getMonth()) {
                return (
                  <option value={i} selected>
                    {m}
                  </option>
                );
              } else {
                return <option value={i}>{m}</option>;
              }
            })}
          </select>
          <select
            className="cmb"
            onChange={(e) => convertDate("yy", e.target.value)}
          >
            {year().map((y, i) => {
              if (y == new Date().getFullYear()) {
                return (
                  <option value={y} selected>
                    {y}
                  </option>
                );
              } else {
                return <option value={y}>{y}</option>;
              }
            })}
          </select>
        </div>
      </div>
    </div>
  );
}

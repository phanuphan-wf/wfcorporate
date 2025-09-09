import React, { useEffect, useState, useContext } from "react";

import useHeader from "../../../hook/useHeader";
import Axios from "axios";

import styles from "./collection.module.css";

import { CollectionContext } from "./collectionContext";

export default function CollectionList(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_Finance_api;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const initData = [
    {
      sales: "",
      customer: "",
      detail: "",
      due: "",
      amount: 0,
      tax: 0,
      total: 0,
      booth: "",
      page: "",
      collectId: "",
    },
  ];

  const [data, setData] = useState(initData);

  const { collection, setExId, setCustomerId, setPage, setCollectId } =
    useContext(CollectionContext);

  async function getData() {
    const res = await Axios.get(
      url + "/getData/" + collection.exId + "/" + collection.page
    ).then((res) => {
      if (res.data.length > 0) {
        setData(res.data);
      } else {
        setData(initData);
      }
    });

    setLoading("");
  }

  useEffect(() => {
    if (collection.page !== "" && collection.exId !== "") {
      setLoading("Loading Data...");
    } else {
      setLoading("");
      setData([]);
    }

    // set timeout for waiting full input because await data problem

    const timer = setTimeout(() => {
      if (collection.exId !== "" && collection.page !== "") {
        getData();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [collection.page]);

  useEffect(() => {
    if (collection.collectId !== "") {
      return;
    } else {
      if (collection.exId !== "" && collection.page !== "") {
        getData();
      }
    }
  }, [collection.customerId]);

  function onRowClick(e) {
    setCollectId(e.target.getAttribute("data-key"));
  }

  function correctDate(d) {
    let dd = "";
    let mm = "";
    let yy = "";

    d = d.substring(0, d.indexOf("T"));

    yy = d.substring(0, d.indexOf("-"));
    let mi = d.substring(d.indexOf("-") + 1, d.indexOf("-") + 3);
    dd = d.substring(d.length - 2);

    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    month.map((m, i) => {
      if (i + 1 === Number(mi)) {
        mm = m;
      }
    });

    return dd + "/" + mm + "/" + yy;
  }

  //testing effect

  useEffect(() => {
    props.data(data);
  }, [data]);

  const datalist = () => {
    if (data.length > 0) {
      let td = [];
      for (var i = 0; i < 13; i++) {
        if (data[i]) {
          td.push(
            <tr onClick={(e) => onRowClick(e)}>
              <td id={styles["tno"]} data-key={data[i].collectId}>
                {i + 1}
              </td>
              <td id={styles["tsale"]} data-key={data[i].collectId}>
                {data[i].sales}
              </td>
              <td id={styles["tcustomer"]} data-key={data[i].collectId}>
                {data[i].customer}
              </td>
              <td id={styles["tdetail"]} data-key={data[i].collectId}>
                {data[i].detail}
              </td>

              <td id={styles["tdue"]} data-key={data[i].collectId}>
                {correctDate(data[i].due)}
              </td>
              <td id={styles["tamount"]} data-key={data[i].collectId}>
                {data[i].amount
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
              </td>
              <td id={styles["ttax"]} data-key={data[i].collectId}>
                {data[i].tax
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
              </td>
              <td id={styles["ttotal"]} data-key={data[i].collectId}>
                {data[i].total
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
              </td>
              <td id={styles["tbooth"]} data-key={data[i].collectId}>
                {data[i].booth}
              </td>
              <td id={styles["tpage"]} data-key={data[i].collectId}>
                {data[i].page}
              </td>
            </tr>
          );
        } else {
          td.push(
            <tr>
              <td id={styles["tno"]}>{i + 1}</td>
              <td id={styles["tsale"]}></td>
              <td id={styles["tcustomer"]}></td>
              <td id={styles["tdetail"]}></td>
              <td id={styles["tdue"]}></td>
              <td id={styles["tamount"]}></td>
              <td id={styles["ttax"]}></td>
              <td id={styles["ttotal"]}></td>
              <td id={styles["tbooth"]}></td>
              <td id={styles["tpage"]}></td>
            </tr>
          );
        }
      }
      return td;
    } else {
      let td = [];
      for (var i = 0; i < 13; i++) {
        td.push(
          <tr>
            <td id={styles["tno"]}>{i + 1}</td>
            <td id={styles["tsale"]}></td>
            <td id={styles["tcustomer"]}></td>
            <td id={styles["tdetail"]}></td>
            <td id={styles["tdue"]}></td>
            <td id={styles["tamount"]}></td>
            <td id={styles["ttax"]}></td>
            <td id={styles["ttotal"]}></td>
            <td id={styles["tbooth"]}></td>
            <td id={styles["tpage"]}></td>
          </tr>
        );
      }
      return td;
    }
  };

  const [loading, setLoading] = useState("");

  return (
    <div className={styles.recordtable}>
      <hr></hr>
      <span id={styles["dataloading"]}>{loading}</span>
      <table>
        <thead>
          <tr>
            <th id={styles["tno"]}>No</th>
            <th>Sales</th>
            <th>Customer</th>
            <th>Detail</th>
            <th>Due</th>
            <th>Amount</th>
            <th>TAX</th>
            <th>Total</th>
            <th>Booth</th>
            <th>Page</th>
          </tr>
        </thead>
        <tbody>
          {collection.collectId ? (
            <td colSpan={10}>
              <span id={styles["tabledisable"]}>
                Disable Data while Editing
              </span>
            </td>
          ) : (
            datalist()
          )}
        </tbody>
      </table>

      <hr></hr>
    </div>
  );
}

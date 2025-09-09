import React, { useContext, useEffect, useState, useRef } from "react";
import Axios from "axios";
import { CollectionContext } from "./collectionContext";
import useHeader from "../../../hook/useHeader";
import ReactToPrint from "react-to-print";

import styles from "./collection.module.css";

export default function Summary(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_Finance_api;
  const PrintSummary = useRef(null);

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { collection } = useContext(CollectionContext);

  const [data, setData] = useState({});

  async function getData() {
    try {
      const res = await Axios.get(
        url + "/summary/" + collection.exId + "/" + collection.page
      ).then((res) => {
        setData(res.data);
      });
    } catch (err) {
      alert("Error load summary data : " + err);
    }
  }

  useEffect(() => {
    if (collection.exId !== "" && collection.page !== "") {
      getData();
    }
  }, [collection]);

  const initAccu = {
    preBalance: "",
    preTax: "",
    pageAmount: "",
    pageTax: "",
    AccAmount: "",
    AccTax: "",
  };
  const [accu, setAccu] = useState(initAccu);

  useEffect(() => {
    let pa = "";
    let pt = "";
    let aa = "";
    let at = "";

    if (data.previous) {
      pa =
        data.page.amountC +
        data.page.amountCa +
        data.page.taxC +
        data.page.taxCa;
      pt = data.page.taxC + data.page.taxCa;
      aa = pa + data.previous.balance;
      at = pt + data.previous.tax;

      setAccu({
        preBalance: data.previous.balance,
        preTax: data.previous.tax,
        pageAmount: pa,
        pageTax: pt,
        AccAmount: aa,
        AccTax: at,
      });
    }
  }, [data]);

  useEffect(() => {
    props.sum(accu);
    props.total(data.total);
  }, [accu]);

  const showPrint = () => {
    props.print();
  };

  return (
    <div className={`${styles.footer} mt-3`}>
      <div className="flex max-md:flex-col gap-2">
        <section className="w-full md:w-3/5">
          <div className={styles.boxborder}>
            <div className={styles.boxheader}>Page Summary</div>
            <div className="grid grid-cols-3 px-2 gap-2">
              <div>
                <label>Amount Cheque</label>

                <input
                  className="text-end w-full"
                  value={
                    Object.keys(data).length
                      ? data.page.amountC
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : ""
                  }
                />
              </div>
              <div>
                <label>Amount TAX(Cheque)</label>

                <input
                  className="text-end w-full"
                  value={
                    Object.keys(data).length
                      ? data.page.taxC
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : ""
                  }
                />
              </div>
              <div>
                <label>Total Cheque</label>

                <input
                  className="text-end w-full"
                  value={
                    Object.keys(data).length
                      ? (data.page.amountC + data.page.taxC)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : ""
                  }
                />
              </div>

              <div>
                <label>Amount Cash</label>

                <input
                  className="text-end w-full"
                  value={
                    Object.keys(data).length
                      ? data.page.amountCa
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : ""
                  }
                />
              </div>
              <div>
                <label>Amount TAX(Cash)</label>

                <input
                  className="text-end w-full"
                  value={
                    Object.keys(data).length
                      ? data.page.taxCa
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : ""
                  }
                />
              </div>
              <div>
                <label className="block">Total Cash</label>

                <input
                  className="text-end w-full"
                  value={
                    Object.keys(data).length
                      ? (data.page.amountCa + data.page.taxCa)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : ""
                  }
                />
              </div>

              <div className="col-start-2">
                <label>Total Cheque Qty</label>

                <input
                  className="text-end w-full"
                  value={Object.keys(data).length ? data.page.countC : ""}
                />
              </div>
              <div>
                <label>Total TAX Qty</label>

                <input
                  className="text-end w-full"
                  value={Object.keys(data).length ? data.page.countTax : ""}
                />
              </div>
            </div>
          </div>
        </section>

        {/*--------end 1st----------*/}

        <section className="w-full md:w-2/5">
          <div className={styles.boxborder}>
            <div className={styles.boxheader}>Balance Summary</div>
            <div className="grid grid-cols-2 gap-2 px-2">
              <div>
                <label>Previous Balance</label>

                <input
                  value={
                    accu.preBalance !== ""
                      ? accu.preBalance
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : ""
                  }
                  className="w-full text-end"
                />
              </div>
              <div>
                <label>Previous TAX</label>

                <input
                  value={
                    accu.preTax !== ""
                      ? accu.preTax
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : ""
                  }
                  className="w-full text-end"
                />
              </div>

              <div>
                <label>Page Balance</label>

                <input
                  value={
                    accu.pageAmount !== ""
                      ? accu.pageAmount
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : ""
                  }
                  className="w-full text-end"
                />
              </div>
              <div>
                <label>Page TAX</label>

                <input
                  value={
                    accu.pageTax !== ""
                      ? accu.pageTax
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : ""
                  }
                  className="w-full text-end"
                />
              </div>

              <div>
                <label>Total Balance</label>

                <input
                  value={
                    accu.AccAmount !== ""
                      ? accu.AccAmount.toFixed(2).replace(
                          /(\d)(?=(\d{3})+(?!\d))/g,
                          "$1,"
                        )
                      : ""
                  }
                  className="w-full text-end text-green-600"
                />
              </div>
              <div>
                <label>Total TAX</label>

                <input
                  value={
                    accu.AccTax !== ""
                      ? accu.AccTax.toFixed(2).replace(
                          /(\d)(?=(\d{3})+(?!\d))/g,
                          "$1,"
                        )
                      : ""
                  }
                  className="w-full text-end text-green-600"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="mt-3 flex justify-between max-md:flex-col">
        <div className={styles.boxborder}>
          <div className={styles.boxheader}>Show Summary</div>
          <div className="px-2 flex gap-1">
            <div className="basis-2/5">
              <label>Total Sale Volume</label>

              <input
                value={
                  Object.keys(data).length
                    ? data.total
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    : ""
                }
                className="w-full text-end"
              />
            </div>
            <div className="basis-2/5">
              <label column xs={6}>
                Remain Volume
              </label>

              <input
                value={
                  Object.keys(data).length
                    ? data.remain
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                    : ""
                }
                className="w-full text-end text-red-500"
              />
            </div>
            <div className="basis-1/5">
              <label>Last Page</label>

              <input
                value={Object.keys(data).length ? data.last : ""}
                className="w-full text-end"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";

import PaymentChq from "./collection-p-cheque";
import PaymentCash from "./collection-p-cash";
import PaymentTr from "./collection-p-tr";
import PaymentCredit from "./collection-p-credit";

import ModalInfo from "./ModalInfo";

import { CollectionContext } from "./collectionContext";
import useHeader from "../../../hook/useHeader";

export default function Payment(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_Finance_api;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { collection, setExId, setCustomerId, setPage, setCollectId } =
    useContext(CollectionContext);

  const [paytype, setPaytype] = useState([]);

  async function paytypeLoad() {
    try {
      const res = await Axios.get(url + "/paytypeLoad").then((res) => {
        const sortedData = res.data.sort((a, b) => {
          // Replace 'property' with the actual property you want to sort by
          if (a.type < b.type) return -1;
          if (a.type > b.type) return 1;
          return 0;
        });
        console.log(sortedData);
        setPaytype(sortedData);
      });
    } catch (err) {
      alert("unsuccessfull load paytype" + err);
    }
  }

  function paymentInfo(type) {
    switch (type) {
      case "1":
      case "2":
        return (
          <PaymentChq
            id={collection.collectId}
            return={dataCh}
            edit={edit}
            data={cheque}
          />
        );
      case "3":
      case "7":
      case "8":
      case "9":
        return (
          <PaymentCash
            receive={dataCa}
            edit={edit}
            recEdit={collect.billDate}
          />
        );
      case "4":
      case "5":
      case "10":
      case "11":
        return (
          <PaymentTr
            id={collection.collectId}
            bank={type}
            return={dataTr}
            edit={edit}
            data={tr}
          />
        );
      case "6":
        return (
          <PaymentCredit
            id={collection.collectId}
            receive={dataCa}
            return={dataCr}
            edit={edit}
            data={credit}
            recEdit={collect.billDate}
          />
        );
      default:
        return null;
    }
  }

  useEffect(() => {
    paytypeLoad();
  }, []);

  const initCollect = {
    page: "",
    book: "",
    customerID: "",
    exID: "",
    paidBy: "0",
    amount: 0,
    tax: 0,
    billDate: null,
    collectDate: null,
    holdRelease: null,
  };
  const [collect, setCollect] = useState(initCollect);

  const initCheque = {
    collectID: 0,
    bank: "",
    br: "",
    c_No: "",
    dueDate: "",
    paidBy: "",
  };
  const [cheque, setCheque] = useState(initCheque);

  const initTr = { collectID: 0, trBank: "", trID: "", trOpt: "", trDate: "" };
  const [tr, setTr] = useState(initTr);

  const initCredit = {
    collectID: 0,
    bank: "",
    type: "",
    holder: "",
    code: "",
    expire: "",
    bill: "",
  };
  const [credit, setCredit] = useState(initCredit);

  function dataCh(data) {
    if (data) {
      setCheque(data);
    }
  }

  function dataCa(data) {
    if (data) {
      setCollect({ ...collect, billDate: data });
    }
  }

  function dataTr(data) {
    if (data) {
      setTr(data);
    }
  }

  function dataCr(data) {
    if (data) {
      setCredit(data);
    }
  }

  useEffect(() => {
    setCollect({
      ...collect,
      exID: collection.exId,
      customerID: collection.customerId,
      page: collection.page,
    });
  }, [collection]);

  /*useEffect(() => {
        console.log(collect)
        switch (collect.PaidBy) {
            case '1': case '2':
                console.log(cheque);
                break;
            case '4': case '5':
                console.log(tr);
                break;
            case '6':
                console.log(credit);
                break;
            default:
                break;
        }
    }, [collect, credit, tr, cheque])*/

  const [modalShow, setModalShow] = useState(false);
  const initModalTxt = { header: "", body: "" };
  const [modalTxt, setModalTxt] = useState(initModalTxt);

  const [addResult, setResult] = useState("");

  function submitData() {
    const numGroup = ["Amount", "TAX"];

    var isNum = true;

    numGroup.map((x) => {
      if (isNaN(document.getElementById(`${x}txt`).value)) {
        document.getElementById(`${x}-span`).hidden = false;
        isNum = false;
      } else {
        document.getElementById(`${x}-span`).hidden = true;
      }
    });

    if (!isNum) {
      return;
    }

    if (collect.ExID === "") {
      setModalTxt({
        header: "Uncomplete Data",
        body: (
          <div>
            Please select <font style={{ color: "red" }}>"EXHIBITION"</font>{" "}
            before submit collection data
          </div>
        ),
      });
      setModalShow(true);
      return;
    }

    if (collect.CustomerID === "") {
      setModalTxt({
        header: "Uncomplete Data",
        body: (
          <div>
            Please specific <font style={{ color: "red" }}>"CUSTOMER"</font>{" "}
            before submit collection data
          </div>
        ),
      });
      setModalShow(true);
      return;
    }

    if (
      collect.paidBy !== "7" &&
      collect.paidBy !== "8" &&
      collect.paidBy !== "9"
    ) {
      if (collect.Amount === "" || collect.Amount === 0) {
        setModalTxt({
          header: "Uncomplete Data",
          body: (
            <div>
              Please fill <font style={{ color: "red" }}>"AMOUNT"</font> before
              submit collection data
            </div>
          ),
        });
        setModalShow(true);
        return;
      }
    }

    if (collect.Page === "") {
      setModalTxt({
        header: "Uncomplete Data",
        body: (
          <div>
            Please specific <font style={{ color: "red" }}>"PAGE"</font> before
            submit collection data
          </div>
        ),
      });
      setModalShow(true);
      return;
    }

    addCollective();
  }

  useEffect(() => {
    if (addResult === "Exceed") {
      setModalTxt({
        header: <div style={{ color: "red" }}>Data Exceed Page Limit</div>,
        body: "Please specific new PAGE for adding collection data",
      });
      setModalShow(true);
      return;
    }

    switch (collect.paidBy) {
      case "1":
      case "2":
        addCheque(addResult);
        break;
      case "4":
      case "5":
      case "10":
      case "11":
        addTr(addResult);
        break;
      case "6":
        addCredit(addResult);
        break;
      default:
        if (addResult) {
          setModalTxt({
            header: <div style={{ color: "green" }}>Information</div>,
            body: "Collective data adding complete",
          });
          setModalShow(true);
        }
        break;
    }

    setPage(collect.page);

    setCollect({
      page: "",
      book: "",
      customerID: "",
      exID: collection.exId,
      paidBy: 0,
      amount: 0,
      tax: 0,
      billDate: null,
      collectDate: null,
      holdRelease: null,
    });
    setCheque(initCheque);
    setTr(initTr);
    setCredit(initCredit);
    document.getElementById("payType").value = "0";

    setCustomerId("");
    document.getElementById("searchtxt").value = "";
    document.getElementById("Amounttxt").value = "";
    document.getElementById("TAXtxt").value = "";
  }, [addResult]);

  const addCollective = async () => {
    try {
      const res = await Axios.post(url + "/AddCollective", collect).then(
        (res) => setResult(res.data)
      );
    } catch (err) {
      setModalTxt({
        header: <div style={{ color: "red" }}>Insert Failed</div>,
        body: "Collective data adding not succeed : " + err,
      });
      setModalShow(true);
    }
  };

  const addCheque = async (id) => {
    try {
      const res = await Axios.post(url + "/postCheque?cid=" + id, cheque);
      setModalTxt({
        header: <div style={{ color: "green" }}>Information</div>,
        body: "Collective data adding complete",
      });
      setModalShow(true);
    } catch (err) {
      delCollection(id);
    }
  };

  const addTr = async (id) => {
    try {
      const res = await Axios.post(url + "/postTr?cid=" + id, tr);

      setModalTxt({
        header: <div style={{ color: "green" }}>Information</div>,
        body: "Collective data adding complete",
      });
      setModalShow(true);
    } catch (err) {
      delCollection(id);
    }
  };

  const addCredit = async (id) => {
    try {
      const res = await Axios.post(url + "/postCredit?cid=" + id, credit);
      setModalTxt({
        header: <div style={{ color: "green" }}>Information</div>,
        body: "Collective data adding complete",
      });
      setModalShow(true);
    } catch (err) {
      delCollection(id);
    }
  };

  async function delCollection(id) {
    try {
      const res = await Axios.delete(url + "/delCollect/" + id).then((res) => {
        if (res.data.message === "Delete completed") {
          setModalTxt({
            header: <div style={{ color: "red" }}>Insert Failed</div>,
            body: "Collective data adding not succeed ",
          });
          setModalShow(true);
        }
      });
    } catch (err) {
      setModalTxt({
        header: <div style={{ color: "red" }}>Critical Failed!</div>,
        body: "Collective data adding not succeed : please request admin to correct COLLECTION DATA",
      });
      setModalShow(true);
    }
  }

  function modalClose() {
    setModalShow(false);
  }

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    async function getEdit() {
      if (collection.collectId !== "") {
        const res = Axios.get(url + "/getEdit/" + collection.collectId).then(
          (res) => {
            switch (res.data.collective.paidBy) {
              case 1:
              case 2:
                setCheque(res.data.ch);
                break;
              case 4:
              case 5:
                setTr(res.data.tr);
                break;
              case 6:
                setCredit(res.data.cr);
                break;
              default:
                break;
            }
            setEdit(true);
            setCollect(res.data.collective);
            setCustomerId(res.data.collective.customerID);
          }
        );
      }
    }

    getEdit();
  }, [collection.collectId]);

  async function editData() {
    let type = Number(collect.paidBy);

    switch (type) {
      case 1:
      case 2:
        try {
          const res = await Axios.put(
            url + "/putCheque/" + cheque.payID,
            cheque
          );
        } catch (err) {
          alert("Warning! Cheque data unable to edit : " + err);
          return;
        }
        break;
      case 4:
      case 5:
        try {
          const res = await Axios.put(url + "/putTr/" + tr.payID, tr);
        } catch (err) {
          alert("Warning! Transfer data unable to edit : " + err);
          return;
        }
        break;
      case 6:
        try {
          const res = await Axios.put(url + "/putCr/" + credit.payID, credit);
        } catch (err) {
          alert("Warning! Credit Card data unable to edit : " + err);
          return;
        }
        break;
      default:
        break;
    }

    try {
      const res = await Axios.put(
        url + "/putCollective/" + collect.collectID,
        collect
      );
      setDefaultData();
    } catch (err) {
      alert("Warning! Collective data unable to edit : " + err);
    }
  }

  function setDefaultData() {
    setEdit(false);
    setCollect({
      page: "",
      book: "",
      customerID: "",
      paidBy: 0,
      amount: 0,
      tax: 0,
      billDate: null,
      collectDate: null,
      holdRelease: null,
      exID: collection.exId,
    });
    setCheque(initCheque);
    setTr(initTr);
    setCredit(initCredit);
    document.getElementById("payType").value = "0";
    setCollectId("");
    setCustomerId("");

    document.getElementById("searchtxt").value = "";
    document.getElementById("Amounttxt").value = "";
    document.getElementById("TAXtxt").value = "";
    document.getElementById("Pagetxt").value = "";
  }

  return (
    <div id="collection-pay" className="mt-3 mb-2">
      <div className="flex max-sm:flex-col gap-2">
        <div className="flex flex-col w-1/6">
          <label>Payment Type</label>
          <select
            className="cmb"
            id="payType"
            value={collect.paidBy}
            onChange={(e) =>
              setCollect({ ...collect, paidBy: e.target.value })
            }>
            <option value="0">---</option>
            {paytype.map((p) => (
              <option value={p.id}>{p.type}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-5/6">
          {paymentInfo(collect.paidBy.toString())}
          <div className="mt-2 flex justify-between">
            <div className="flex gap-2 max-sm:flex-wrap">
              <div>
                <div className="flex gap-2 items-center">
                  <label>Amount</label>

                  <input
                    placeholder="Amount"
                    id="Amounttxt"
                    value={collect.amount === 0 ? "" : collect.amount}
                    onChange={(e) =>
                      setCollect({ ...collect, amount: e.target.value })
                    }
                  />
                </div>
                <div className="text-end">
                  <span
                    style={{ color: "red" }}
                    id="Amount-span"
                    hidden={
                      !isNaN(collect.amount) || collect.amount == ""
                        ? true
                        : false
                    }>
                    Please fill data in number only
                  </span>
                </div>
              </div>
              <div>
                <div className="flex gap-2 items-center">
                  <label>Tax</label>
                  <input
                    placeholder="Tax"
                    id="TAXtxt"
                    value={collect.tax === 0 ? "" : collect.tax}
                    onChange={(e) =>
                      setCollect({ ...collect, tax: e.target.value })
                    }
                  />
                </div>

                <div className="text-end">
                  <span
                    style={{ color: "red" }}
                    id="TAX-span"
                    hidden={
                      !isNaN(collect.tax) || collect.tax == "" ? true : false
                    }>
                    Please fill data in number only
                  </span>
                </div>
              </div>
            </div>
            <div xs={2} className="text-end">
              <button
                onClick={edit ? editData : submitData}
                className={`${edit ? "btn-yellow" : "btn-green"} px-2`}>
                {edit ? "Edit Data" : "Submit Data"}
              </button>
            </div>
          </div>
          {edit && (
            <div className="my-2">
              <div className="text-end">
                <button variant="secondary" onClick={setDefaultData}>
                  Cancel Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ModalInfo show={modalShow} close={modalClose} text={modalTxt} />
    </div>
  );
}

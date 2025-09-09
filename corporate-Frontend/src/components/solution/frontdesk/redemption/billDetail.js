import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { NumericFormat } from "react-number-format";

import ModalSeach from "./modalSearch";
import ModalAddProduct from "./modalAddProduct";

export default function BillDetail(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_Coupon_api;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [modalShow, setModalShow] = useState(false);

  const closeModal = () => {
    setModalShow(false);
  };

  const searchEx = (e) => {
    if (exID.exID == "") {
      alert("Please select exhibition name before search exhibitor");
      return;
    }
    if (e.key === "Enter") {
      setModalShow(true);
    }
  };

  const initBill = {
    trID: "",
    CustomerID: "",
    CustomerName: "",
    Book: "",
    Bank: "",
    Product: "",
    deposit: "",
    Volumn: "",
  };
  const [billData, setBill] = useState(initBill);

  const [billList, setBillList] = useState([]);

  const [exID, setExID] = useState({ exID: "" });

  useEffect(() => {
    setExID({ exID: props.exID });
  }, [props.exID]);

  const [bank, setBank] = useState([]);
  const [product, setProduct] = useState([]);

  const getBank = async () => {
    const res = await Axios.get(url + "/GetCard").then((res) => {
      setBank(res.data);
    });
  };

  const getProduct = async () => {
    const res = await Axios.get(url + "/GetProduct").then((res) => {
      setProduct(res.data);
    });
  };

  useEffect(() => {
    getBank();
    getProduct();
  }, []);

  const fillCustomer = (id, name) => {
    setBill({
      ...billData,
      CustomerID: id,
      CustomerName: name,
      trID: "",
      Book: "",
      Bank: "",
      Product: "",
      deposit: "",
      Volumn: "",
    });
    setModalShow(false);
    getProduct();
    document.getElementById("bbank").selectedIndex = "0";
    document.getElementById("bproduct").selectedIndex = "0";
  };

  const [modalAddShow, setModalAddShow] = useState(false);

  const onModalAddClose = () => {
    setModalAddShow(false);
    getProduct();
  };

  const addBill = () => {
    if (
      billData.CustomerID == "" ||
      billData.Bank == "" ||
      billData.Volumn == ""
    ) {
      alert("Please insert necessary data before add bill");
      return;
    }
    if (Number(billData.Volumn) < Number(billData.deposit)) {
      alert("Warning! - Volume cannot less than deposit");
      return;
    }
    setBillList([...billList, billData]);
    getProduct();
    setBill({ ...billData, Product: "", deposit: "", Volumn: "" });
    document.getElementById("bproduct").selectedIndex = "0";
  };

  const deleteItem = (id) => {
    setBillList((b) => b.filter((b, i) => i != id));
  };

  const initSum = { deposit: 0, volume: 0 };
  const [summary, setSum] = useState(initSum);

  const sum = () => {
    let dep = 0;
    let vol = 0;
    if (billList.length > 0) {
      dep = billList.reduce((a, p) => (a = a + Number(p.deposit)), 0);
      vol = billList.reduce((a, p) => (a = a + Number(p.Volumn)), 0);
      setSum({ deposit: dep, volume: vol });
    }
  };

  useEffect(() => {
    props.data(billList);
    sum();
  }, [billList]);

  useEffect(() => {
    setBill(initBill);
    setBillList([]);
    setSum(initSum);
    document.getElementById("bbank").selectedIndex = "0";
    document.getElementById("bproduct").selectedIndex = "0";
  }, [props.reset]);

  return (
    <section>
      <div className="border rounded-md p-3 mt-8 mb-2 border-slate-400 relative">
        <div className="text-lg absolute -top-4 left-2 px-3 bg-white h-fit">
          Bill Detail
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          <div>
            <label for="bexname" className="block">
              Exhibitor Name:
            </label>
            <input
              id="bexname"
              className="w-full"
              onKeyDown={(e) => searchEx(e)}
              onChange={(e) =>
                setBill({ ...billData, CustomerName: e.target.value })
              }
              value={billData.CustomerName}
            />
          </div>
          <div>
            <label for="bbank" className="block">
              Cr. Issued Bank:
            </label>
            <select
              name="bankIssue"
              id="bbank"
              className="cmb w-full"
              onChange={(e) => setBill({ ...billData, Bank: e.target.value })}
            >
              <option value="0" disabled selected>
                Select Issue Bank
              </option>
              {bank.map((b) => (
                <option value={b.id} key={b.id}>
                  {b.cardName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label for="bbillno" className="block">
              Bill No:
            </label>
            <input
              id="bbillno"
              className="w-full"
              onChange={(e) => setBill({ ...billData, Book: e.target.value })}
              value={billData.Book}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          <div className="col-span-2">
            <label for="bproduct" className="block">
              Product:
            </label>
            <div className="flex flex-col sm:flex-row">
              <select
                name="Product"
                id="bproduct"
                className="cmb flex-auto"
                onChange={(e) =>
                  setBill({ ...billData, Product: e.target.value })
                }
              >
                <option value="0" disabled selected>
                  Select Product
                </option>
                {product.map((p) => (
                  <option value={p.id} key={p.id}>
                    {p.productName}
                  </option>
                ))}
              </select>
              <div
                className="btn-primary w-fit px-2"
                onClick={() => setModalAddShow(true)}
              >
                add product
              </div>
            </div>
          </div>
          <div>
            <label for="bdeposit" className="block">
              Deposit:
            </label>
            <NumericFormat
              value={billData.deposit}
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              onValueChange={(n) => setBill({ ...billData, deposit: n.value })}
              className="w-full text-right pr-3"
            />
          </div>
          <div>
            <label for="bvolume" className="block">
              Volume:
            </label>
            <NumericFormat
              value={billData.Volumn}
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              onValueChange={(n) => setBill({ ...billData, Volumn: n.value })}
              className="w-full text-right pr-3"
            />
          </div>
        </div>
        <div className="flex w-full justify-end">
          <div
            className="border-2 border-red-500 px-4 py-1 rounded-md w-fit bg-red-500 text-white hover:bg-white hover:text-red-500"
            onClick={addBill}
          >
            Add Bill
          </div>
        </div>
        <div className="mt-3">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="border border-black bg-slate-400">Exhibitor</th>
                <th className="border border-black bg-slate-400">Bank</th>
                <th className="border border-black bg-slate-400">Bill No</th>
                <th className="border border-black bg-slate-400">Product</th>
                <th className="border border-black bg-slate-400">Deposit</th>
                <th className="border border-black bg-slate-400" colSpan="2">
                  Volume
                </th>
              </tr>
            </thead>
            <tbody>
              {billList.length == 0 ? (
                <tr>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black text-right px-3">0.00</td>
                  <td className="border-y border-l border-black text-right px-3">
                    0.00
                  </td>
                  <td className="border-y border-r border-black">
                    <div className="w-fit aspect-square mx-auto hidden">
                      <RiDeleteBin6Line />
                    </div>
                  </td>
                </tr>
              ) : (
                billList.map((b, i) => (
                  <tr>
                    <td className="border border-black">{b.CustomerName}</td>
                    <td className="border border-black">
                      {b.Bank != "" &&
                        bank.filter((x) => x.id == b.Bank)[0].cardName}
                    </td>
                    <td className="border border-black">{b.Book}</td>
                    <td className="border border-black">
                      {b.Product != "" &&
                        product.filter((x) => x.id == b.Product)[0].productName}
                    </td>
                    <td className="border border-black text-right px-3">
                      {Number(b.deposit)
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                    <td className="border-y border-l border-black text-right px-3">
                      {Number(b.Volumn)
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                    <td className="border-y border-r border-black">
                      <div
                        className="w-fit aspect-square mx-auto cursor-pointer"
                        onClick={() => deleteItem(i)}
                      >
                        <RiDeleteBin6Line />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td className="border border-black text-right px-3" colSpan="4">
                  Amount
                </td>
                <td className="border border-black text-right px-3">
                  {summary.deposit
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                </td>
                <td className="border-y border-l border-black text-right px-3">
                  {summary.volume
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                </td>
                <td className="border-y border-r border-black"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <ModalSeach
        show={modalShow}
        onHide={closeModal}
        exID={exID.exID}
        search={billData.CustomerName}
        fill={fillCustomer}
      />
      <ModalAddProduct show={modalAddShow} onHide={onModalAddClose} />
    </section>
  );
}

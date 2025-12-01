import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { NumericFormat } from "react-number-format";

import CorrectDate from "../correctDate";
import ModalConfirmSave from "./modalConfirmSave";

import { dataContext } from "./collectionHistory";

function PaymentTerm() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cht;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { exhibitionC, customerC } = useContext(dataContext);

  const [exhibition, setExhibition] = exhibitionC;
  const [customer, setCustomer] = customerC;

  const [edit, setEdit] = useState(false);

  const [payment, setPayment] = useState({});

  const getPaymentTerm = async () => {
    try {
      const [res1, res2] = await Promise.all([
        Axios.post(url + "/getPayment", {
          exid: exhibition.code,
          cid: customer[0].cid,
        }),
        Axios.post(url + "/getVolume", {
          exid: exhibition.code,
          cid: customer[0].cid,
        }),
      ]).then(([r1, r2]) => {
        setPayment({ payment: r1.data, volume: r2.data });
      });
    } catch (error) {
      //console.log(error);
    }
  };

  useEffect(() => {
    if (customer.length > 0) {
      getPaymentTerm();
    }
  }, [customer]);

  useEffect(() => {
    //console.log(payment);
  }, [payment]);

  const updatePayment = async () => {
    try {
      const res = await Axios.post(url + "/updatePayment", payment.payment);
    } catch (error) {
      console.log(error);
    }
  };

  const [confirmOpen, setConfirmOpen] = useState(false);

  const confirmSave = (confirm) => {
    if (confirm) {
      updatePayment();
    }
    setConfirmOpen(false);
  };

  const closeModal = () => {
    setConfirmOpen(false);
  };

  const depositChange = (v) => {
    let dep = v;
    let pay = (payment.volume.volume - dep) / 2;
    setPayment({
      ...payment,
      payment: {
        ...payment.payment,
        pay1: dep,
        pay2: pay,
        pay3: pay,
      },
    });
  };

  const p1Change = (v) => {
    let pay = v;
    let dep = payment.payment.pay1;
    let pay2 = payment.volume.volume - dep - pay;
    setPayment({
      ...payment,
      payment: {
        ...payment.payment,
        pay2: pay,
        pay3: pay2,
      },
    });
  };

  const p2Change = (v) => {
    let pay = v;
    let dep = payment.payment.pay1;
    let pay2 = payment.volume.volume - dep - pay;
    setPayment({
      ...payment,
      payment: {
        ...payment.payment,
        pay3: pay,
        pay2: pay2,
      },
    });
  };

  return (
    <section id="payment-term">
      <div className="border border-zinc-300 rounded-md relative">
        <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600">
          Payment Term
        </div>
        <div className="px-3 py-4 grid md:grid-cols-3 gap-x-2 mt-2">
          <div className="flex gap-2 items-center">
            <label htmlFor="pt1" className="w-[140px]">
              Deposit
            </label>
            <NumericFormat
              id="pt1"
              className={`${
                !edit ? "border-none" : ""
              } text-right w-full disabled:text-green-600`}
              disabled={!edit}
              value={
                Object.keys(payment).length != 0 &&
                payment.payment.pay1 != undefined &&
                payment.payment.pay1 != 0
                  ? payment.payment.pay1
                  : ""
              }
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              onValueChange={(n) => depositChange(n.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="dd1" className="w-[140px]">
              Due Date
            </label>
            <input
              type={edit ? "date" : "text"}
              id="dd1"
              className={`${
                !edit ? "border-none" : ""
              } text-right w-full disabled:text-red-600`}
              disabled={!edit}
              value={
                Object.keys(payment).length != 0 &&
                payment.payment.term1 != undefined
                  ? CorrectDate(
                      payment.payment.term1,
                      "n",
                      edit ? "yyyy-mm-dd" : ""
                    )
                  : ""
              }
              onChange={(e) =>
                setPayment({
                  ...payment,
                  payment: {
                    ...payment.payment,
                    term1: CorrectDate(e.target.value, "n", "yyyy-mm-dd"),
                  },
                })
              }
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="extra" className="w-[140px]">
              Extra Condition
            </label>
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="pt2" className="w-[140px]">
              Payment 1
            </label>
            <NumericFormat
              id="pt2"
              className={`${
                !edit ? "border-none" : ""
              } text-right w-full disabled:text-green-600`}
              disabled={!edit}
              value={
                Object.keys(payment).length != 0 &&
                payment.payment.pay2 != undefined &&
                payment.payment.pay2 != 0
                  ? payment.payment.pay2
                  : ""
              }
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              onValueChange={(n) => p1Change(n.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="dd2" className="w-[140px]">
              Due Date
            </label>
            <input
              type={edit ? "date" : "text"}
              id="dd2"
              className={`${
                !edit ? "border-none" : ""
              } text-right w-full disabled:text-red-600`}
              disabled={!edit}
              value={
                Object.keys(payment).length != 0 &&
                payment.payment.term2 != undefined
                  ? CorrectDate(
                      payment.payment.term2,
                      "n",
                      edit ? "yyyy-mm-dd" : ""
                    )
                  : ""
              }
              onChange={(e) =>
                setPayment({
                  ...payment,
                  payment: {
                    ...payment.payment,
                    term2: CorrectDate(e.target.value, "n", "yyyy-mm-dd"),
                  },
                })
              }
            />
          </div>
          <div>
            <textarea
              rows={2}
              id="extra"
              className={`${
                !edit
                  ? "border-none text-right"
                  : "border border-gray-400 rounded-md outline-none p-1 text-start"
              }  w-full focus:shadow-[0_0_0_0.2rem_white,0_0_5px_0.25rem_red] focus:border-white`}
              disabled={!edit}
              value={
                !edit
                  ? Object.keys(payment).length != 0 &&
                    payment.payment.other != undefined
                    ? payment.payment.other +
                      (payment.payment.opay != undefined &&
                        " Pay: " + payment.payment.opay) +
                      (payment.payment.oTerm != undefined &&
                        " due: " + CorrectDate(payment.payment.oTerm, "n"))
                    : ""
                  : Object.keys(payment).length != 0 &&
                    payment.payment.other != undefined
                  ? payment.payment.other
                  : ""
              }
              onChange={(e) =>
                setPayment({
                  ...payment,
                  payment: {
                    ...payment.payment,
                    other: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="pt3" className="w-[140px]">
              Payment 2
            </label>
            <NumericFormat
              id="pt3"
              className={`${
                !edit ? "border-none" : ""
              } text-right w-full disabled:text-green-600`}
              disabled={!edit}
              value={
                Object.keys(payment).length != 0 &&
                payment.payment.pay3 != undefined &&
                payment.payment.pay3 != 0
                  ? payment.payment.pay3
                  : ""
              }
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              onValueChange={(n) => p2Change(n.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="dd3" className="w-[140px]">
              Due Date
            </label>
            <input
              type={edit ? "date" : "text"}
              id="dd3"
              className={`${
                !edit ? "border-none" : ""
              } text-right w-full disabled:text-red-600`}
              disabled={!edit}
              value={
                Object.keys(payment).length != 0 &&
                payment.payment.term3 != undefined
                  ? CorrectDate(
                      payment.payment.term3,
                      "n",
                      edit ? "yyyy-mm-dd" : ""
                    )
                  : ""
              }
              onChange={(e) =>
                setPayment({
                  ...payment,
                  payment: {
                    ...payment.payment,
                    term3: CorrectDate(e.target.value, "n", "yyyy-mm-dd"),
                  },
                })
              }
            />
          </div>
          <div>
            {edit && (
              <div className={`flex flex-col gap-1 mb-1`}>
                <div className="flex gap-1 items-center">
                  <label htmlFor="payEx" className="w-[120px]">
                    Payment
                  </label>
                  <NumericFormat
                    id="payEx"
                    className={`text-right w-full`}
                    value={
                      Object.keys(payment).length != 0 &&
                      payment.payment.opay != undefined &&
                      payment.payment.opay != 0
                        ? payment.payment.opay
                        : ""
                    }
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    onValueChange={(n) =>
                      setPayment({
                        ...payment,
                        payment: { ...payment.payment, opay: n.value },
                      })
                    }
                  />
                </div>
                <div className="flex gap-1 items-center">
                  <label htmlFor="dueEx" className="w-[120px]">
                    Due
                  </label>
                  <input
                    type="date"
                    id="dueEx"
                    className="text-right w-full"
                    onChange={(e) =>
                      setPayment({
                        ...payment,
                        payment: {
                          ...payment.payment,
                          oTerm: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <button
                className={`${edit ? "btn-primary" : "btn-green"} px-3`}
                onClick={() => {
                  if (edit) {
                    setConfirmOpen(true);
                  }
                  setEdit(!edit);
                }}
              >
                {!edit ? "Edit" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ModalConfirmSave
        show={confirmOpen}
        onHide={closeModal}
        confirmSave={confirmSave}
        name={Object.keys(customer).length != 0 && customer[0].name}
      />
    </section>
  );
}

export default PaymentTerm;

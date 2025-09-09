import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { dataContext } from "./collectionHistory";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useLocalStorage } from "../../../hook/useLocalStorage";
import { MdOutlineChangeCircle } from "react-icons/md";

import ModalConfirmDel from "./modalConfirmDel";
import ModalChangeAcc from "./modalChangeAcc";
import CorrectDate from "../correctDate";

function PaymentList() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cht;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { exhibitionC, customerC, dataC } = useContext(dataContext);

  const [exhibition, setExhibition] = exhibitionC;
  const [customer, setCustomer] = customerC;
  const [data, setData] = dataC;

  const getPaymentList = async () => {
    try {
      const res = await Axios.post(url + "/getHistory", {
        cid: customer[0].cid,
        exid: exhibition.code,
      }).then((res) => setData(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (customer.length != 0) {
      getPaymentList();
    }
  }, [customer]);

  useEffect(() => {
    //console.log(data);
  }, [data]);

  const acc = useLocalStorage("user")[0].ALevel;

  const [delitem, setDelitem] = useState(0);

  const [isModalDel, setIsModalDel] = useState(false);

  const closeModal = () => {
    setIsModalDel(false);
  };

  const deleteItem = async () => {
    const res = await Axios.delete(
      url + "/deleteCollective/" + delitem.id
    ).then((r) => {
      if (r.status == 200) {
        setDelitem(0);
        closeModal();
        getPaymentList();
      } else {
        alert("Delete failed");
        closeModal();
      }
    });
  };

  const delClick = (id) => {
    const dat = data.filter((d) => d.id == id)[0];
    setDelitem(dat);
    setIsModalDel(true);
  };

  const [isModalChange, setIsModalChange] = useState(false);
  const [changeitem, setChangeitem] = useState(0);

  const changeClick = (id) => {
    const dat = data.filter((d) => d.id == id)[0];
    setChangeitem(dat);
    setIsModalChange(true);
  };

  const closeModalChange = () => {
    setIsModalChange(false);
  };

  const saveChange = async (acc, hold) => {
    const res = await Axios.put(url + "/updateAccount", {
      id: changeitem.id,
      account: acc,
      hold: hold,
    }).then((r) => {
      if (r.status == 200) {
        setChangeitem(0);
        closeModalChange();
        getPaymentList();
      } else {
        alert("Update failed");
        closeModalChange();
      }
    });
  };

  return (
    <section id="payment-term">
      <div className="px-2 py-1 ml-3 text-red-600">Payment List</div>
      <div>
        <table className="w-full">
          <thead>
            <tr className="border-t border-b *:border *:border-gray-300 bg-slate-200 text-gray-500">
              <th>No.</th>
              <th className="w-[30%]">List</th>
              <th className="min-w-fit">Due</th>
              <th className="min-w-fit">Amount</th>
              <th className="min-w-fit">TAX</th>
              <th className="min-w-fit">Total</th>
              <th>Page</th>
              <th className="min-w-fit">Account</th>
            </tr>
          </thead>
          <tbody>
            {data.length == 0
              ? Array.from({ length: 5 }).map((a, i) => (
                  <tr className="border-t border-b *:border *:border-gray-300">
                    <td className="text-center">{i + 1}</td>
                    <td colSpan="7"></td>
                  </tr>
                ))
              : data.map((d, i) => (
                  <tr className="border-t border-b *:border *:border-gray-300">
                    <td className="text-center">{i + 1}</td>
                    <td>{d.list}</td>
                    <td className="text-right pr-1">
                      {CorrectDate(d.due, "s")}
                    </td>
                    <td className="text-right pr-1">
                      {d.amount
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                    <td className="text-right pr-1">
                      {d.tax
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                    <td className="text-right pr-1">
                      {(d.amount + d.tax)
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </td>
                    <td className="text-center">{d.page}</td>
                    <td>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="mr-2 text-orange-400 text-lg"
                            onClick={() => changeClick(d.id)}
                          >
                            <MdOutlineChangeCircle />
                          </div>
                          {d.hold == 1 && (
                            <div>
                              <span className="text-red-500">on Hold</span>
                              <span> / </span>
                            </div>
                          )}
                          {d.account == "C"
                            ? "Company"
                            : d.account == "P"
                            ? "Personal"
                            : ""}
                        </div>
                        {acc == 1 && (
                          <div
                            onClick={() => delClick(d.id)}
                            className="text-red-500"
                          >
                            <RiDeleteBin2Line />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <ModalConfirmDel
        show={isModalDel}
        onHide={closeModal}
        data={delitem}
        confirmDel={deleteItem}
      />
      <ModalChangeAcc
        show={isModalChange}
        onHide={closeModalChange}
        data={changeitem}
        confirmChange={saveChange}
      />
    </section>
  );
}

export default PaymentList;

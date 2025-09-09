import React, { useContext, useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "./customerHistoryData";

import ChdHeaderFilter from "./chdHeaderFilter";
import ModalSeach from "./modalSearch";

export default function CustomerHistoryHeader() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_chd;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { customerC } = useContext(dataContext);

  const [modalShow, setModalShow] = useState(false);

  const [customer, setCustomer] = customerC;

  const closeModal = () => {
    setModalShow(false);
  };

  const pressEnter = (e) => {
    if (e.key == "Enter") {
      setModalShow(true);
    }
  };

  const fillCustomer = (id, cname) => {
    setCustomer({ ...customer, customerID: id, Name: cname });
    setModalShow(false);
  };

  const consoleAddr = (dat) => {
    if (dat.province != undefined) {
      let c = dat;

      let ts = "";
      let td = "";
      switch (c.province) {
        case "กรุงเทพมหานคร":
          ts = "แขวง";
          td = "เขต";
          break;
        case "กรุงเทพฯ":
          ts = "แขวง";
          td = "เขต";
          break;
        case "กรุงเทพ":
          ts = "แขวง";
          td = "เขต";
          break;
        case "กทม":
          ts = "แขวง";
          td = "เขต";
          break;
        case "กทม.":
          ts = "แขวง";
          td = "เขต";
          break;
        default:
          ts = "ตำบล";
          td = "อำเภอ";
      }

      return (
        c.street +
        " " +
        ts +
        c.subDistrict +
        " " +
        td +
        c.district +
        " " +
        c.province +
        " " +
        c.postal
      );
    }
  };

  const [addr, setAddr] = useState("");

  const getAddr = async () => {
    const res = await Axios.get(
      url + "/getCustomerAddr/" + customer.customerID
    ).then((res) => {
      setAddr(res.data);
    });
  };

  useEffect(() => {
    if (customer.customerID != "") {
      getAddr();
    } else {
      setAddr("");
    }
  }, [customer.customerID]);

  useEffect(() => {
    console.log(addr);
  }, [addr]);

  return (
    <section id="customer-hedaer">
      <div className="flex max-md:flex-col justify-between w-full 2xl:w-4/5">
        <div id="customersearch" className="md:max-w-[40%] flex gap-3 flex-col">
          <div className="flex max-md:flex-wrap gap-3 items-center">
            <label htmlFor="name" className="">
              Customer Name:
            </label>
            <input
              type="text"
              id="name"
              className="w-72"
              onChange={(e) =>
                setCustomer({ ...customer, Name: e.target.value })
              }
              onKeyDown={(e) => pressEnter(e)}
              value={customer.Name}
            />
            <div>
              <button
                className="btn-green px-3"
                onClick={() => setModalShow(true)}
              >
                search
              </button>
            </div>
          </div>

          <div className="flex max-md:flex-wrap gap-3 items-start">
            <label htmlFor="addr" className="">
              Address:
            </label>
            <div>
              <span>{consoleAddr(addr)}</span>
              <br />
              <span>โทร. {addr.tel}</span>
            </div>
          </div>
        </div>
        <ChdHeaderFilter />
      </div>

      <ModalSeach
        show={modalShow}
        onHide={closeModal}
        search={customer.Name}
        fill={fillCustomer}
      />
    </section>
  );
}

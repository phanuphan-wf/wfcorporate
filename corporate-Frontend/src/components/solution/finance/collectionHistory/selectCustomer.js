import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { useLocation } from "react-router-dom";

import ModalSeach from "./modalSearch";
import { dataContext } from "./collectionHistory";

function SelectCustomer() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cht;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { exhibitionC, customerC } = useContext(dataContext);

  const [exhibition, setExhibition] = exhibitionC;
  const [customer, setCustomer] = customerC;

  const [isSearch, setIsSearch] = useState(false);

  const searchCustomer = (e) => {
    if (e.key === "Enter") {
      setIsSearch(true);
    }
  };

  const closeSearch = () => {
    setIsSearch(false);
  };

  const [search, setSearch] = useState("");

  const fillCustomer = async (id) => {
    const data = { cid: id, exid: exhibition.code };
    const res = await Axios.post(url + "/getCustomerData", data).then((r) => {
      if (r.status === 200) {
        setCustomer(r.data);
        setSearch(
          (r.data[0].prefix ? r.data[0].prefix + " " : "") +
            r.data[0].name.trim() +
            (r.data[0].subfix ? " " + r.data[0].subfix : "")
        );
      }
    });
    setIsSearch(false);
  };

  useEffect(() => {
    //console.log(customer);
  }, [customer]);

  const location = useLocation();

  var customerId;

  if (location.state) {
    ({ customerId } = location.state);
  }

  useEffect(() => {
    if (exhibition.code) {
      if (customerId) {
        fillCustomer(customerId);
      }
    }
  }, [exhibition.code]);

  return (
    <section id="select-exhibition">
      <div className="border border-zinc-300 rounded-md relative h-full">
        <div className="absolute bg-white px-2 py-1 -top-4 left-3 text-red-600">
          Customer
        </div>
        <div className="h-full">
          <div className="flex flex-col justify-between px-3 py-4 h-full">
            <div className="flex items-center">
              <label htmlFor="cName" className="w-[140px] flex-shrink-0">
                Customer Name
              </label>
              <input
                id="cName"
                className="w-full"
                onKeyDown={(e) => searchCustomer(e)}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="cBooth" className="w-[140px]">
                Booth No
              </label>
              <span className={`${customer.length ? "" : "text-gray-400"}`}>
                {customer.length > 0
                  ? customer.map((c, i) => {
                      if (i != 0) {
                        return ", " + c.booth;
                      } else {
                        return c.booth;
                      }
                    })
                  : "Customer Booth"}
              </span>
            </div>
            <div className="flex items-center">
              <label htmlFor="cSpace" className="w-[140px]">
                Space
              </label>
              <span className={`${customer.length ? "" : "text-gray-400"}`}>
                {customer.length > 0
                  ? customer.map((c, i) => {
                      if (i != 0) {
                        return " " + c.space;
                      } else {
                        return c.space;
                      }
                    }) + " sq.m."
                  : "Customer Spaces"}
              </span>
            </div>
            <div className="flex items-center">
              <label htmlFor="cSale" className="w-[140px]">
                Sales
              </label>
              <span className={`${customer.length ? "" : "text-gray-400"}`}>
                {customer.length > 0
                  ? customer[0].sale.trim()
                  : "Sales representative"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ModalSeach
        show={isSearch}
        onHide={closeSearch}
        exid={exhibition.code}
        search={search}
        fill={fillCustomer}
      />
    </section>
  );
}

export default SelectCustomer;

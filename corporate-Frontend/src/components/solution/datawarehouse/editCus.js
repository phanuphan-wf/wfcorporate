import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddrList from "./addCustomer/addrList";
import CustomerAddr from "./addCustomer/editAddr";
import Axios from "axios";
import useHeader from "../../hook/useHeader";

export const dataContext = createContext();

export default function EditCustomer(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const initCustomerA = {
    Street: "",
    SubDistrict: "0",
    District: "0",
    Province: "0",
    Postal: "",
    Tel: "",
    Fax: "",
    web: "",
    email: "",
    TaxID: "",
    TaxName: "",
    Branch: "1",
    subBranch: "000",
  };
  const [customerA, setCustomerA] = useState(initCustomerA);

  const [isEdit, setIsEdit] = useState(false);

  const { cid } = useParams();

  const [customerName, setCustomerName] = useState({});

  const getCustomer = async () => {
    const res = await Axios.get(url + "/getCustomer/" + cusID).then((r) =>
      setCustomerName(r.data)
    );
  };

  useEffect(() => {
    if (cid) {
      setCusID(cid);
    }
  }, [cid]);

  useEffect(() => {
    if (props.cid) {
      setCusID(props.cid);
    }
  }, [props.cid]);

  const [cusID, setCusID] = useState(0);

  useEffect(() => {
    if (cusID != 0) {
      getCustomer();
    }
  }, [cusID]);

  useEffect(() => {
    if (customerA.addrID) {
      setIsEdit(true);
    }
  }, [customerA.addrID]);

  const [aftSubmit, setAftSubmit] = useState(false);

  const submitAddr = async () => {
    if (customerA.addrID == undefined) {
      const res = await Axios.post(url + "/addAddr/" + cusID, customerA).then(
        (r) => {
          if (r.status === 200) {
            setCustomerA(initCustomerA);
            document.getElementById("province").value = "0";
            document.getElementById("districtcmb").value = "0";
            document.getElementById("subdistrictcmb").value = "0";
          }
        }
      );
    } else {
      const res = await Axios.put(url + "/editAddr/" + cusID, customerA).then(
        (r) => {
          if (r.status === 200) {
            setCustomerA(initCustomerA);
            document.getElementById("province").value = "0";
            document.getElementById("districtcmb").value = "0";
            document.getElementById("subdistrictcmb").value = "0";
          }
        }
      );
    }
    setAftSubmit(!aftSubmit);
    setIsEdit(false);
  };
  useEffect(() => {
    //console.log(customerA);
  }, [customerA]);

  useEffect(() => {
    if (!isEdit) {
      setCustomerA(initCustomerA);
    }
  }, [isEdit]);

  return (
    <dataContext.Provider
      value={{
        cusIDC: [cusID, setCusID],
        customerAC: [customerA, setCustomerA],
        aftSubmitC: [aftSubmit, setAftSubmit],
      }}
    >
      <section id="edit-customer">
        <h1 className="text-xl">Edit Customer Data</h1>
        <div className="flex max-md:flex-wrap gap-2 my-4">
          <label htmlFor="customerName">Customer Name :</label>
          <span>{customerName.name}</span>
        </div>
        <AddrList />
        <div>
          <button
            className="border border-zinc-400 rounded-md px-4 bg-zinc-400 text-white hover:text-zinc-400 hover:bg-white my-4"
            onClick={() => setIsEdit(!isEdit)}
          >
            <div className="flex gap-3 items-center">
              <div>
                {isEdit
                  ? customerA.addrID
                    ? "Close edit panel"
                    : "Close add panel"
                  : "Add new address"}
              </div>
              <div className="w-5 h-5 bg-white rounded-full relative">
                <div
                  className={`border-r-[3px] border-b-[3px] w-3 h-3 border-zinc-400 absolute top-1/2 left-1/2 -translate-x-1/2 transition duration-300 ${
                    isEdit
                      ? "-rotate-[135deg] -translate-y-1/3"
                      : "rotate-45 -translate-y-2/3"
                  }`}
                ></div>
              </div>
            </div>
          </button>
          {isEdit && (
            <div
              className={`${
                isEdit ? "origin-top transition duration-1000" : ""
              }`}
            >
              <CustomerAddr />
              <div className="my-2 w-full md:w-3/4 flex justify-end">
                <button
                  className={`px-2 cursor-pointer ${
                    customerA.addrID
                      ? "bg-yellow-500 border-yellow-500  hover:text-yellow-500"
                      : "bg-green-600 border-green-600 hover:text-green-600"
                  } text-white hover:bg-white rounded-md py-1 border`}
                  onClick={submitAddr}
                >
                  {customerA.addrID ? "edit Address" : "Add Address"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </dataContext.Provider>
  );
}

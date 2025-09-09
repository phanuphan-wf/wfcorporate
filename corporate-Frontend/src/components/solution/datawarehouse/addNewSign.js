import React, { createContext, useEffect, useState } from "react";
import useHeader from "../../hook/useHeader";
import Axios from "axios";
import { useParams } from "react-router-dom";

import SignInput from "./addNewSign/signInput";
import SignList from "./addNewSign/signList";

import { useNavigate } from "react-router-dom";

export const dataContext = createContext();

export default function AddNewSign(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { cid } = useParams();

  const edit = props.edit;

  const [cusID, setCusID] = useState("");

  const [customer, setCustomer] = useState({});

  const initSignname = {
    billing: false,
    customerID: 0,
    name: "",
    personalID: "",
    picture: 0,
    position: "",
    sign: false,
    signature: 0,
    tel: "",
  };

  const [signname, setSignname] = useState(initSignname);

  const getCustomer = async (id) => {
    const res = await Axios.get(url + "/getCustomer/" + cusID).then((r) =>
      setCustomer(r.data)
    );
  };

  useEffect(() => {
    setCusID(cid);
  }, [cid]);

  useEffect(() => {
    if (edit) {
      setCusID(props.cid);
    }
  }, [edit]);

  useEffect(() => {
    if (cusID) {
      getCustomer();
    }
  }, [cusID]);

  const [upload, setUpload] = useState(false);

  const nav = useNavigate();

  const navProduct = () => {
    nav("/solution/datawarehouse/addnewproduct/" + cusID);
  };

  const [editlist, setEditlist] = useState(false);

  //console.log(signname);

  return (
    <dataContext.Provider
      value={{
        cusID,
        uploadC: [upload, setUpload],
        signnameC: [signname, setSignname],
        editlistC: [editlist, setEditlist],
      }}
    >
      <section id="customer-signname" className="xl:container">
        <div className="my-3">
          <h1 className="text-2xl">Customer Data</h1>
        </div>
        <div className="text-lg">Customer Sign Person</div>
        <div className="flex items-center gap-2 mt-4">
          <div>Customer Name :</div>
          <div>{customer.name}</div>
        </div>
        <SignInput />
        <SignList />
        {!edit && (
          <div className="flex justify-end mt-4">
            <button
              className="btn-primary bg-slate-400 border-slate-400 hover:border-slate-400 hover:bg-white hover:text-slate-400 px-1"
              onClick={navProduct}
            >
              Add Products
            </button>
          </div>
        )}
      </section>
    </dataContext.Provider>
  );
}

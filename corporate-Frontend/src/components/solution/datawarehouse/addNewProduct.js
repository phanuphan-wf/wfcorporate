import React, { createContext, useEffect, useState } from "react";
import useHeader from "../../hook/useHeader";
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import ProductInput from "./addNewProduct/productInput";
import ProductList from "./addNewProduct/productList";

export const dataContext = createContext();

export default function AddNewProduct(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { cid } = useParams();

  const [customer, setCustomer] = useState({});

  const getCustomer = async () => {
    const res = await Axios.get(url + "/getCustomer/" + cusID).then((r) =>
      setCustomer(r.data)
    );
  };

  const [cusID, setCusID] = useState(0);

  useEffect(() => {
    if (props.cid) {
      setCusID(props.cid);
    }
  }, [props.cid]);

  useEffect(() => {
    if (cid) {
      setCusID(cid);
    }
  }, [cid]);

  useEffect(() => {
    if (cusID) {
      getCustomer();
    }
  }, [cusID]);

  const [upload, setUpload] = useState(false);

  const nav = useNavigate();

  const navSignname = () => {
    nav("/solution/datawarehouse/addnewsign/" + cusID);
  };

  const initProduct = {
    CustomerID: 0,
    Name: "",
    Detail: "",
    Brand: "",
    Picture: "",
  };

  const [product, setProduct] = useState(initProduct);

  return (
    <dataContext.Provider
      value={{
        cusIDC: [cusID, setCusID],
        uploadC: [upload, setUpload],
        productC: [product, setProduct],
      }}
    >
      <section id="customer-signname" className="xl:container">
        <div className="my-3">
          <h1 className="text-2xl">Customer Data</h1>
        </div>
        <div className="text-lg">Customer Products</div>
        <div className="flex items-center gap-2 mt-4">
          <div>Customer Name :</div>
          <div>{customer.name}</div>
        </div>
        <ProductInput />
        <ProductList />
        {cid != undefined && (
          <div className="flex justify-end mt-4">
            <button
              className="btn-primary bg-slate-400 border-slate-400 hover:border-slate-400 hover:bg-white hover:text-slate-400 px-1"
              onClick={navSignname}
            >
              Add Sign Person
            </button>
          </div>
        )}
      </section>
    </dataContext.Provider>
  );
}

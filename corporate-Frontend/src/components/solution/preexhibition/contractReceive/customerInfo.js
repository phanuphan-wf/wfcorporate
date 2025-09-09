import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { dataContext } from "../contractReceive";
import ModalEditSign from "./modalEditSign";
import ModalEditAddr from "./modalEditAddr";
import ModalEditProduct from "./modalEditProduct";

export default function CustomerInfo() {
  const { contractDetailC, signatureC } = useContext(dataContext);
  const [contractDetail, setContractDetail] = contractDetailC;
  const [signImg, setSignImg] = signatureC;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctr;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [customerA, setCustomerA] = useState({});
  const [customerS, setCustomerS] = useState({});

  const getInfo = async () => {
    try {
      const res = await Axios.get(
        url + "/customerInfoA/" + contractDetail.CustomerID
      ).then((r) => setCustomerA(r.data));
    } catch (err) {
      alert("Error! - Cannot load customer Address");
    }

    try {
      const res = await Axios.get(
        url + "/customerInfoS/" + contractDetail.CustomerID
      ).then((r) => setCustomerS(r.data));
    } catch (err) {
      alert("Error! - Cannot load customer signature");
    }
  };

  useEffect(() => {
    if (contractDetail.CustomerID != 0) {
      getInfo();
    } else {
      setCustomerA({});
      setCustomerS({});
    }
  }, [contractDetail.CustomerID]);

  useEffect(() => {
    setSignImg({ img: customerS.signature });
    setContractDetail({ ...contractDetail, SignID: customerS.authorizeID });
  }, [customerS]);

  const consoleAddr = () => {
    if (customerA.province != undefined) {
      let c = customerA;

      let ts = "";
      switch (c.province) {
        case "กรุงเทพมหานคร":
          ts = "แขวง";
          break;
        case "กรุงเทพฯ":
          ts = "แขวง";
          break;
        case "กรุงเทพ":
          ts = "แขวง";
          break;
        case "กทม":
          ts = "แขวง";
          break;
        case "กทม.":
          ts = "แขวง";
          break;
        default:
          ts = "ตำบล";
      }

      let td = "";
      switch (c.province) {
        case "กรุงเทพมหานคร":
          td = "เขต";
          break;
        case "กรุงเทพฯ":
          td = "เขต";
          break;
        case "กรุงเทพ":
          td = "เขต";
          break;
        case "กทม":
          td = "เขต";
          break;
        case "กทม.":
          td = "เขต";
          break;
        default:
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

  const [modalSign, setModalSign] = useState(false);

  const closeModalSign = () => {
    setModalSign(false);
  };

  const editSign = () => {
    getInfo();
    setModalSign(false);
  };

  const [modalAddr, setModalAddr] = useState(false);

  const closeModalAddr = () => {
    setModalAddr(false);
  };

  const editAddr = () => {
    getInfo();
    setModalAddr(false);
  };

  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    if (contractDetail.CustomerID != 0) {
      setIsCustomer(true);
    } else {
      setIsCustomer(false);
    }
  }, [contractDetail.CustomerID]);

  const [modalProduct, setModalProduct] = useState(false);

  const closeModalProduct = () => {
    setModalProduct(false);
  };

  return (
    <div>
      <div className="customer-info flex justify-between items-end max-md:flex-wrap mt-4">
        <div className=" w-full md:basis-4/5">
          <div className="flex items-start mb-3 max-sm:mt-2 max-md:flex-wrap md:justify-between gap-2">
            <div className="flex items-start">
              <div className="mr-2">Sign Name :</div>
              <span>{customerS.name}</span>
            </div>
            <div>
              <button
                className="btn-primary px-2 disabled:opacity-50 disabled:hover:bg-[red] disabled:hover:text-white"
                onClick={() => setModalSign(true)}
                disabled={!isCustomer}
              >
                Edit Signname
              </button>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-2">Address :</div>
            <span>{consoleAddr()}</span>
          </div>
          <div className="w-3/4 flex justify-between">
            <div className="flex items-start">
              <div className="mr-2">Tel :</div>
              <span>{customerA.tel}</span>
            </div>
            <div className="flex items-start">
              <div className="mr-2">Fax :</div>
              <span>{customerA.fax}</span>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-2">Email :</div>
            <span>{customerA.email}</span>
          </div>
        </div>
        <div>
          <button
            className="btn-primary w-[120px] disabled:opacity-50 disabled:hover:bg-[red] disabled:hover:text-white"
            onClick={() => setModalAddr(true)}
            disabled={!isCustomer}
          >
            Edit data
          </button>
        </div>
      </div>
      <div className="w-full flex justify-end mt-3">
        <button
          className="btn-primary w-[120px] disabled:opacity-50 disabled:hover:bg-[red] disabled:hover:text-white"
          onClick={() => setModalProduct(true)}
          disabled={!isCustomer}
        >
          Edit products
        </button>
      </div>

      <ModalEditSign
        show={modalSign}
        onHide={closeModalSign}
        cid={contractDetail.CustomerID}
        aftEditSign={editSign}
      />
      <ModalEditAddr
        show={modalAddr}
        onHide={closeModalAddr}
        cid={contractDetail.CustomerID}
        aftEditSign={editAddr}
      />
      <ModalEditProduct
        show={modalProduct}
        onHide={closeModalProduct}
        cid={contractDetail.CustomerID}
      />
    </div>
  );
}

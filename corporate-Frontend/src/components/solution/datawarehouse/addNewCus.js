import React, { createContext, useEffect, useState } from "react";
import CustomerName from "./addCustomer/customerName";
import CustomerAddr from "./addCustomer/customerAddr";
import useHeader from "../../hook/useHeader";
import Axios from "axios";
import ModalInfo from "./addCustomer/modalInfo";
import { useNavigate } from "react-router-dom";

export const dataContext = createContext();

export default function AddNewCus(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const nav = useNavigate();

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

  const initCustomerName = {
    TypeID: 0,
    Name: "",
    logo: "",
    FromExhibition: "WorldFair",
    newcus: false,
  };
  const [customerName, setCustomerName] = useState(initCustomerName);

  useEffect(() => {
    console.log(customerName);
  }, [customerName]);

  useEffect(() => {
    console.log(customerA);
  }, [customerA]);

  const clearData = () => {
    document.getElementById("province").value = "0";
    document.getElementById("districtcmb").value = "0";
    document.getElementById("subdistrictcmb").value = "0";
    setCustomerName(initCustomerName);
    setCustomerA(initCustomerA);
  };

  const verifyData = () => {
    let n = customerName;
    if (n.TypeID == 0 || n.Name == "") {
      return false;
    }
    let a = customerA;
    if (
      a.SubDistrict == "0" ||
      a.District == "0" ||
      a.Province == "0" ||
      a.Tel == ""
    ) {
      return false;
    }
    return true;
  };

  const submitData = async () => {
    if (!verifyData()) {
      setTxtInfo({
        header: "Add customer data",
        body: (
          <font className="text-red-500">
            --Please fill important data before submit--
          </font>
        ),
      });
      setModalInfo(true);
      return;
    }

    try {
      const res = await Axios.post(url + "/addNewCus", customerName).then(
        (r) => {
          submitAddr(r.data);
        }
      );
    } catch (err) {
      alert("Error! - cannot add new customer, please contact administrator");
    }
  };

  const [added, setAdded] = useState(false);
  const [cusID, setCusID] = useState("");

  const submitAddr = async (id) => {
    try {
      setTxtInfo({
        header: "Add customer data",
        body: (
          <div>
            Add new customer{" "}
            <font className="text-red-500">{customerName.Name}</font> successful
          </div>
        ),
      });
      const res = await Axios.post(url + "/addAddr/" + id, customerA);
      clearData();
      setModalInfo(true);
      setAdded(true);
      setCusID(id);
    } catch (err) {
      alert(
        "Error! - cannot add customer new address, please contact administrator"
      );
    }
  };

  const [modalInfo, setModalInfo] = useState(false);
  const initTxtInfo = { header: "", body: "" };
  const [txtInfo, setTxtInfo] = useState(initTxtInfo);

  useEffect(() => {
    if (added && !modalInfo) {
      nav("/solution/preexhibition/addnewsign/" + cusID);
    }
  }, [modalInfo]);

  return (
    <dataContext.Provider
      value={{
        customerNameC: [customerName, setCustomerName],
        customerAC: [customerA, setCustomerA],
      }}
    >
      <section id="customer-data" className="xl:container">
        <div className="my-3">
          <h1 className="text-2xl">Customer Data</h1>
        </div>
        <CustomerName />
        <CustomerAddr />
        <div className="flex items-center gap-2 mt-2 w-full md:w-3/4 justify-end">
          <input
            type="checkbox"
            id="newcustomer"
            className="accent-red-500"
            onChange={() =>
              setCustomerName({ ...customerName, newcus: !customerName.newcus })
            }
            checked={customerName.newcus}
          />
          <label htmlFor="newcustomer">Not a new customer</label>
        </div>
        <div className="flex justify-between mt-4 w-full md:w-3/4">
          <button className="btn-primary" onClick={clearData}>
            Clear Data
          </button>
          <button className="btn-green" onClick={submitData}>
            Submit Data
          </button>
        </div>
        <ModalInfo
          show={modalInfo}
          onHide={() => setModalInfo(false)}
          txtInfo={txtInfo}
        />
      </section>
    </dataContext.Provider>
  );
}

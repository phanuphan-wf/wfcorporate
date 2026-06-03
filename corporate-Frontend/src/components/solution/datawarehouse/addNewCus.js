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

  // useEffect(() => {
  //   console.log(customerName);
  // }, [customerName]);

  // useEffect(() => {
  //   console.log(customerA);
  // }, [customerA]);

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
      // const res = await Axios.post(url + "/addNewCus", customerName).then(
      //   (r) => {
      //     submitAddr(r.data);
      //   }
      // );

      console.log("--- MOCK SUBMIT DATA ---");
      console.log("Customer Name Payload:", customerName);
      
      const mockReturnedId = "CUS-" + Math.floor(Math.random() * 10000); // จำลอง ID ที่ได้จาก DB
      submitAddr(mockReturnedId); // ส่ง ID สมมติต่อไปให้ฟังก์ชันถัดไป

    } catch (err) {
      alert("Error! - cannot add new customer, please contact administrator");
    }
  };

  const [added, setAdded] = useState(false);
  const [cusID, setCusID] = useState("");

  const [nextstep, setNextstep] = useState(false);
  const [modalNextOpen, setModalNextOpen] = useState(false);

  const submitAddr = async (id) => {
    try {
     
      // const res = await Axios.post(url + "/addAddr/" + id, customerA);

      console.log("Customer Address:", customerA);
      console.log("Customer ID for Address:", id);
      setTxtInfo({
        header: "Add customer data",
        body: (
          <div>
            Add new customer{" "}
            <font className="text-red-500">{customerName.Name}</font> successful
          </div>
        ),
      });

      clearData();
      setModalInfo(true);
      setAdded(true);
      setNextstep(true);
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

  // useEffect(() => {
  //   if (added && !modalInfo) {
  //     nav("/solution/preexhibition/addnewsign/" + cusID);
  //   }
  // }, [modalInfo]);

  function ModalNextStep({ isOpen, onChoice }) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl animate-fade-in">
          {/* Header */}
          <h2 className="text-lg border-b pb-2">Next Step</h2>
          
          {/* Body */}
          <div className="my-6 text-center text-lg text-black">
            Would you like to 
            <span className="text-lg text-red-500 "> add </span>
            new Zone.
          </div>
          
          {/* Footer Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded shadow transition-colors"
              onClick={() => onChoice(true)}
            >
              Yes
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded shadow transition-colors"
              onClick={() => onChoice(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }

   
  useEffect(() => {  
    if (nextstep && !modalInfo) {
      setNextstep(false);      
      setModalNextOpen(true);  
    }
  }, [modalInfo, nextstep]);

  const NextChoice = (choice) => {
    setModalNextOpen(false);
    if (choice && cusID) {
      nav("/solution/preexhibition/addnewsign/" + cusID);
    }
  };

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
        <ModalNextStep isOpen={modalNextOpen} onChoice={NextChoice} />
      </section>
    </dataContext.Provider>
  );
}

import React, { useContext, useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "./creditlist";
import ModalSeach from "./modalSearch";
import AddCreditCustomer from "./New_Customer";


export default function ItemList() {
  
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdt;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  // ✅ ดึงค่าจาก Context
  const { customerC,hasCreditC,reloadTableC } = useContext(dataContext);

  const [customer, setCustomer] = customerC; 
  const [hasCredit, setHasCredit] = hasCreditC;  
  const [ReloadTable, setReloadTable] = reloadTableC;

  const [modalShow, setModalShow] = useState(false); 
  
   // modal add customer  **ประกาศตัวนี้ (หายไปก่อนหน้า)**
  const [showAddModal, setShowAddModal] = useState(false);

  const closeModal = () => setModalShow(false);

  const pressEnter = (e) => {
    if (e.key === "Enter") {
      setModalShow(true);
    }
  };

  const fillCustomer = (id, fullName, searchName) => {
    setCustomer({
      customerID: id,
      Name: fullName,
      searchName: searchName,
    });

    setModalShow(false);
   
  };

 
  useEffect(() => {
    
  },);

  return (
    <section id="customer-header">
      <div className="flex max-md:flex-col justify-between w-full 2xl:w-4/5">
        <div className="md:max-w-[40%] flex gap-3 flex-col">

          <div className="flex max-md:flex-wrap gap-3 items-center">
            <label htmlFor="name">Customer Name:</label>

            <input
              type="text"
              id="name"
              className="w-72"
              onChange={(e) =>
                setCustomer({ ...customer, Name: e.target.value })
              }
              onKeyDown={pressEnter}
              value={customer.Name}
            />

            <button
              className="btn-primary px-3"
              onClick={() => setModalShow(true)}
            >
              search
            </button>
          </div>      

        </div>

          
        {/* แสดงค่าที่เลือก */}
        <div className="flex items-center gap-3 mb-3">

          {customer.Name && (
            <div className="px-3 py-1 bg-blue-100 border border-blue-400 rounded text-blue-700">
              {customer.Name}
            </div>
          )}

          <button
            className={`btn-green px-3 ${
              !customer.Name || hasCredit
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => {
              if (!customer.Name || hasCredit) return;
              setShowAddModal(true);
            }}
            disabled={!customer.Name || hasCredit}
          >
            Add Credit Customer
          </button>


        </div>
   
       

      </div>

      <AddCreditCustomer
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        customer={customer}  
        onSave={(data) => {
          console.log("save customer", data);
          setReloadTable((x) => !x);  
          setShowAddModal(false);
        }}
      />


      <ModalSeach
        show={modalShow}
        onHide={closeModal}
        search={customer.Name}
        fill={fillCustomer}
      />
    </section>
  );
}

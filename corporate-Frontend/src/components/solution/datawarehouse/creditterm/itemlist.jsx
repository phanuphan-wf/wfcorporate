import React, { useContext, useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "./creditlist";
import ModalSeach from "./modalSearch";
import AddCreditCustomer from "./New_Customer";
//import ModalCredit from "./modalCredit";
 

export default function ItemList() {
  
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdt;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  // ✅ ดึงค่าจาก Context
  const { customerC,hasCreditC,reloadTableC,reloadAllC } = useContext(dataContext);

  const [customer, setCustomer] = customerC; 
  const [hasCredit, setHasCredit] = hasCreditC;  
  const [ReloadTable, setReloadTable] = reloadTableC;
  const [ReloadAll, setReloadAll] =  reloadAllC;

 
  const [modalShow, setModalShow] = useState(false); 
  
  
   // modal add customer  **ประกาศตัวนี้ (หายไปก่อนหน้า)**
  const [showAddModal, setShowAddModal] = useState(false);

  const closeModal = () => setModalShow(false);

  const pressEnter = (e) => {
    if (e.key !== "Enter") return;
    const keyword = customer.Name;
    
    if (!keyword) {
      // ช่องค้นหาว่าง
      console.log(ReloadAll);
      setReloadAll((prev) => !prev);      
    } else {
      // ช่องค้นหามีข้อความ
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
      <div className="w-full 2xl:w-4/5">

        {/* แถวค้นหา + ปุ่ม */}
        <div className="flex flex-wrap items-center gap-2">

          {/* กลุ่มค้นหา */}
          <div className="flex flex-1 min-w-[240px] items-center gap-2">
            <label htmlFor="name" className="whitespace-nowrap">
              Customer Name:
            </label>

            <input
              type="text"
              id="name"
              className="w-full max-w-[300px]"
              value={customer.Name}
              onChange={(e) => {
                const val = e.target.value;

                if (val.trim() === "") {
                  setCustomer({
                    customerID: "",
                    Name: "",
                    searchName: "",
                  });
                } else {
                  setCustomer({
                    ...customer,
                    Name: val,
                    customerID: "",
                    searchName: "",
                  });
                }
              }}
              onKeyDown={pressEnter}
            />

            <button
              className="btn-primary px-3"
              onClick={() => setModalShow(true)}
            >
              Search
            </button>
          </div>

          {/* ปุ่ม Add Credit ชิดขวา */}
          <div className="ml-auto">
            <button
              className={`btn-green px-3 ${
                !customer.customerID || hasCredit
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => {
                if (!customer.customerID || hasCredit) return;
                setShowAddModal(true);
              }}
              disabled={!customer.customerID || hasCredit}
            >
              Add Credit Customer
            </button>
          </div>
        </div>
      </div>

      {/* Modal Add */}
      <AddCreditCustomer
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        customer={customer}
        onSave={() => {
          setReloadTable((x) => !x);
          setShowAddModal(false);
        }}
      />

      {/* Modal Search */}
      <ModalSeach
        show={modalShow}
        onHide={closeModal}
        search={customer.Name}
        fill={fillCustomer}
      />

    </section>

  );
}

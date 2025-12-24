import React, { useContext, useState, useEffect } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import Swal from "sweetalert2";
import { FaRegEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import { dataContext } from "./creditlist";

export default function CreditListData() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdt;
  var CryptoJS = require("crypto-js");

  const emID = CryptoJS.AES.decrypt(
    JSON.parse(localStorage.getItem("user")).EmID,
    process.env.REACT_APP_KEY
  ).toString(CryptoJS.enc.Utf8);

  const user = JSON.parse(localStorage.getItem("user"));
  //console.log("USER RAW:", user);
  //const user = 2;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  // -------------------------------
  // Context
  // -------------------------------
  const { customerC, reloadAllC } = useContext(dataContext);
  const [customer] = customerC;
  const [reloadAll] = reloadAllC;

  // useEffect(() => {
  //     console.log(reloadAll);
  // }, [reloadAll]);
    
  
  const [searchKey, setSearchKey] = useState("");
  const [hisfilter, setHisfilter] = useState([]);

  const { hasCreditC } = useContext(dataContext);
  const [hasCredit, setHasCredit] = hasCreditC;

  // useEffect(() => {
  //   console.log(hasCredit);
  // }, [hasCredit]);
  

  const { reloadTableC } = useContext(dataContext);
  const [reloadTable, setReloadTable] = reloadTableC;

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [listCredit, setListCredit] = useState([]); 
  //const [reloadAll, setReloadAll] = useState(false);

  
  const loadCreditAll = async (text = "") => {
    try {
      //setLoadingAll(true);

      const res = await Axios.get(
        `${url}/creditList`,
        { params: { text } }
      );

      //console.log("📦 API DATA:", res.data);
      //setListCredit(res.data || []);
      setHisfilter(res.data ||[]);

    } catch (error) {
      console.error("Load credit error:", error);
      //setListCredit([]);
    }
  };
  

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Confirm credit deletion?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",

      buttonsStyling: false,
      customClass: {
        actions: "swal-actions-gap",
        confirmButton: "swal2-red-btn",
        cancelButton: "swal2-gray-btn",
      },
    });

    if (!result.isConfirmed) return;

    if (result.isConfirmed) {
      setShowModal(false);
    }

    try {
      const res = await Axios.delete(`${url}/delCredit/${id}`, {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
      });   
    
      loadCreditAll();
    } catch (error) {
      console.error("DELETE ERROR:", error);
      alert("ลบข้อมูลไม่สำเร็จ");
    }
  };

  useEffect(() => {    
    //console.log("🔥 reloadAll changed:", reloadAll);
    if (reloadAll == true) {
      loadCreditAll(""); // โหลดทั้งหมด
    }else{
      setHisfilter([]);
    }       
  }, [reloadAll]);

  

  // -------------------------------
  // เมื่อเลือกชื่อจาก modalSearch
  // -------------------------------
  useEffect(() => {
    if (customer?.searchName) {
      setSearchKey(customer.searchName);
      setHisfilter([]); // ✅ ล้างข้อมูลเก่าทันที
      setHasCredit(false); // ✅ reset สถานะ
    } else {
      setSearchKey("");
      setHisfilter([]);
      setHasCredit(false);
    }
  }, [customer, setHasCredit]);

  // -------------------------------
  // โหลดข้อมูลเครดิต
  // -------------------------------
    const loadCreditHistory = async (name) => {
    setHisfilter([]);      // ล้างข้อมูลเก่าทันที
    setHasCredit(false);   // reset สถานะ

    if (!name) return;

    try {
      const res = await Axios.get(
        `${url}/creditList`,
        {
          params: { text: name } // 👉 ?text=เกรท
        }
      );

      //console.log("📦 API RESPONSE:", res.data);

      if (Array.isArray(res.data) && res.data.length > 0) {
        // กรองเฉพาะชื่อที่ตรงกับ customer.Name
        const exactMatch = res.data.filter(
          (row) => row.name === customer.Name
        );

        if (exactMatch.length > 0) {
          setHisfilter(exactMatch);
          setHasCredit(true);   // ✅ พบข้อมูลตรง
        } else {
          setHisfilter([]);
          setHasCredit(false);  // ❌ ไม่มีชื่อที่ตรง
        }
      } else {
        setHisfilter([]);
        setHasCredit(false);
      }
    } catch (error) {
      console.error("Error loading history:", error);
      setHisfilter([]);
      setHasCredit(false);
    }
  };


  // โหลด API เมื่อ searchKey เปลี่ยน
  useEffect(() => {
    if (!searchKey) return;
    loadCreditHistory(searchKey);
  }, [searchKey, reloadTable]);   
 
  

  return (
    <section id="credit-list-data">
      <div className="flex justify-end w-full 2xl:w-4/5 my-4">
        <table className="w-full">
          <thead>
            <tr>             
              <th className="bg-zinc-100 border-l-2 border-white">Customer</th>
              <th className="bg-zinc-100 border-l-2 border-white">Credit 1</th>
              <th className="bg-zinc-100 border-l-2 border-white">Credit 2</th>
              <th className="bg-zinc-100 border-l-2 border-white">
                Date Approval
              </th>
              <th className="bg-zinc-100 border-l-2 border-white">Approver</th>
              <th className="w-[20%] bg-zinc-100 border-l-2 border-white rounded-tr-md">
                Manage Credit
              </th>
            </tr>
          </thead>

          <tbody>
            {hisfilter.length > 0 ? (
              hisfilter.map((row, index) => (
                <tr key={row.id} className="border-b">    
                  <td className="border-t border-l p-2">{row.name}</td>
                  <td className="border-t border-l p-2 text-center">
                    {row.term1}
                  </td>
                  <td className="border-t border-l p-2 text-center">
                    {row.term2}
                  </td>
                  <td className="border-t border-l p-2 text-center">
                    {new Date(row.a_date).toLocaleString()}
                  </td>
                  <td className="border-t border-l p-2 text-center">
                    {row.approver}
                  </td>

                  <td className="border-t border-l p-2 flex justify-center">
                    <button
                      className="btn-green flex gap-1.5 px-2 py-1 items-center"
                      onClick={() => {
                        setEditData({
                          id: row.id,
                          name: row.name,
                          cr1: row.term1,
                          cr2: row.term2,
                        });
                        setShowModal(true);
                      }}>
                      <div className="text-[17px]">
                        <FaRegEdit />
                      </div>
                      <span>Edit</span>
                    </button>

                    <button
                      className="btn-primary ml-2"
                      onClick={() => handleDelete(row.id)}
                    >
                      <i className="fas fa-trash mr-1"></i> Cancel Credit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-5 text-gray-400 border-t">
                  ไม่มีข้อมูลเครดิตสำหรับลูกค้ารายนี้
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --------------------------------------
          Modal แก้ไขข้อมูล
      --------------------------------------- */}
      {showModal && editData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[400px] p-4 shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Edit Credit</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-500 hover:text-red-500"
                aria-label="Close">
                 <IoMdClose />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-3 text-sm">
              <div>
                <label>Customer</label>
                {/* <input
                  className="border w-full px-2 py-1 rounded bg-gray-100"
                  value={editData.id}
                  readOnly
                /> */}
                <input
                  className="border w-full px-2 py-1 rounded bg-gray-100"
                  value={editData.name}
                  readOnly
                />
              </div>

              <div>
                <label>Credit 1</label>
                <input
                  type="number"
                  className="border w-full px-2 py-1 rounded"
                  value={editData.cr1}
                  onChange={(e) =>
                    setEditData({ ...editData, cr1: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Credit 2</label>
                <input
                  type="number"
                  className="border w-full px-2 py-1 rounded"
                  value={editData.cr2}
                  onChange={(e) =>
                    setEditData({ ...editData, cr2: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setShowModal(false)}>
                Cancel
              </button>             

              <button
                className={`btn-green ${
                  user?.ALevel !== 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={user?.ALevel !== 1}
                onClick={async () => {
                  if (!editData?.id) {
                    alert("ไม่พบ customerID");
                    return;
                  }

                  const payload = {
                    customerID: editData.id,
                    cr1: Number(editData.cr1),
                    cr2: Number(editData.cr2),
                    do_by: emID,
                  };

                  console.log("SAVE DATA:", payload);

                  try {
                    const res = await Axios.put(
                      `${url}/updateCredit`,
                      payload,
                      {
                        headers: {
                          Authorization: `Bearer ${bearer}`,
                        },
                      }
                    );

                    //console.log("API RESPONSE:", res.data);
                    loadCreditAll("");
                    setReloadTable((x) => !x);
                    setShowModal(false);
                  } catch (error) {
                    //console.error("UPDATE CREDIT ERROR:", error);
                    alert("บันทึกข้อมูลไม่สำเร็จ");
                  }
                }}>
                Approved Credit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useContext, useState, useEffect } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { dataContext } from "./creditlist";

export default function CreditListData() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdt;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  // -------------------------------
  // Context
  // -------------------------------
  const { customerC } = useContext(dataContext);
  const [customer, setCustomer] = customerC;

  const [searchKey, setSearchKey] = useState("");
  const [hisfilter, setHisfilter] = useState([]);
  const [reloadTable, setReloadTable] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // -------------------------------
  // เมื่อเลือกชื่อจาก modalSearch
  // -------------------------------
  useEffect(() => {
    if (customer?.searchName) {
      setSearchKey(customer.searchName);
    } else {
      setSearchKey("");
      setHisfilter([]); // ไม่ต้องแสดงข้อมูล
    }
  }, [customer]);

  // -------------------------------
  // โหลดข้อมูลรายการ Credit
  // -------------------------------
  const loadCreditHistory = async (name) => {
    try {
      const res = await Axios.get(`${url}/creditList/${name}`);
      setHisfilter(res.data?.length ? res.data : []);
    } catch (error) {
      console.error("Error loading history:", error);
      setHisfilter([]);
    }
  };

  // โหลด API เมื่อ searchKey เปลี่ยน
  useEffect(() => {
    if (!searchKey) return;
    loadCreditHistory(searchKey);
  }, [searchKey, reloadTable]);

  return (
    <section id="customer-history-list">
      <div className="w-full 2xl:w-4/5 mb-8">
        <table className="w-full">
          <thead>
            <tr>
              <th className="bg-zinc-100 rounded-tl-md">no#</th>
              <th className="bg-zinc-100 border-l-2 border-white">Customer</th>
              <th className="bg-zinc-100 border-l-2 border-white">งวดที่ 1</th>
              <th className="bg-zinc-100 border-l-2 border-white">งวดที่ 2</th>
              <th className="bg-zinc-100 border-l-2 border-white">Date Approval</th>
              <th className="bg-zinc-100 border-l-2 border-white">Approver</th>
              <th className="w-[20%] bg-zinc-100 border-l-2 border-white rounded-tr-md">
                จัดการ
              </th>
            </tr>
          </thead>

          <tbody>
            {hisfilter.length > 0 ? (
              hisfilter.map((row, index) => (
                <tr key={row.id} className="border-b">
                  <td className="border-t p-2 text-center">{index + 1}</td>
                  <td className="border-t border-l p-2">{row.name}</td>
                  <td className="border-t border-l p-2 text-center">{row.term1}</td>
                  <td className="border-t border-l p-2 text-center">{row.term2}</td>
                  <td className="border-t border-l p-2 text-center">
                    {new Date(row.a_date).toLocaleString()}
                  </td>
                  <td className="border-t border-l p-2 text-center">{row.approver}</td>

                  <td className="border-t border-l p-2 text-center">
                    <button
                      className="btn-primary"
                      onClick={() => {
                        setEditData(row);
                        setShowModal(true);
                      }}
                    >
                      <i className="fas fa-edit mr-1"></i> แก้ไข
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-5 text-gray-400 border-t"
                >
                  ไม่มีข้อมูลสำหรับลูกค้ารายนี้
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
              <h3 className="font-semibold text-lg">แก้ไขข้อมูล</h3>
              <button
                className="text-red-500 text-xl"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="space-y-3 text-sm">
              <div>
                <label>Customer</label>
                <input
                  className="border w-full px-2 py-1 rounded"
                  value={editData.name}
                  readOnly
                />
              </div>

              <div>
                <label>งวดที่ 1</label>
                <input
                  className="border w-full px-2 py-1 rounded"
                  value={editData.term1}
                  onChange={(e) =>
                    setEditData({ ...editData, term1: e.target.value })
                  }
                />
              </div>

              <div>
                <label>งวดที่ 2</label>
                <input
                  className="border w-full px-2 py-1 rounded"
                  value={editData.term2}
                  onChange={(e) =>
                    setEditData({ ...editData, term2: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-1 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                ยกเลิก
              </button>

              <button
                className="btn-primary"
                onClick={() => {
                  console.log("SAVE DATA:", editData);

                  // 👉 refresh table after editing
                  setReloadTable((x) => !x);

                  setShowModal(false);
                }}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


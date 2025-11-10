import React, { useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

export default function ModalSearch(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_rr;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [search, setSearch] = useState({ exid: "", name: "" });
  const [customer, setCustomer] = useState([]);

  // ดึง exid จาก props
  useEffect(() => {
    setSearch((prev) => ({ ...prev, exid: props.exid || "" }));
  }, [props.exid]);

  // ดึงชื่อจาก props เมื่อเปิด modal
  useEffect(() => {
    setSearch((prev) => ({ ...prev, name: props.search || "" }));
  }, [props.search]);

  // เรียกค้นหาเมื่อ modal เปิด
  useEffect(() => {
    if (props.show && search.name.trim() !== "") {
      searchClick();
    } else if (props.show) {
      setCustomer([]);
    }
  }, [props.show]);

  // ฟังก์ชันค้นหาลูกค้า
  const searchClick = async () => {
    if (!search.name.trim()) {
      alert("⚠️ กรุณากรอกชื่อลูกค้าก่อนค้นหา");
      return;
    }
    try {
      const res = await Axios.post(url + "/getCustomer", search);
      setCustomer(res.data);
    } catch (err) {
      console.error("❌ Error fetching customer:", err);
      setCustomer([]);
    }
  };

  // ฟังก์ชันเลือกชื่อ
  const nameClick = (c) => {
    props.fill({ id: c.cid, name: c.name });
    props.onHide(); // ปิด modal หลังเลือก
  };

  // กด Enter เพื่อค้นหา
  const pressEnter = (e) => {
    if (e.key === "Enter") searchClick();
  };

  return (
    <div>
      {/* Modal กล่องหลัก */}
      <div
        id="staticModal"
        data-modal-backdrop="static"
        tabIndex="-1"
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 
          h-[calc(100%-1rem)] max-h-full ${props.show ? "" : "hidden"}`}
      >
        <div className="relative w-full max-h-[60%] max-w-3xl md:max-w-xl lg:max-w-3xl top-[20%] left-1/2 -translate-x-1/2">
          <div className="relative bg-white rounded-lg shadow">
            {/* Header */}
            <div className="p-4 border-b rounded-t">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Customer Search</h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  onClick={props.onHide}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 
                      111.414 1.414L11.414 10l4.293 4.293a1 1 0 
                      01-1.414 1.414L10 11.414l-4.293 4.293a1 
                      1 0 01-1.414-1.414L8.586 10 
                      4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* ช่องค้นหา */}
              <div className="flex gap-2 mt-3 items-center">
                <label htmlFor="searchtxt" className="whitespace-nowrap">
                  Customer Name:
                </label>
                <input
                  id="searchtxt"
                  className="w-1/2 border rounded px-2 py-1"
                  value={search.name}
                  onChange={(e) => setSearch({ ...search, name: e.target.value })}
                  onKeyDown={pressEnter}
                />
                <button
                  className="btn-primary px-3 py-1 cursor-pointer select-none"
                  onClick={searchClick}
                >
                  Search
                </button>
              </div>
            </div>

            {/* รายการผลลัพธ์ */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-scroll">
              <ul>
                {customer.length > 0 ? (
                  customer.map((c) => (
                    <li
                      key={c.cid}
                      onClick={() => nameClick(c)}
                      className="cursor-pointer hover:text-blue-600 hover:underline w-fit"
                    >
                      {c.name}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">ไม่พบข้อมูลลูกค้า</p>
                )}
              </ul>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
              <button
                type="button"
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={props.onHide}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ฉากหลังมืด */}
      {props.show && (
        <div className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
      )}
    </div>
  );
}

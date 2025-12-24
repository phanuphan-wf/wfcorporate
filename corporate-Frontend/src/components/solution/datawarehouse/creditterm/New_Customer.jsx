import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";

export default function New_Customer({ show, onClose, onSave, customer }) {

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdt;
  var CryptoJS = require("crypto-js");

  const [form, setForm] = useState({
    customerID: "",
    cr1: "",
    cr2: "",
    do_by: "",
  });

  const resetForm = () => {
    setForm(prev => ({
      ...prev,
      cr1: "",
      cr2: "",
    }));
  };

  // ⭐ โหลด customer ID + emID เมื่อเปิด modal
  useEffect(() => {
    if (show && customer) {
      const emID = CryptoJS.AES.decrypt(
        JSON.parse(localStorage.getItem("user")).EmID,
        process.env.REACT_APP_KEY
      ).toString(CryptoJS.enc.Utf8);

      setForm(prev => ({
        ...prev,
        customerID: customer.customerID,
        do_by: emID,
      }));
    }
  }, [show, customer]);


  // ⭐ ฟังก์ชันบันทึกข้อมูล
  const handleSave = async () => {
    try {
      const payload = {
        customerID: Number(form.customerID),
        cr1: Number(form.cr1),
        cr2: Number(form.cr2),
        do_by: form.do_by,
      };

      const res = await Axios.post(`${url}/addCredit`, payload);

      // ⭐ แจ้งเตือนสำเร็จ
      await Swal.fire({
        icon: "success",
        title: "บันทึกข้อมูลสำเร็จ",
        confirmButtonText: "OK",
        customClass: { confirmButton: "swal2-red-btn" },
      });

      // if (onSave) onSave(payload);
      if (onSave) onSave();

      resetForm();
      onClose();

    } catch (error) {
      console.error("Add Credit Error:", error);

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "บันทึกข้อมูลไม่สำเร็จ",
        confirmButtonText: "OK",
        customClass: { confirmButton: "swal2-red-btn" },
      });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[420px] p-5 shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Credit Customer</h3>
          <button
            className="text-red-500 text-xl"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3 text-sm">

          <div>
            <label>Customer</label>
            <input
              className="border w-full px-2 py-1 rounded bg-gray-100"
              value={customer.Name}
              readOnly
            />
          </div>

          <div>
            <label>งวดที่ 1</label>
              <input
                className="border w-full px-2 py-1 rounded"
                value={form.cr1}
                onChange={(e) => setForm({ ...form, cr1: e.target.value })}
              />
          </div>

          <div>
            <label>งวดที่ 2</label>
            <input
              className="border w-full px-2 py-1 rounded"
              value={form.cr2}
              onChange={(e) => setForm({ ...form, cr2: e.target.value })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={handleSave}
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

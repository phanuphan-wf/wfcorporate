import React, { useState, useEffect } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";

export default function CustomerDetail({ customerName, onUpdateSuccess }) {
    const bearer = useHeader();
    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdp;

    Axios.defaults.headers.common = {
        Authorization: "Bearer " + bearer,
    };

    const [isEdit, setIsEdit] = useState(false);
    const [ctName, setCtName] = useState("");
    const [customerType, setCustomerType] = useState("");

    // ฟังก์ชันแยกประเภท และชื่อลูกค้า
    const subName = (nameStr = "") => {
        if (!nameStr) {
            setCustomerType("");
            setCtName("");
            return;
        }

        const prefixes = ["บริษัท", "ห้าง", "ร้าน"];
        const trimmedName = nameStr.trim();

        const matchedPrefix = prefixes.find((prefix) => trimmedName.startsWith(prefix));

        if (matchedPrefix) {
            const remainingName = trimmedName.slice(matchedPrefix.length).trim();
            setCustomerType(matchedPrefix);
            setCtName(remainingName);
        } else {
            setCustomerType("");
            setCtName(trimmedName);
        }
    };

    // ปุ่มกด Edit
    const handleEdit = () => {
        subName(customerName?.name);
        setIsEdit(true);
    };

    // ปุ่มกด Cancel
    const handleCancel = () => {
        setIsEdit(false);
        subName(customerName?.name); // คืนค่าเดิม
    };

    // ปุ่มกด Save ส่งข้อมูลไปยัง API
    const handleSave = async () => {
        if (!ctName.trim()) {
            alert("กรุณากรอกชื่อลูกค้า");
            return;
        }

        try {
            const payload = {
                name: ctName.trim(),
                type: customerType,
            };

            await Axios.put(`${url}/editCustomer/${customerName?.id}`, payload);

            alert("บันทึกข้อมูลสำเร็จ!");
            setIsEdit(false);

            // แจ้งให้ Component แม่รับรู้เพื่อดึง/อัปเดตข้อมูลใหม่ (ถ้ามี)
            if (onUpdateSuccess) {
                onUpdateSuccess();
            }
        } catch (error) {
            console.error("Error updating customer name:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    // เรียก subName แยกประเภท/ชื่อทันทีเมื่อ customerName เปลี่ยนแปลง
    useEffect(() => {
        if (customerName?.name) {
            subName(customerName.name);
        }
    }, [customerName]);

    // Debug เช็กค่า
    useEffect(() => {
        console.log("Customer Type:", customerType);
        console.log("Customer Name Only:", ctName);
    }, [customerType, ctName]);

    return (
        <div className="flex flex-wrap items-center mt-4 gap-2">
            <label htmlFor="customerName" className="mr-2 flex-shrink-0 font-medium">
                Customer Name :
            </label>

            {isEdit ? (
                <div className="flex items-center gap-2">
                    {/* เลือกประเภทลูกค้า */}
                    <select
                        value={customerType}
                        onChange={(e) => setCustomerType(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- ไม่ระบุ --</option>
                        <option value="ร้าน">ร้าน</option>
                        <option value="บริษัท">บริษัท</option>
                        <option value="ห้าง">ห้าง</option>
                    </select>

                    {/* ช่องแก้ไขชื่อเฉพาะ (ไม่มีคำว่า บริษัท/ห้าง/ร้าน ติดอยู่) */}
                    <input
                        type="text"
                        id="customerName"
                        value={ctName}
                        onChange={(e) => setCtName(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                </div>
            ) : (
                <span className="font-semibold text-gray-800">
                    {customerName?.name || "-"}
                </span>
            )}

            {isEdit ? (
                <>
                    <button
                        type="button"
                        className="ml-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm transition"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <button
                    type="button"
                    className="ml-2 bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 text-sm transition"
                    onClick={handleEdit}
                >
                    Edit
                </button>
            )}
        </div>
    );
}
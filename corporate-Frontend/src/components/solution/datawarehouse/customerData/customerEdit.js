import React, { useState, useEffect } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";

import ModaleEditName from "./modalEditName";

export default function CustomerDetail({ customerName, onUpdate }) {

    const [modalEditName, setModalEditName] = useState(false);

  
    const handleEdit = () => {
        setModalEditName(true);
    };

    const closeModal = () => {
        setModalEditName(false);
    };  

    return (
        <div className="flex flex-wrap items-center mt-4 gap-2">
            <label htmlFor="customerName" className="mr-2 flex-shrink-0 font-medium">
                Customer Name :
            </label>

            <span className="font-semibold text-gray-800">
                {customerName?.name || "-"}
            </span>

            <button
                type="button"
                className="ml-2 bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 text-sm transition"
                onClick={handleEdit} // <-- เปิดใช้งานตรงนี้แล้ว
            >
                Edit Name
            </button>  

            {/* ส่งข้อมูลไปที่ Modal (data จะมี id และ name ตามที่ส่งมา) */}
            <ModaleEditName
                show={modalEditName}
                onHide={closeModal}
                data={customerName} 
                onUpdate={onUpdate}
            />
        </div>
    ); 
}
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";


export default function CustomerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const bearer = useHeader();
    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdp;
    Axios.defaults.headers.common = {
        Authorization: "Bearer " + bearer,
    };


    const [customerData, setCustomerData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [mainProduct, setmainProduct] = useState(null);
    const [products, setProducts] = useState([]);

    const customerDetail = async (id) => {
        try {
            const res = await Axios.get(url + "/getCustomerDetail/" + id);
            setCustomerData(res.data);
            setLoading(false);
            
            const allProducts = res.data?.product || [];           
            const main = allProducts.find((p) => p.pro_def === true) || null;           
            const subList = allProducts.filter((p) => p.pro_def !== true);

            setmainProduct(main);
            setProducts(subList);

        } catch (error) {
            console.error("Error fetching customer detail:", error);
            setLoading(false);
            throw error;
        }
    };

    useEffect(() => {
        customerDetail(id);
    }, [id]);

    useEffect(() => {
        console.log(customerData);
    }, [customerData]);

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }
    if (!customerData) {
        return <div className="p-6 text-center">Not found data</div>;
    }

    const customerName = customerData.customer;
    const sign = customerData.sign;
    const mainAddr = customerData.mainAddr;
    const taxAddr = customerData.taxAddr;

    



    const editCustomer = (id) => {
        console.log("Edit customer with ID:", id);
    };

    const editSign = (id) => {
        console.log("Edit sign with ID:", id);
    };

    return (
        <section id="customer-detail">
            <div>
                <h1 className="text-2xl">Customer Detail</h1>
            </div>

            <div className="flex flex-wrap items-center mt-4">
                <label htmlFor="cNo" className="mr-2 flex-shrink-0">Customer Name :</label>
                <label htmlFor="cNo" className="mr-2 flex-shrink-0">
                    {customerName.name || "-"}
                </label>
                <button
                    className="btn-primary px-3"
                    onClick={() => editCustomer(customerName.id)}
                >
                    Edit Name
                </button>
            </div>

            <div className="flex flex-wrap items-center mt-4">
                <label htmlFor="sNo" className="mr-2 flex-shrink-0">Sign Name :</label>
                <label htmlFor="sNo" className="mr-2 flex-shrink-0">
                    {sign.signperson || "-"}
                </label>
                <button
                    className="btn-green  px-3"
                    onClick={() => editSign(sign.id)}
                >
                    Edit Signname
                </button>
            </div>

            <div className="border border-gray-300 rounded-md p-4 relative bg-white mt-5">
                <span className="absolute -top-3 left-4 bg-white px-2 text-base font-semibold text-red-500">
                    Main Address 
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-sm mt-2">
                    <div className="md:col-span-2 flex gap-2">
                        <span className="font-semibold w-24">ที่อยู่ :</span>
                        <span>{mainAddr?.street || "-"}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-semibold w-24">แขวง/ตำบล :</span>
                        <span>{mainAddr?.subDistrict || "-"}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold w-24">เขต/อำเภอ :</span>
                        <span>{mainAddr?.district || "-"}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-semibold w-24">จังหวัด :</span>
                        <span>{mainAddr?.province || "-"}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold w-24">รหัสไปรษณีย์ :</span>
                        <span>{mainAddr?.postal || "-"}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-semibold w-24">โทรศัพท์ :</span>
                        <span>{mainAddr?.tel || "-"}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold w-24">โทรสาร :</span>
                        <span>{mainAddr?.fax || "-"}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-semibold w-24">เว็บไซต์ :</span>
                        <span>{mainAddr?.web || "-"}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold w-24">อีเมล :</span>
                        <span>{mainAddr?.email || "-"}</span>
                    </div>
                </div>
            </div>

            <div className="border border-gray-300 rounded-md p-4 relative bg-white mt-5">
                <span className="absolute -top-3 left-4 bg-white px-2 text-base font-semibold text-red-500">
                    Tax Address
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-sm mt-2">
                    <div className="flex gap-2">
                        <span className="font-semibold w-26">เลขทะเบียนภาษี :</span>
                        <span>{taxAddr?.taxID || "-"}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold w-26">ชื่อตาม ภ.พ.20 :</span>
                        <span>{taxAddr?.taxName || "-"}</span>
                    </div>

                    <div className="md:col-span-2 flex gap-2">
                        <span className="font-semibold w-24">ที่อยู่ :</span>
                        <span>{taxAddr?.street || "-"}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-semibold w-24">แขวง/ตำบล :</span>
                        <span>{taxAddr?.subDistrict || "-"}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold w-24">เขต/อำเภอ :</span>
                        <span>{taxAddr?.district || "-"}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-semibold w-24">จังหวัด :</span>
                        <span>{taxAddr?.province || "-"}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold w-24">รหัสไปรษณีย์ :</span>
                        <span>{taxAddr?.postal || "-"}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-semibold w-24">โทรศัพท์ :</span>
                        <span>{taxAddr?.tel || "-"}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold w-24">โทรสาร :</span>
                        <span>{taxAddr?.fax || "-"}</span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-semibold w-24">เว็บไซต์ :</span>
                        <span>{taxAddr?.web || "-"}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold w-24">อีเมล :</span>
                        <span>{taxAddr?.email || "-"}</span>
                    </div>
                </div>
            </div>

          
                   
                {mainProduct && (
                    <div className="border-2 border-emerald-500 bg-emerald-50/60 rounded-md p-5 relative shadow-md mt-5">              
                       

                         <span className="absolute -top-3 left-4 bg-white px-2 text-base font-semibold text-emerald-500">
                             Main Product
                        </span>

                        <div className="mt-1">
                            <h4 className="text-xl font-bold text-emerald-950">
                            {mainProduct.name}
                            </h4>
                            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                            {mainProduct.detail || "-"}
                            </p>
                        </div>
                    </div>
                )}

                {/* ===== 2. สินค้าทั่วไป (Sub Products - มีได้หลายรายการ) ===== */}
                <div className="border border-gray-300 rounded-md p-4 relative bg-white mt-5">
                    <h5 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                    สินค้าทั่วไป / สินค้าอื่นๆ ({products.length} รายการ)
                    </h5>

                    {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {products.map((item) => (
                        <div
                            key={item.productID}
                            className="border border-gray-200 bg-white rounded-lg p-4 hover:border-gray-300 transition-shadow shadow-sm"
                        >
                            <div className="flex justify-between items-start">
                            <h6 className="font-bold text-gray-800 text-base">
                                {item.name}
                            </h6>
                            {item.brand && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {item.brand}
                                </span>
                            )}
                            </div>
                            <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                            {item.detail || "ไม่มีรายละเอียด"}
                            </p>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-lg text-center border border-dashed">
                        ไม่มีสินค้าทั่วไปเพิ่มเติม
                    </div>
                    )}
                </div>
           


  


        </section>
    );
}
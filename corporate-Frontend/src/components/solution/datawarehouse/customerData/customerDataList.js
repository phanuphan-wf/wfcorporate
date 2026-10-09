import React, {useContext, useState, useEffect} from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "./customerData";

import {useNavigate} from "react-router-dom";

export default function CustomerDataList() {
    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdp;
    const bearer = useHeader();
    const navigate = useNavigate();

    Axios.defaults.headers.common = {
        Authorization: "Bearer " + bearer,
    };

    const { customerC } = useContext(dataContext);
    const [customer, setCustomer] = customerC;

    const [hisfilter, setHisfilter] = useState([]);


    const formatAddress = (data) => {
        if (!data) return "-";

        const street = data.street;
        const subdistrict = data.subdistrict;
        const district = data.district;
        const province = data.province;

        if (!street && !subdistrict && !district && !province) {
            return "-";
        }
       
        let ts = "ตำบล";
        let td = "อำเภอ";

        if (
            province === "กรุงเทพมหานคร" ||
            province === "กรุงเทพฯ" ||
            province === "กรุงเทพฯ " ||
            province === "กรุงเทพ" ||
            province === "กทม" ||
            province === "กทม."
        ) {
            ts = "แขวง";
            td = "เขต";
        }

        const str = street ? `${street} ` : "";
        const sub = subdistrict ? `${ts}${subdistrict} ` : "";
        const dist = district ? `${td}${district} ` : "";
        const prov = province ? `${province}` : "";

        const result = `${str}${sub}${dist}${prov}`.trim();

        return result || "-";
    };    

    const formatPhone = (phoneString) => {
        if (!phoneString) return "-";
       
        const phones = phoneString.split(',').map((phone) => phone.trim());

        return (
            <div className="flex flex-col gap-1">
            {phones.map((phone, index) => (
                <span key={index}>{phone}</span>
            ))}
            </div>
        );
    };

    const CustomerSearch = async () => {
        if (!customer.Name || customer.Name.trim() === "") {
            setHisfilter([]);
            return;
        }

        try {
            const encodedName = encodeURIComponent(customer.Name.trim());
            const res = await Axios.get(url + "/getCustomer/" + encodedName);
            setHisfilter(res.data || []);
        } catch (error) {            
            console.error("Error fetching customer list:", error);
            setHisfilter([]);
        }  
    };

    const dataEX = (id) => {
        setCustomer({ ...customer, customerID: id});
        console.log("Customer ID:", id);          
       
        navigate(`/solution/datawarehouse/customerDetail/${id}`);
    };

    useEffect(() => {
        if (customer.Name) {
            CustomerSearch();
        }else {
            setHisfilter([]);
        }
    }, [customer.Name]);

    useEffect(() => {
        //console.log(hisfilter);
    }, [hisfilter]);
    

    return (
        <section> 
            <h6 className="mt-4">Customer Data List</h6>
                <div id="hislist" className="w-full mb-8">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="bg-zinc-100 rounded-tl-md">no#</th>
                                <th className="bg-zinc-100 border-l-2 border-gay">Exhibitor Name</th>
                                <th className="bg-zinc-100 border-l-2 border-gay">Address</th>                               
                                <th className="bg-zinc-100 border-l-2 border-gay">Tel</th>                                                   
                            </tr>
                        </thead>
                        <tbody>
                            {hisfilter.map((data, i) => (
                                <tr key={i} className="last:border-b-2 border-zinc-100">
                                    <td className="text-center border-t-2 border-zinc-100 p-2">{i + 1}</td>
                                    <td
                                        className="text-center border-t-2 border-l-2 border-zinc-100 p-2 cursor-pointer text-blue-600 hover:underline"
                                        onClick={() => dataEX(data.id)}
                                    >
                                    {data.name}
                                    </td>
                                    <td className="text-center border-t-2 border-l-2 border-zinc-100 p-2">{formatAddress(data)}</td>
                                    <td className="border-t-2 border-l-2 border-r-2 border-zinc-100 p-2 whitespace-nowrap text-center">{formatPhone(data.tel)}</td>
                                                                 
                                      
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </section>
    );
}
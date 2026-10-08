import React, {useContext, useState, useEffect} from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "./customerData";

export default function CustomerDataList() {
    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdp;
    const bearer = useHeader();

    Axios.defaults.headers.common = {
        Authorization: "Bearer " + bearer,
    };

    const { customerC } = useContext(dataContext);
    const [customer, setCustomer] = customerC;

    const [hisfilter, setHisfilter] = useState([]);

    const CustomerDetail = async () => {
        try {
            const res = await Axios.get(url + "/getCustomerDetail/" + customer.customerID).then((res) => {
                setHisfilter([res.data]);
            });
        } catch (error) {
            console.error("Error fetching customer details:", error);
        }  
    };
  

    const deleteData = (id) => {
           
       alert("ลบข้อมูลสำเร็จ!");
    }

    const dataEX = (id) => {
        console.log("Customer ID:", id);      
    };

    useEffect(() => {
        if (customer.customerID != "") {
            CustomerDetail();
        }else {
            setHisfilter([]);
        }
    }, [customer.customerID]);

    useEffect(() => {
        console.log(hisfilter);
    }, [hisfilter]);

    return (
        <section>
            <div className="flex justify-end w-full 2xl:w-4/5 my-4">

            </div>

            <h6>Customer Data List</h6>
                <div id="hislist" className="w-full mb-8">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="bg-zinc-100 rounded-tl-md">no#</th>
                                <th className="bg-zinc-100 border-l-2 border-gay">
                                    Exhibitor Name
                                </th>
                                <th className="bg-zinc-100 border-l-2 border-gay">Address</th>                               
                                <th className="bg-zinc-100 border-l-2 border-gay">Web</th>
                                <th className="bg-zinc-100 border-l-2 border-gay">Email</th>
                                <th className="bg-zinc-100 border-l-2 border-gay">Resource Data</th>                          
                            </tr>
                        </thead>
                        <tbody>
                            {hisfilter.map((data, i) => (
                                <tr key={i} className="last:border-b-2 border-zinc-100">
                                    <td className="text-center border-t-2 border-zinc-100 p-2">{i + 1}</td>
                                    <td 
                                        className="text-center border-t-2 border-l-2 border-zinc-100 p-2"
                                        onClick={() => dataEX(data.ID)}
                                    >
                                    {data.customer.name}
                                    </td>
                                    <td className="text-center border-t-2 border-l-2 border-zinc-100 p-2">
                                         {data.mainAddr.street} {data.mainAddr.subDistrict} {data.mainAddr.district} {data.mainAddr.province} {data.mainAddr.postal}
                                    </td>
                                    <td className="text-center border-t-2 border-l-2 border-zinc-100 text-right p-2">
                                    {data.tel}
                                    </td>
                                    <td className="text-center border-t-2 border-l-2 border-zinc-100 text-right p-2">
                                    {data.fax}
                                    </td>
                                    <td className="text-center border-t-2 border-l-2 border-zinc-100 p-2">
                                    {data.web}
                                    </td>
                                    <td className="text-center border-t-2 border-l-2 border-zinc-100 p-2">{data.email}</td>
                                    <td className="border-t-2 border-l-2 border-r-2 border-zinc-100 p-2 whitespace-nowrap text-center">{data.resource}</td>                                 
                                      
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </section>
    );
}
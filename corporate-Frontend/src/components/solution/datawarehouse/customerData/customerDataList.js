import React, {useContext, useState, useEffect} from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "./customerData";

export default function CustomerDataList() {
    const bearer = useHeader();

    Axios.defaults.headers.common = {
        Authorization: "Bearer " + bearer,
    };

    const { customerC } = useContext(dataContext);

    const showData = async () => {

    };

    //const [hisfilter, setHisfilter] = useState([]);

    const [hisfilter, setHisfilter] = useState([
        {
            exName: "Tech Solutions Co., Ltd.",
            exID: "123 Sukhumvit Rd, Bangkok",
            tel:"02-55698541",
            fax: "02-55698541",
            web: "www.techsolutions.com",
            email: "techsolutions@email.com",
            resource: "สมชาย",
        },
        {
            exName: "Global Logistics Group",
            exID: "456 Bangna-Trad, Samut Prakan",
            tel:"02-55698541",
            fax: "02-55698541",
            web: "www.globallogistics.co.th",
            email: "globallogistics@email.com",
            resource: "สมนวล",          
        },
        {
            exName: "Innovation Hub Asia",
            exID: "789 Phahonyothin Rd, Bangkok",
            tel:"02-55698541",
            fax: "02-55698541",
            web: "www.innovationhub.asia",
            email: "innovationhub@email.com",
            resource: "สมพร",
           
        },
    ]);

    const deleteData = (id) => {
           
       alert("ลบข้อมูลสำเร็จ!");
    }

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
                                <th className="bg-zinc-100 border-l-2 border-gay">Tel</th>
                                <th className="bg-zinc-100 border-l-2 border-gay">Fax</th>
                                <th className="bg-zinc-100 border-l-2 border-gay">Web</th>
                                <th className="bg-zinc-100 border-l-2 border-gay">Email</th>
                                <th className="bg-zinc-100 border-l-2 border-gay">Resource Data</th>
                                <th className="bg-zinc-100 border-l-2 border-gay">Set Up</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hisfilter.map((d, i) => (
                                <tr key={i} className="last:border-b-2 border-zinc-100">
                                    <td className="text-center border-t-2 border-zinc-100 p-2">{i + 1}</td>
                                    <td className="text-center border-t-2 border-l-2 border-zinc-100 p-2">
                                    {d.exName}
                                    </td>
                                    <td className="text-center border-t-2 border-l-2 border-zinc-100 p-2">
                                    {d.exID}
                                    </td>
                                    <td className="text-center border-t-2 border-l-2 border-zinc-100 text-right p-2">
                                    {d.tel}
                                    </td>
                                    <td className="text-center border-t-2 border-l-2 border-zinc-100 text-right p-2">
                                    {d.fax}
                                    </td>
                                    <td className="text-center border-t-2 border-l-2 border-zinc-100 p-2">
                                    {d.web}
                                    </td>
                                    <td className="border-t-2 border-l-2 border-zinc-100 p-2">{d.email}</td>
                                    <td className="border-t-2 border-l-2 border-zinc-100 p-2">{d.resource}</td>
                                    <td className="border-t-2 border-l-2 border-r-2 border-zinc-100 p-2 whitespace-nowrap text-center">
                                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-3 py-1 rounded shadow text-sm transition">
                                            Product
                                        </button>
                                    
                                        <button className="btn-green px-3 ml-1">edit</button>
                                        <button className="btn-primary px-3 ml-1" onClick={deleteData}>delete</button>
                                    </td>
                                                            
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </section>
    );
}
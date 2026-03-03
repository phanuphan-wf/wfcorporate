import { useState, useEffect, useContext } from "react";

export default function Print_all() {

    return(

        <section className="mt-5 space-y-5">      
            <div className="border border-zinc-300 rounded-md p-4 bg-white mb-4">
                <div className="mb-2">
                    <div className="relative flex items-center mb-2">
                        <h3 className="flex-1 text-left">โซนแสดงสินค้า :</h3>                 
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1" rowSpan={2}>
                                ลำดับ
                            </th>
                            <th className="border px-2 py-1" rowSpan={2}>
                                ชื่อฝ่ายขาย
                            </th>
                            <th colSpan={3} className="border px-2 py-1">
                                ยอดขาย
                            </th>                    
                        </tr>

                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">จำนวนลูกค้า</th>
                            <th className="border px-2 py-1">จำนวนบูธ</th>
                            <th className="border px-2 py-1">ยอดเงิน</th>                    
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            <td className="border border-l-zinc-300 px-2 py-1 text-center"></td>
                            <td className="border px-2 py-1 text-center"></td>
                            <td className="border px-2 py-1 text-center"></td>
                            <td className="border px-2 py-1 text-center"></td>
                            <td className="border px-2 py-1 text-center"></td>
                        </tr>     

                        <tr className="bg-gray-50 font-semibold">
                            <td colSpan={2} className="border border-l-zinc-300 px-2 py-1 text-center">
                            รวมยอดทั้งสิ้น
                            </td>
                            <td className="border px-2 py-1 text-right"></td>
                            <td className="border px-2 py-1 text-right"></td>
                            <td className="border px-2 py-1 text-right"></td>
                        </tr>
                        </tbody>
                    </table>
                </div>        
            </div>
        </section>
    );

}
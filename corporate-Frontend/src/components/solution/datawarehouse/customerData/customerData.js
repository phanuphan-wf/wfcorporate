import React,{createContext, useState, useEffect} from "react";

import CustomerHeader from "./customerHeader";
import CustomerDataList from "./customerDataList";

import AppProtectRoute from "../../../../AppProtectRoute";

export const dataContext = createContext();

export default function CustomerData(){
   const [customer, setCustomer] = useState({ customerID: "", Name: ""});


   const show = AppProtectRoute.find(
    (x) => x.path === "datawarehouse/customerdata"
   ).show;

   const user = JSON.parse(localStorage.getItem("user"));

   if (!show.some((x) => x.dept === user.Dept && x.acc === user.ALevel)) {
      return (
         <section className="2xl:container">
         <h1 className="text-xl text-red-500">
            You are not authorized to view this page
         </h1>
         </section>
      );
   }

   return (
      <dataContext.Provider
         value={{
            customerC: [customer, setCustomer],           
         }}
      >           

       <section id="customer-data">
          <div>
               <h1 className="text-xl my-3">Customer Data</h1>          
          </div>

          <CustomerHeader />
          <CustomerDataList />
          

       </section>
      </dataContext.Provider>
   );
}
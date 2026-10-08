import React, { useContext, useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "./customerData";


export default function CustomerHeader(){
    const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cdp;
    const bearer = useHeader();
    
    Axios.defaults.headers.common = {
        Authorization: "Bearer " + bearer,
    };

    const { customerC } = useContext(dataContext);
    
    const [customer, setCustomer] = customerC;

    const [customerName, setCustomerName] = useState("");  

    const pressEnter = (e) => {
        if (e.key == "Enter") {
            setNameClick();
        }
    }

    const setNameClick = () => {
        setCustomer({ ...customer, customerID: "", Name: customerName });
    }

    
    useEffect(() => {
     // console.log(customerName);
    }, [customerName]);

    useEffect(() => {
     // console.log(customer);
    }, [customer]);

    return (
        <section id="customer-hedaer">
          <div className="flex max-md:flex-col justify-between w-full 2xl:w-4/5">
            <div id="customersearch" className="md:max-w-[40%] flex gap-3 flex-col">
              <div className="flex max-md:flex-wrap gap-3 items-center">
                <label htmlFor="name" className="">
                  Customer Name:
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-72"
                  onChange={(e) =>setCustomerName(e.target.value)}   
                  onKeyDown={pressEnter}              
                  value={customerName}
                />
                <div>
                  <button
                    className="btn-green px-3"
                    onClick={setNameClick}
                  >
                    search
                  </button>
                </div>
              </div>    
             
            </div>
          
          </div>    
       
        </section>
      );


}
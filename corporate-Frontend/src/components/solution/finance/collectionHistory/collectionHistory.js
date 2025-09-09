import React, { createContext, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

import SelectExhibition from "./selectExhibition";
import SelectCustomer from "./selectCustomer";
import PaymentTerm from "./paymentTerm";
import PaymentList from "./paymentList";
import Summary from "./summary";

export const dataContext = createContext();

function CollectionHistory(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cht;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [exhibition, setExhibition] = useState([]);

  const [customer, setCustomer] = useState([]);

  const [data, setData] = useState([]);

  return (
    <dataContext.Provider
      value={{
        exhibitionC: [exhibition, setExhibition],
        customerC: [customer, setCustomer],
        dataC: [data, setData],
      }}
    >
      <section id="collection-history" className="2xl:w-3/4">
        <div className="text-xl">Collection History</div>
        <div className="flex flex-col gap-4 my-4">
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-2">
            <SelectExhibition />
            <SelectCustomer />
          </div>
          <PaymentTerm />
          <PaymentList />
          <Summary />
        </div>
      </section>
    </dataContext.Provider>
  );
}

export default CollectionHistory;

import { createContext, useState } from "react";
import ItemList from "./itemlist";
import CreditDate from "./creditlistdata";

export const dataContext = createContext();

export default function CreditList() {

  const [hasCredit, setHasCredit] = useState(false); 
  
  const [customer, setCustomer] = useState({
    customerID: "",
    Name: "",
    searchName: "",
  });

  const [reloadTable, setReloadTable] = useState(false);

  return (
    <dataContext.Provider value={{
        customerC: [customer, setCustomer],
        reloadTableC: [reloadTable, setReloadTable],
        hasCreditC: [hasCredit, setHasCredit],
      }}
    >
      <ItemList />
      <CreditDate />
    </dataContext.Provider>
  );
}

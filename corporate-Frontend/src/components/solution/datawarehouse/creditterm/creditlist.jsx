import { createContext, useState } from "react";
import ItemList from "./itemlist";
import CreditDate from "./creditlistdata";

export const dataContext = createContext();

export default function CreditList() {
  const [customer, setCustomer] = useState({
    customerID: "",
    Name: "",
    searchName: "",
  });

  return (
    <dataContext.Provider value={{ customerC: [customer, setCustomer] }}>
      <ItemList />
      <CreditDate />
    </dataContext.Provider>
  );
}

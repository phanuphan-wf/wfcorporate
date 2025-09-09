import React, { useEffect, useState, useContext } from "react";
import { dataContext } from "../contractReceive";

import ModalSeach from "./modalSearch";

export default function CustomerSearch(props) {
  const [isSearch, setIsSearch] = useState(false);
  const { searchNameC } = useContext(dataContext);

  const searchCustomer = (e) => {
    if (e.key === "Enter") {
      setIsSearch(true);
    }
  };

  const closeSearch = () => {
    setIsSearch(false);
  };

  const [searchName, setSearchName] = searchNameC;

  const fillName = (cname) => {
    setSearchName(cname);
    setIsSearch(false);
  };

  useEffect(() => {
    //console.log(searchName);
  }, [searchName]);

  return (
    <div className="customer-search">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="customerName">Customer Name:</label>
        <input
          id="customerName"
          className="w-2/3"
          onKeyDown={(e) => searchCustomer(e)}
          onChange={(e) => setSearchName(e.target.value)}
          value={searchName}
        />
        <div className="btn-primary w-1/6" onClick={() => setIsSearch(true)}>
          search
        </div>
      </div>
      <ModalSeach
        show={isSearch}
        onHide={closeSearch}
        search={searchName}
        fill={fillName}
      />
    </div>
  );
}

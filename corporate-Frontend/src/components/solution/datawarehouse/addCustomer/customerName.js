import React, { useContext, useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "../addNewCus";

export default function CustomerName(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { customerNameC } = useContext(dataContext);
  const [customerName, setCustomerName] = customerNameC;

  const [ctype, setCtype] = useState([]);

  const getType = async () => {
    const res = await Axios.get(url + "/getCType").then((r) =>
      setCtype(r.data)
    );
  };

  useEffect(() => {
    getType();
  }, []);

  useEffect(() => {
    //console.log(ctype);
  }, [ctype]);

  return (
    <div
      id="customer-input"
      className="flex items-center justify-between gap-2 max-md:flex-wrap md:w-3/4"
    >
      <div id="customer-name" className="flex gap-2 items-center flex-auto">
        <label htmlFor="txtname" className="w-fit min-w-fit">
          Customer Name
        </label>
        <input
          id="txtname"
          className="w-full"
          onChange={(e) =>
            setCustomerName({ ...customerName, Name: e.target.value })
          }
          value={customerName.Name}
        />
      </div>
      <div
        id="customer-type"
        className="flex gap-2 items-center flex-auto md:max-w-fit"
      >
        <label htmlFor="cmbtype" className="w-fit min-w-fit">
          Customer Type
        </label>
        <select
          id="cbmtype"
          className="cmb min-w-fit"
          onChange={(e) =>
            setCustomerName({ ...customerName, TypeID: e.target.value })
          }
          value={customerName.TypeID}
        >
          <option value={"0"} hidden selected disabled>
            select type
          </option>
          {ctype.map((t, i) => (
            <option value={t.id} key={"customerType-" + i}>
              {t.id == 1 ? "none" : t.type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

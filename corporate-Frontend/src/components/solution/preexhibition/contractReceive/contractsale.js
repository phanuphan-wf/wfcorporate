import React, { useContext, useEffect, useState } from "react";
import { dataContext } from "../contractReceive";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";

import ModalSaleChange from "./modalSaleChange";

export default function ContractSale(props) {
  const { contractDetailC } = useContext(dataContext);
  const [contractDetail, setContractDetail] = contractDetailC;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctr;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [salelist, setSalelist] = useState([]);

  const getSale = async () => {
    const res = await Axios.get(url + "/getSale").then((r) =>
      setSalelist(r.data)
    );
  };

  useEffect(() => {
    getSale();
  }, []);

  const saleChange = (sid) => {
    let oldid = contractDetail.SaleID;
    let oName =
      oldid != "none" ? salelist.filter((s) => s.id == oldid)[0].name : "";
    let nName = salelist.filter((s) => s.id == sid)[0].name;
    setCftxt({
      oldID: contractDetail.SaleID,
      oldName: oName,
      newID: sid,
      newName: nName,
    });
    setModalSale(true);
  };

  const [modalSale, setModalSale] = useState(false);
  const initCftxt = { oldName: "", newName: "" };
  const [cftxt, setCftxt] = useState(initCftxt);

  const confirmChange = (cf) => {
    if (contractDetail.CustomerID != 0) {
      if (cf) {
        setContractDetail({ ...contractDetail, SaleID: cftxt.newID });

        let data = {
          CustomerID: contractDetail.CustomerID,
          SaleID: cftxt.newID,
        };
        changeSale(data);
      } else {
        setContractDetail({ ...contractDetail, SaleID: cftxt.oldID });
      }
    } else {
      setContractDetail({ ...contractDetail, SaleID: "none" });
    }
    setModalSale(false);
    setCftxt(initCftxt);
  };

  const changeSale = async (data) => {
    try {
      const res = await Axios.put(
        url + "/ChangeSales/" + contractDetail.CustomerID,
        data
      );
    } catch (err) {
      if (err.response.status === 404) {
        try {
          const res = await Axios.post(url + "/AddSaleCus", data);
        } catch (err) {
          if (err.response.status === 400) {
            alert("Update Sales to customer error, please contact admin");
          }
        }
      }
    }
  };

  const closeModalSale = () => {
    setModalSale(false);
  };

  const getSales = async () => {
    const res = await Axios.get(
      url + "/getCusSales/" + contractDetail.CustomerID
    ).then((r) =>
      setContractDetail({
        ...contractDetail,
        SaleID: r.data === 0 ? "none" : r.data,
      })
    );
  };

  useEffect(() => {
    getSales();
  }, [contractDetail.CustomerID]);

  useEffect(() => {
    //console.log(cftxt);
  }, [cftxt]);

  return (
    <div id="contract-sale" className="flex items-center gap-2">
      <label htmlFor="salename">Responsible by</label>
      <select
        className="cmb"
        id="salename"
        onChange={(e) => saleChange(e.target.value)}
        value={contractDetail.SaleID}
      >
        <option value={"none"} disabled hidden selected>
          select sales name
        </option>
        {salelist.map((s, i) => (
          <option value={s.id} key={"salecmb-" + i}>
            {s.name}
          </option>
        ))}
      </select>
      <ModalSaleChange
        show={modalSale}
        onHide={closeModalSale}
        txtName={cftxt}
        confirm={confirmChange}
      />
    </div>
  );
}

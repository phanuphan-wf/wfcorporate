import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { dataContext } from ".";

import { AiOutlineEdit } from "react-icons/ai";
import { LiaUndoAltSolid } from "react-icons/lia";
import { BsLink45Deg } from "react-icons/bs";
import ModalEdit from "./modalEdit";

export default function QuotaList() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_squ;
  const { exID, serv, show, modalTextC, quotaC } = useContext(dataContext);

  const [isShow, setIsShow] = show;
  const [modalText, setModalText] = modalTextC;
  const [quotaList, setQuotaList] = quotaC;

  const getQuota = async () => {
    const res = await Axios.get(url + `/quotaList/${exID}/${serv}`, {
      params: { name: customer, sale: sales },
    }).then((r) => {
      if (r.status == 200) {
        setQuotaList(r.data);
      }
    });
  };

  useEffect(() => {
    if (exID != "0" && serv != "0") {
      getQuota();
    }
  }, [exID, serv]);

  useEffect(() => {
    //console.log(quotaList);
  }, [quotaList]);

  const [checkbox, setCheckbox] = useState({ customer: false, sale: false });

  const [customer, setCustomer] = useState("");

  const [sales, setSales] = useState(0);
  const [salelist, setSalelist] = useState([]);

  useEffect(() => {
    if (!checkbox.customer) {
      setCustomer("");
    }
    if (!checkbox.sale) {
      setSales(0);
    }
  }, [checkbox]);

  useEffect(() => {
    if (exID != "0" && serv != "0") {
      if (customer.length >= 3 || customer.length == 0) {
        getQuota();
      }
    }
  }, [customer]);

  useEffect(() => {
    if (exID != "0" && serv != "0") {
      getQuota();
    }
  }, [sales]);

  const getSalelist = async () => {
    const res = await Axios.get(url + "/Salename").then((r) => {
      if (r.status == 200) {
        setSalelist(r.data);
      }
    });
  };

  useEffect(() => {
    getSalelist();
  }, []);

  const onDefault = async (cid) => {
    const res = await Axios.delete(url + "/makeDefaultQuota", {
      params: {
        exID: exID,
        serv: serv,
        id: cid,
      },
    }).then((r) => {
      if (r.status == 200) {
        getQuota();
      } else {
        setModalText({
          header: "Error",
          hcolor: "red",
          body: "Make default quota of this customer fail",
          bcolor: "",
          button: "Ok",
          btncolor: "",
          cancel: false,
        });
        setIsShow(true);
      }
    });
  };

  const onGetLink = async (id) => {
    const res = await Axios.get(url + `/getCustomerCode/${id}/${exID}`).then(
      (r) => {
        if (r.status == 200) {
          setModalText({
            header: "Infomation",
            hcolor: "green",
            body:
              r.data.name +
              "<br/>link is <br/> <a href='https://www.worldfair.co.th/exregist/" +
              r.data.code +
              "' target='blank' style=color:red;>https://www.worldfair.co.th/exregist/" +
              r.data.code +
              "</a>",
            bcolor: "",
            button: "Ok",
            btncolor: "",
            cancel: false,
          });
          setIsShow(true);
        }
      }
    );
  };

  const initEdit = {
    id: 0,
    name: "",
    quota: 0,
  };
  const [editData, setEditData] = useState(initEdit);
  const editClick = (id) => {
    setIsEdit(true);
    const edit = quotaList.filter((q) => q.customerID == id)[0];
    setEditData({ id: id, name: edit.name, quota: edit.quota });
  };

  const [isEdit, setIsEdit] = useState(false);

  const submitQuota = async (i, q) => {
    const res = await Axios.post(url + "/editQuota", {
      customerID: i,
      service: serv,
      exID: exID,
      quota: q,
    });
    setIsEdit(false);
    getQuota();
  };

  return (
    <section className="quotalist my-8">
      <div>Filter : </div>
      <div className="flex items-center gap-4 ml-8">
        <input
          type="checkbox"
          id="customer"
          className="size-4 accent-red-500"
          onChange={() =>
            setCheckbox({ ...checkbox, customer: !checkbox.customer })
          }
        />
        <label htmlFor="customer">Customer Name :</label>
        <input
          id="customerinput"
          className="disabled:bg-gray-200 w-80"
          disabled={!checkbox.customer}
          placeholder="Please type customer name"
          onChange={(e) => setCustomer(e.target.value)}
          value={customer}
        />
      </div>
      <div className="flex items-center gap-4 ml-8 my-4">
        <input
          type="checkbox"
          id="sale"
          className="size-4 accent-red-500"
          onChange={() => setCheckbox({ ...checkbox, sale: !checkbox.sale })}
        />
        <label htmlFor="sale">Sales Name :</label>
        <select
          id="saleselect"
          className="disabled:bg-gray-200 disabled:text-gray-400 w-80 cmb"
          disabled={!checkbox.sale}
          onChange={(e) => setSales(e.target.value)}
          value={sales}>
          <option value={0}>Please select sales name</option>
          {salelist.map((s, i) => (
            <option key={`sales-${i}`} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <table>
        <tr>
          <th className="text-start">Customer Name</th>
          <th className="border-l text-center w-[10%]">B.QTY</th>
          <th className="border-l text-center w-[10%]">Quota</th>
          <th className="border-l text-center w-[10%]">Used</th>
          <th className="border-l text-center w-[10%]">Remain</th>
          <th className="border-l text-center px-4">Action</th>
        </tr>
        {quotaList.map((q, i) => (
          <tr key={`list-${i}`} className="border-t">
            <td className="py-1 border-l-0 pr-16">{q.name}</td>
            <td className="border-l border-gray-200 text-center py-1 px-6">
              {q.booth}
            </td>
            <td className="border-l border-gray-200 text-center py-1 px-6">
              {q.quota}
            </td>
            <td
              className={`border-l border-gray-200 text-center py-1 px-6 ${
                Number(q.used) == 0 ? "text-yellow-500" : ""
              }`}>
              {q.used}
            </td>
            <td
              className={`border-l border-gray-200 text-center py-1 px-6 ${
                Number(q.quota) - Number(q.used) >= 4
                  ? "text-emerald-500"
                  : Number(q.quota) - Number(q.used) < 0
                  ? "text-orange-400"
                  : "text-red-500"
              }`}>
              {Number(q.quota) - Number(q.used)}
            </td>
            <td className="border-l border-gray-200 text-center py-1 px-6">
              <div className="flex gap-2 items-center">
                <button
                  className="bg-amber-500 rounded-lg py-1 w-16 text-white text-sm flex gap-1 items-center justify-center"
                  onClick={() => editClick(q.customerID)}>
                  <AiOutlineEdit /> Edit
                </button>
                {q.edit && (
                  <button
                    className="bg-teal-500 rounded-lg py-1 w-20 text-white text-sm flex gap-1 items-center justify-center"
                    onClick={() => onDefault(q.customerID)}>
                    <LiaUndoAltSolid /> Default
                  </button>
                )}
                <button
                  className="bg-purple-500 rounded-lg py-1 w-16 text-white text-sm flex gap-1 items-center justify-center"
                  onClick={() => onGetLink(q.customerID)}>
                  <BsLink45Deg /> Link
                </button>
              </div>
            </td>
          </tr>
        ))}
      </table>
      <ModalEdit
        show={isEdit}
        onHide={() => setIsEdit(false)}
        data={editData}
        edit={submitQuota}
      />
    </section>
  );
}

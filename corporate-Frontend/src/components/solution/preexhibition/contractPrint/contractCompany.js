import React, { useContext, useState } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import { dataContext } from "./contractPrint";

import ModalSeach from "./modalSearch";
import ModalEditSign from "./modalEditSign";
import ModalEditAddr from "./modalEditAddr";

const ContractCompany = (props) => {
  const { contractC } = useContext(dataContext);

  const [contract, setContract] = contractC;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctp;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [isSearch, setIsSearch] = useState(false);

  const closeSearch = () => {
    setIsSearch(false);
  };

  const [cid, setCid] = useState(0);

  const fillName = (id, name) => {
    setContract({ ...contract, company: name });
    setCid(id);
    getSignperson(id);
    getCustomerAddress(id);
    setIsSearch(false);
  };

  const txtCompanyKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsSearch(true);
    }
  };

  const getSignperson = async (id) => {
    const res = await Axios.get(url + "/getSign/" + id).then((res) => {
      let data = res.data;
      setContract((prev) => ({
        ...prev,
        name: data.name,
        pos: data.position,
        pid: data.personalID,
      }));
    });
  };

  const getCustomerAddress = async (id) => {
    const res = await Axios.get(url + "/getAddr/" + id).then((res) => {
      let data = res.data;
      setContract((prev) => ({
        ...prev,
        addr: consoleAddr(data),
        tel: data.tel,
        fax: data.fax,
        email: data.email,
      }));
    });
  };

  const consoleAddr = (dat) => {
    if (dat.province != undefined) {
      let c = dat;

      let ts = "";
      let td = "";
      switch (c.province) {
        case "กรุงเทพมหานคร":
          ts = "แขวง";
          td = "เขต";
          break;
        case "กรุงเทพฯ":
          ts = "แขวง";
          td = "เขต";
          break;
        case "กรุงเทพ":
          ts = "แขวง";
          td = "เขต";
          break;
        case "กทม":
          ts = "แขวง";
          td = "เขต";
          break;
        case "กทม.":
          ts = "แขวง";
          td = "เขต";
          break;
        default:
          ts = "ตำบล";
          td = "อำเภอ";
      }

      return (
        c.street +
        " " +
        ts +
        c.subDistrict +
        " " +
        td +
        c.district +
        " " +
        c.province +
        " " +
        c.postal
      );
    }
  };

  const [modalAddr, setModalAddr] = useState(false);

  const editAddr = () => {
    getCustomerAddress(cid);
    setModalAddr(false);
  };

  const closeModalAddr = () => {
    setModalAddr(false);
  };

  const [modalSign, setModalSign] = useState(false);

  const closeModalSign = () => {
    setModalSign(false);
  };

  const editSign = () => {
    getSignperson(cid);
    setModalSign(false);
  };

  return (
    <section id="contract-company">
      <div className="my-1 flex items-center">
        <label htmlFor="txt-company" className="w-[150px]">
          สัญญานี้ทำขึ้นระหว่าง
        </label>
        <input
          type="text"
          id="txt-company"
          className="w-[350px]"
          placeholder="Company Name"
          onChange={(e) =>
            setContract({ ...contract, company: e.target.value })
          }
          onKeyDown={(e) => txtCompanyKeyDown(e)}
          value={contract.company}
        />
        <button
          className="btn-green ml-3 px-3"
          onClick={() => setIsSearch(true)}
        >
          search
        </button>
      </div>
      <div className="my-1 flex items-center max-md:flex-wrap">
        <label htmlFor="txt-company" className="w-[150px]">
          โดย
        </label>
        <div className="flex gap-2 items-center">
          {["นาย", "นาง", "นางสาว"].map((p, i) => {
            return (
              <div>
                <input
                  type="radio"
                  id={`rad-pre-${i}`}
                  className="accent-red-500 size-3"
                  name="prefix"
                  onChange={() => setContract({ ...contract, prefix: i })}
                />
                <label htmlFor={`rad-pre-${i}`}>{p}</label>
              </div>
            );
          })}
        </div>
        <input
          type="text"
          id="txt-signname"
          className="w-[350px] ml-3"
          placeholder="Sign Person"
          value={contract.name}
          onChange={(e) => setContract({ ...contract, name: e.target.value })}
        />
        <button
          className="btn-green ml-3 px-3"
          onClick={() => setModalSign(true)}
        >
          change sign person
        </button>
      </div>
      <div className="my-1 flex items-center">
        <label htmlFor="txt-position" className="w-[150px]">
          ตำแหน่ง
        </label>
        <input
          type="text"
          id="txt-position"
          className="w-[350px]"
          placeholder="Position"
          value={contract.pos}
          onChange={(e) => setContract({ ...contract, pos: e.target.value })}
        />
      </div>
      <div className="my-1 flex items-center">
        <label htmlFor="txt-pid" className="w-[150px]">
          บัตรประจำตัวประชาชน
        </label>
        <input
          type="text"
          id="txt-pid"
          className="w-[350px]"
          placeholder="Personal ID"
          value={contract.pid}
          onChange={(e) => setContract({ ...contract, pid: e.target.value })}
        />
      </div>
      <div className="my-1 flex items-start">
        <label htmlFor="txt-pid" className="w-[150px]">
          ที่อยู่
        </label>
        <textarea
          id="txt-addr"
          className="w-[350px] border border-gray-400 p-1 rounded"
          placeholder="Address"
          rows={3}
          value={contract.addr}
          onChange={(e) => setContract({ ...contract, addr: e.target.value })}
        />
        <button
          className="btn-green ml-3 px-3"
          onClick={() => setModalAddr(true)}
        >
          change address
        </button>
      </div>
      <div className="my-1 flex items-center flex-wrap gap-x-3 gap-y-1">
        <div className="flex items-center">
          <label htmlFor="txt-tel" className="w-[150px]">
            โทรศัพท์
          </label>
          <input
            type="text"
            id="txt-tel"
            className="w-[250px]"
            placeholder="telephone"
            value={contract.tel}
            onChange={(e) => setContract({ ...contract, tel: e.target.value })}
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="txt-fax" className="mr-3">
            โทรสาร
          </label>
          <input
            type="text"
            id="txt-fax"
            className="w-[250px]"
            placeholder="facsimile"
            value={contract.fax}
            onChange={(e) => setContract({ ...contract, fax: e.target.value })}
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="txt-mail" className="mr-3">
            อีเมลล์
          </label>
          <input
            type="text"
            id="txt-mail"
            className="w-[250px]"
            placeholder="Email"
            value={contract.email}
            onChange={(e) =>
              setContract({ ...contract, email: e.target.value })
            }
          />
        </div>
      </div>
      <div className="my-1 flex items-center">
        <label htmlFor="txt-line" className="w-[150px]">
          Line ID
        </label>
        <input
          type="text"
          id="txt-line"
          className="w-[250px]"
          placeholder="Line ID"
          value={contract.line}
          onChange={(e) => setContract({ ...contract, line: e.target.value })}
        />
      </div>
      <ModalSeach
        show={isSearch}
        onHide={closeSearch}
        search={contract.company}
        fill={fillName}
      />
      <ModalEditAddr
        show={modalAddr}
        onHide={closeModalAddr}
        cid={cid}
        aftEditSign={editAddr}
      />
      <ModalEditSign
        show={modalSign}
        onHide={closeModalSign}
        cid={cid}
        aftEditSign={editSign}
      />
    </section>
  );
};

export default ContractCompany;

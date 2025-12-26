import { createContext, useState, useEffect } from "react";
import Axios from "axios";
import AppProtectRoute from "../../../../AppProtectRoute";

import QuotaList from "./quotalist";
import ModalInfo from "./modalInfo";
import Download from "./downloadCSV";

export const dataContext = createContext();

export default function ServiceQuota() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_squ;

  const [exList, setExList] = useState([]);
  const [exhibition, setExhibition] = useState("0");

  const [servList, setServList] = useState([]);
  const [service, setService] = useState(0);

  const [quotaList, setQuotaList] = useState([]);

  const getPageload = async () => {
    const [res1, res2] = await Promise.all([
      Axios.get(url + "/exlist"),
      Axios.get(url + "/getService"),
    ]);
    if (res1.status == 200) {
      setExList(res1.data);
    }
    if (res2.status == 200) {
      setServList(res2.data);
    }
  };

  useEffect(() => {
    getPageload();
  }, []);

  useEffect(() => {
    //console.log(exList);
    //console.log(servList);
  }, [exList, servList]);

  const [isShow, setIsShow] = useState(false);

  const initModalText = {
    header: "",
    hcolor: "",
    body: "",
    bcolor: "",
    button: "Ok",
    btncolor: "",
    cancel: true,
  };
  const [modalText, setModalText] = useState(initModalText);

  useEffect(() => {
    if (!isShow) {
      setModalText(initModalText);
    }
    console.log(isShow);
  }, [isShow]);

  /* Check if user is authorized to view this page must insert before return part ----*/
  const show = AppProtectRoute.find(
    (x) => x.path === "preexhibition/servicequota"
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
  /* Check if user is authorized to view this page must insert before return part ----*/
  return (
    <dataContext.Provider
      value={{
        exID: exhibition,
        serv: service,
        show: [isShow, setIsShow],
        modalTextC: [modalText, setModalText],
        quotaC: [quotaList, setQuotaList],
      }}>
      <section className="serviceQuota">
        <h2 className="text-xl md:text-3xl font-medium">Services Quota</h2>
        <div className="mt-4">
          <label htmlFor="exhibition">Exhibition : </label>
          <select
            id="exhibition"
            className="cmb"
            onChange={(e) => setExhibition(e.target.value)}>
            <option value={0} disabled hidden selected>
              Please select exhibition
            </option>
            {exList.map((e, i) => (
              <option key={`exselect-${i}`} value={e.id}>
                {e.name + " (" + e.id + ")"}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label htmlFor="service">Service Type : </label>
          <select
            id="service"
            className="cmb"
            onChange={(e) => setService(e.target.value)}>
            <option value={0} disabled hidden selected>
              Please select service
            </option>
            {servList.map((s, i) => (
              <option key={`servselect-${i}`} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <QuotaList />
        <ModalInfo />
        <div className="max-w-[1100px] w-full flex justify-end">
          <Download />
        </div>
      </section>
    </dataContext.Provider>
  );
}

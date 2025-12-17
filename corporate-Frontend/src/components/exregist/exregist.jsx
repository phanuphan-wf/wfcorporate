import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import ModalSeach from "./modalSearch";

export default function Exregist() {
  const { t, i18n } = useTranslation("exhibitor", { keyPrefix: "regist" });
  const [isSearch, setIsSearch] = useState(false);
  const url = process.env.REACT_APP_API_URI + "/api/Exregist";
  const navigate = useNavigate();

  const param = useParams();

  const closeModal = () => {
    setIsSearch(false);
  };

  const initData = {
    customerID: "",
    Name: "",
    Surname: "",
    Mobile: "",
  };
  const [data, setData] = useState(initData);

  const [onSubmit, setOnSubmit] = useState(false);

  const clickSubmit = async () => {
    let success = false;
    setOnSubmit(true);
    try {
      const res = await Axios.post(url + "/exRegist", data, {
        params: { excode: param.code },
      });

      if (res.status === 200 || res.status === 201) {
        success = true;
        sessionStorage.setItem("excode", res.data.uid);
        navigate("/exqr");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
      } else {
        console.error("Error during submit:", err.response.data);
      }
    }
    setOnSubmit(false);
  };

  const initCustomer = { id: "", name: "" };
  const [customer, setCustomer] = useState(initCustomer);

  const fillCustomer = (i, n) => {
    setCustomer({ id: i, name: n });
    setData({ ...data, customerID: i });
    setIsSearch(false);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  const [notfound, setNotfound] = useState(false);

  const getCustomer = async () => {
    try {
      const res = await Axios.get(url + "/getExhibitor/" + param.code).then(
        (r) => {
          if (r.status == 200) {
            setCustomer(r.data);
            setData({ ...data, customerID: r.data.id });
          }
        }
      );
    } catch (err) {
      if (err.response.status == 404) {
        setNotfound(true);
      } else {
        alert("Error right searching data");
      }
    }
  };

  useEffect(() => {
    if (param.code) {
      getCustomer();
    }
  }, [param.code]);

  useEffect(() => {
    //console.log(customer);
  }, [customer]);

  return (
    <section className="exregsit container mx-auto py-4 px-2 lg:py-10">
      <div className="lg:container flex justify-end lg:px-5 py-4">
        <div className="mr-2">
          {i18n.language == "th" ? "change language" : "เปลี่ยนภาษา"}
        </div>
        <div className="flex gap-2">
          <div
            className={`${
              i18n.language == "en"
                ? "text-slate-300"
                : "font-bold text-red-500"
            } cursor-pointer`}
            onClick={() => i18n.changeLanguage("en")}>
            Eng
          </div>
          <div>|</div>
          <div
            className={`${
              i18n.language == "th"
                ? "text-slate-300"
                : "font-bold text-red-500"
            } cursor-pointer`}
            onClick={() => i18n.changeLanguage("th")}>
            ไทย
          </div>
        </div>
      </div>
      <div className="size-20">
        <img
          src={require("../img/logo-wf-sq.png")}
          alt="wf-logo"
          className=" w-full object-contain"
        />
      </div>
      <h1 className="text-2xl">{t("title")}</h1>
      <p>{t("subtitle")}</p>
      <div className="mt-4 md:w-2/3 xl:w-1/2">
        <label htmlFor="exhibitor" className="block">
          {t("customer")}
        </label>

        <div className={`flex justify-end ${param.code && "hidden"}`}>
          <button
            className="px-2 py-2 border border-amber-500 bg-amber-500 text-white rounded-lg max-md:w-full"
            onClick={() => setIsSearch(true)}>
            {t("search")}
          </button>
        </div>

        <input
          name="exhibitor"
          placeholder={t("text-placeholder")}
          className={`w-full mt-2 ${notfound ? "text-red-500" : ""}`}
          value={
            customer.name != "" ? customer.name : notfound ? t("notfound") : ""
          }
        />
        <label htmlFor="name" className="block mt-2">
          {t("name")}
        </label>
        <input
          name="name"
          className="w-full mt-2"
          onChange={(e) => setData({ ...data, Name: e.target.value })}
          value={data.Name}
        />
        <label htmlFor="surname" className="block mt-2">
          {t("surname")}
        </label>
        <input
          name="surname"
          className="w-full mt-2"
          onChange={(e) => setData({ ...data, Surname: e.target.value })}
          value={data.Surname}
        />
        <label htmlFor="mobile" className="block mt-2">
          {t("mobile")}
        </label>
        <input
          name="mobile"
          className="w-full mt-2"
          onChange={(e) =>
            setData({ ...data, Mobile: e.target.value.replace(/\D/g, "") })
          }
          value={data.Mobile}
          type="tel"
          inputmode="numeric"
          pattern="[0-9]{10}"
          maxlength="10"
        />
      </div>
      <div className="flex justify-end mt-5">
        <button
          className="px-2 py-2 max-md:w-full border border-red-500 bg-red-500 text-white rounded-lg"
          onClick={clickSubmit}
          disabled={onSubmit}>
          {t("submit")}
        </button>
      </div>

      <ModalSeach show={isSearch} onHide={closeModal} fill={fillCustomer} />
    </section>
  );
}

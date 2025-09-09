import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

import ModalSeach from "./modalSearch";

export default function Exregist() {
  const [isSearch, setIsSearch] = useState(false);
  const url = process.env.REACT_APP_API_URI + "/api/Exregist";
  const navigate = useNavigate();

  const closeModal = () => {
    setIsSearch(false);
  };

  const generateRandomCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    const getRandom = (chars, length) =>
      Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");

    const prefix = getRandom(letters, 2);
    const middle = getRandom(numbers, 4);
    const suffix = getRandom(letters, 2);

    return prefix + middle + suffix;
  };

  const initData = {
    customerID: "",
    Name: "",
    Surname: "",
    Mobile: "",
    recNum: 1,
    uid: "",
  };
  const [data, setData] = useState(initData);

  const clickSubmit = async () => {
    let code = generateRandomCode();
    let success = false;

    while (!success) {
      code = generateRandomCode();

      try {
        const res = await Axios.post(url + "/exRegist", {
          ...data,
          uid: code,
        });

        if (res.status === 200 || res.status === 201) {
          success = true;
          sessionStorage.setItem("excode", code);
          navigate("/exqr");
        }
      } catch (err) {
        if (err.response && err.response.status === 409) {
        } else {
          console.error("Error during submit:", err);
          break;
        }
      }
    }
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

  return (
    <section className="exregsit container mx-auto py-4 px-2 lg:py-10">
      <div className="size-20">
        <img
          src={require("../img/logo-wf-sq.png")}
          alt="wf-logo"
          className=" w-full object-contain"
        />
      </div>
      <h1 className="text-2xl">ฟอร์มลงทะเบียนผู้แสดงสินค้าค้า</h1>
      <div className="mt-4 md:w-2/3 xl:w-1/2">
        <label htmlFor="exhibitor" className="block">
          ชื่อร้านค้า
        </label>

        <div className="flex justify-end">
          <button
            className="px-2 py-2 border border-amber-500 bg-amber-500 text-white rounded-lg max-md:w-full"
            onClick={() => setIsSearch(true)}>
            ค้นหาชื่อร้านค้า
          </button>
        </div>

        <input
          name="exhibitor"
          placeholder="กรุณาค้นหาชื่อร้านค้าเท่านั้น"
          className="w-full mt-2"
          value={customer.name != "" ? customer.name : ""}
        />
        <label htmlFor="name" className="block mt-2">
          ชื่อ
        </label>
        <input
          name="name"
          className="w-full mt-2"
          onChange={(e) => setData({ ...data, Name: e.target.value })}
          value={data.Name}
        />
        <label htmlFor="surname" className="block mt-2">
          นามสกุล
        </label>
        <input
          name="surname"
          className="w-full mt-2"
          onChange={(e) => setData({ ...data, Surname: e.target.value })}
          value={data.Surname}
        />
        <label htmlFor="mobile" className="block mt-2">
          เบอร์มือถือ
        </label>
        <input
          name="mobile"
          className="w-full mt-2"
          onChange={(e) => setData({ ...data, Mobile: e.target.value })}
          value={data.Mobile}
        />
      </div>
      <div className="flex justify-end mt-5">
        <button
          className="px-2 py-2 max-md:w-full border border-red-500 bg-red-500 text-white rounded-lg"
          onClick={clickSubmit}>
          ลงทะเบียน
        </button>
      </div>

      <ModalSeach show={isSearch} onHide={closeModal} fill={fillCustomer} />
    </section>
  );
}

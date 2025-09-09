import React, { useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import CorrectDate from "../../../hook/correctDate";
import { MD5 } from "crypto-js";

function NewEmployee() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_eml;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [department, setDepartment] = useState([]);
  const [access, setAccess] = useState([]);

  const getDepartment = async () => {
    const res = await Axios.get(url + "/getDept").then((r) =>
      setDepartment(r.data)
    );
  };

  const getAccess = async () => {
    const res = await Axios.get(url + "/getAcc").then((r) => setAccess(r.data));
  };

  useEffect(() => {
    getDepartment();
    getAccess();
  }, []);

  const initData = {
    EmployeeID: "",
    Name: "",
    Surname: "",
    Position: "",
    ALevel: 3,
    Dept: 3,
    EmployDate:
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1) +
      "-" +
      (new Date().getDate() < 10
        ? "0" + new Date().getDate()
        : new Date().getDate()),
    Street: "",
    Subdistrict: "",
    District: "",
    Province: "",
    Postal: "",
    IDcard: "",
    Birthdate:
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1) +
      "-" +
      (new Date().getDate() < 10
        ? "0" + new Date().getDate()
        : new Date().getDate()),
    Religion: "",
    Blood: "",
    Tel: "",
    ext: "",
    email: "",
    Bondsman: "",
    BondsTel: "",
    Picture: "",
    resign: false,
    comm: 2.5,
  };

  const [data, setData] = useState(initData);

  const initUser = {
    User: "",
    Password: "wf1234",
    PassHush: MD5("wf1234").toString(),
    EmployeeID: "",
    Change: 1,
  };

  const [user, setUser] = useState(initUser);

  useEffect(() => {
    //console.log(data);
  }, [data]);

  const initVerify = {
    EmployeeID: true,
    Name: true,
    Surname: true,
    Position: true,
    User: true,
    Tel: true,
  };

  const [verfiy, setVerify] = useState(initVerify);
  const [pending, setPending] = useState(false);

  const submitEmp = async (e) => {
    var change = false;
    ["EmployeeID", "Name", "Surname", "Position", "Tel"].map((v) => {
      if (data[v] == "") {
        setVerify((prevState) => ({ ...prevState, [v]: false }));
        change = true;
      } else {
        setVerify((prevState) => ({ ...prevState, [v]: true }));
      }
    });

    if (user.User == "") {
      setVerify((prevState) => ({ ...prevState, User: false }));
      change = true;
    } else {
      setVerify((prevState) => ({ ...prevState, User: true }));
    }

    if (change) {
      alert("Please fill all required field");
      return;
    }
    setPending(true);
    const [res1, res2] = await Promise.all([
      Axios.post(url + "/newEmp", data),
      Axios.post(url + "/newUser", user),
    ]);

    if (res1.status == 200 && res2.status == 200) {
      alert("Add new employee success");
      setData(initData);
      setUser(initUser);
    } else {
      alert("Error! - Add new employee not success");
    }
    setPending(false);
  };

  return (
    <section id="new-employee">
      <div className="text-xl border-b w-full pb-4">Add new employee</div>
      <div className="flex flex-col gap-2 xl:w-4/5 mt-4">
        <div>
          <label htmlFor="eid" className="block md:inline-block w-28">
            Employee ID
          </label>
          <input
            type="text"
            id="eid"
            onChange={(e) => {
              setData({ ...data, EmployeeID: e.target.value });
              setUser({ ...user, EmployeeID: e.target.value });
            }}
            className={`${verfiy.EmployeeID ? "" : "bg-red-500 bg-opacity-40"}`}
            value={data.EmployeeID}
          />
        </div>
        <div className="flex max-md:flex-col gap-2 md:gap-4">
          <div>
            <label htmlFor="name" className="block md:inline-block w-28">
              Name
            </label>
            <input
              type="text"
              id="name"
              onChange={(e) => setData({ ...data, Name: e.target.value })}
              className={`${verfiy.Name ? "" : "bg-red-500 bg-opacity-40"}`}
              value={data.Name}
            />
          </div>
          <div>
            <label htmlFor="surname" className="block md:inline-block w-28">
              Surname
            </label>
            <input
              type="text"
              id="surname"
              onChange={(e) => setData({ ...data, Surname: e.target.value })}
              className={`${verfiy.Surname ? "" : "bg-red-500 bg-opacity-40"}`}
              value={data.Surname}
            />
          </div>
        </div>
        <div className="flex max-md:flex-col gap-2 md:gap-4">
          <div>
            <label htmlFor="name" className="block md:inline-block w-28">
              Username
            </label>
            <input
              type="text"
              id="name"
              onChange={(e) => {
                setUser({ ...user, User: e.target.value });
              }}
              className={`${verfiy.User ? "" : "bg-red-500 bg-opacity-40"}`}
              value={user.User}
            />
          </div>
          <div>
            <label htmlFor="alevel" className="block md:inline-block w-28">
              Access Level
            </label>
            <select
              id="alevel"
              className="cmb"
              onChange={(e) => setData({ ...data, ALevel: e.target.value })}
              value={data.ALevel}
            >
              {access.map((acc) => (
                <option key={acc.alv} value={acc.alv} selected={acc.alv == 3}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex max-md:flex-col gap-2 md:gap-4">
          <div>
            <label htmlFor="position" className="block md:inline-block w-28">
              Position
            </label>
            <input
              type="text"
              id="position"
              onChange={(e) => setData({ ...data, Position: e.target.value })}
              className={`${verfiy.Position ? "" : "bg-red-500 bg-opacity-40"}`}
              value={data.Position}
            />
          </div>
          <div>
            <label htmlFor="department" className="block md:inline-block w-28">
              Department
            </label>
            <select
              id="department"
              className="cmb w-56"
              onChange={(e) => setData({ ...data, Dept: e.target.value })}
              value={data.Dept}
            >
              {department.map((dept) => (
                <option key={dept.id} value={dept.id} selected={dept.id == 3}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="employdate" className="block md:inline-block w-28">
              EmployDate
            </label>
            <input
              type="date"
              id="employdate"
              className="w-44"
              onChange={(e) => setData({ ...data, EmployDate: e.target.value })}
              value={data.EmployDate}
            />
          </div>
        </div>
        <div>
          <label htmlFor="street" className="block md:inline-block w-28">
            Street
          </label>
          <input
            type="text"
            id="street"
            className="w-full md:w-1/2"
            onChange={(e) => setData({ ...data, Street: e.target.value })}
            value={data.Street}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-2">
          <div>
            <label htmlFor="subdistrict" className="block md:inline-block w-28">
              Subdistrict
            </label>
            <input
              type="text"
              id="subdistrict"
              onChange={(e) =>
                setData({ ...data, Subdistrict: e.target.value })
              }
              value={data.Subdistrict}
            />
          </div>
          <div>
            <label htmlFor="district" className="block md:inline-block w-28">
              District
            </label>
            <input
              type="text"
              id="district"
              onChange={(e) => setData({ ...data, District: e.target.value })}
              value={data.District}
            />
          </div>
          <div>
            <label htmlFor="province" className="block md:inline-block w-28">
              Province
            </label>
            <input
              type="text"
              id="province"
              onChange={(e) => setData({ ...data, Province: e.target.value })}
              value={data.Province}
            />
          </div>
          <div>
            <label htmlFor="postal" className="block md:inline-block w-28">
              Postal
            </label>
            <input
              type="text"
              id="postal"
              onChange={(e) => setData({ ...data, Postal: e.target.value })}
              value={data.Postal}
            />
          </div>
          <div>
            <label htmlFor="tel" className="block md:inline-block w-28">
              Tel
            </label>
            <input
              type="text"
              id="tel"
              onChange={(e) => setData({ ...data, Tel: e.target.value })}
              className={`${verfiy.Tel ? "" : "bg-red-500 bg-opacity-40"}`}
              value={data.Tel}
            />
          </div>
          <div>
            <label htmlFor="ext" className="block md:inline-block w-28">
              Ext#
            </label>
            <input
              type="text"
              id="ext"
              onChange={(e) => setData({ ...data, ext: e.target.value })}
              value={data.ext}
            />
          </div>
          <div>
            <label htmlFor="pid" className="block md:inline-block w-28">
              ID Card
            </label>
            <input
              type="text"
              id="pid"
              onChange={(e) => setData({ ...data, IDcard: e.target.value })}
              value={data.IDcard}
            />
          </div>
          <div>
            <label htmlFor="birth" className="block md:inline-block w-28">
              Birthdate
            </label>
            <input
              type="date"
              id="birth"
              className="w-52"
              onChange={(e) => setData({ ...data, Birthdate: e.target.value })}
              value={data.Birthdate}
            />
          </div>
          <div className="col-start-1">
            <label htmlFor="religion" className="block md:inline-block w-28">
              Religion
            </label>
            <input
              type="text"
              id="religion"
              onChange={(e) => setData({ ...data, Religion: e.target.value })}
              value={data.Religion}
            />
          </div>
          <div>
            <label htmlFor="blood" className="block md:inline-block w-28">
              Blood
            </label>
            <input
              type="text"
              id="blood"
              onChange={(e) => setData({ ...data, Blood: e.target.value })}
              value={data.Blood}
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block md:inline-block w-28">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="w-full md:w-1/3"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            value={data.email}
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            className="btn-green px-2 disabled:opacity-65"
            onClick={submitEmp}
            disabled={pending}
          >
            {pending ? "saving..." : "Submit"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default NewEmployee;

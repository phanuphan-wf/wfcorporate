import React, { useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import CorrectDate from "../../../hook/correctDate";
import { MD5 } from "crypto-js";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function EditEmployee(props) {
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

  const { eid } = useParams();

  const initData = {
    EmployeeID: "",
    Name: "",
    Surname: "",
    Position: "",
    ALevel: 3,
    Dept: 3,
    employDate: "",
    Street: "",
    Subdistrict: "",
    District: "",
    Province: "",
    Postal: "",
    IDcard: "",
    birthdate: "",
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

  const getEmpData = async () => {
    const [res1, res2] = await Promise.all([
      Axios.get(url + "/getEmpData/" + eid),
      Axios.get(url + "/getUserData/" + eid),
    ]);
    setData(res1.data);
    setUser({
      ...user,
      User: res2.data.user,
      EmployeeID: res2.data.id,
      Change: 0,
    });
  };

  useEffect(() => {
    getEmpData();
  }, [eid]);

  const initVerify = {
    EmployeeID: true,
    Name: true,
    Surname: true,
    Position: true,
    User: true,
    Tel: true,
  };

  const [verfiy, setVerify] = useState(initVerify);

  const nav = useNavigate();

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
      Axios.post(url + "/editEmp", data),
      Axios.post(url + "/editUser", user),
    ]);

    if (res1.status == 200 && res2.status == 200) {
      alert("Edit employee data success");
      nav("/solution/datawarehouse/employeelist");
    } else {
      alert("Edit employee data failed, please contact admin");
    }
    setPending(false);
  };

  useEffect(() => {
    console.log(data);
    console.log(user);
  }, [data, user]);

  return (
    <section id="edit-employee">
      <div className="text-xl border-b w-full pb-4">Edit employee</div>
      <div className="flex flex-col gap-2 xl:w-4/5 mt-4">
        <div>
          <label htmlFor="eid" className="block md:inline-block w-28">
            Employee ID
          </label>
          <input
            type="text"
            id="eid"
            onChange={(e) => {
              setData({ ...data, employeeID: e.target.value });
              setUser({ ...user, employeeID: e.target.value });
            }}
            className={`${verfiy.EmployeeID ? "" : "bg-red-500 bg-opacity-40"}`}
            value={data.employeeID}
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
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className={`${verfiy.Name ? "" : "bg-red-500 bg-opacity-40"}`}
              value={data.name}
            />
          </div>
          <div>
            <label htmlFor="surname" className="block md:inline-block w-28">
              Surname
            </label>
            <input
              type="text"
              id="surname"
              onChange={(e) => setData({ ...data, surname: e.target.value })}
              className={`${verfiy.Surname ? "" : "bg-red-500 bg-opacity-40"}`}
              value={data.surname}
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
              onChange={(e) => setData({ ...data, aLevel: e.target.value })}
              value={data.aLevel}
            >
              {access.map((acc) => (
                <option key={acc.alv} value={acc.alv} selected={acc.alv == 3}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="checkbox"
              id="change"
              className={`accent-green-600 size-4 mr-3`}
              onChange={(e) =>
                setUser({ ...user, Change: e.target.checked ? 1 : 0 })
              }
            />
            <label
              htmlFor="change"
              className={`inline-block ${
                user.Change === 1 ? "text-green-600 font-medium" : ""
              }`}
            >
              Reset Password
            </label>
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
              onChange={(e) => setData({ ...data, position: e.target.value })}
              className={`${verfiy.Position ? "" : "bg-red-500 bg-opacity-40"}`}
              value={data.position}
            />
          </div>
          <div>
            <label htmlFor="department" className="block md:inline-block w-28">
              Department
            </label>
            <select
              id="department"
              className="cmb w-56"
              onChange={(e) => setData({ ...data, dept: e.target.value })}
              value={data.dept}
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
              onChange={(e) => setData({ ...data, employDate: e.target.value })}
              value={
                data.employDate != ""
                  ? CorrectDate(data.employDate, "", "yyyy-mm-dd")
                  : ""
              }
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
            onChange={(e) => setData({ ...data, street: e.target.value })}
            value={data.street}
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
                setData({ ...data, subdistrict: e.target.value })
              }
              value={data.subdistrict}
            />
          </div>
          <div>
            <label htmlFor="district" className="block md:inline-block w-28">
              District
            </label>
            <input
              type="text"
              id="district"
              onChange={(e) => setData({ ...data, district: e.target.value })}
              value={data.district}
            />
          </div>
          <div>
            <label htmlFor="province" className="block md:inline-block w-28">
              Province
            </label>
            <input
              type="text"
              id="province"
              onChange={(e) => setData({ ...data, province: e.target.value })}
              value={data.province}
            />
          </div>
          <div>
            <label htmlFor="postal" className="block md:inline-block w-28">
              Postal
            </label>
            <input
              type="text"
              id="postal"
              onChange={(e) => setData({ ...data, postal: e.target.value })}
              value={data.postal}
            />
          </div>
          <div>
            <label htmlFor="tel" className="block md:inline-block w-28">
              Tel
            </label>
            <input
              type="text"
              id="tel"
              onChange={(e) => setData({ ...data, tel: e.target.value })}
              className={`${verfiy.Tel ? "" : "bg-red-500 bg-opacity-40"}`}
              value={data.tel}
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
              onChange={(e) => setData({ ...data, iDcard: e.target.value })}
              value={data.iDcard}
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
              onChange={(e) => setData({ ...data, birthdate: e.target.value })}
              value={
                data.birthdate != ""
                  ? CorrectDate(data.birthdate, "", "yyyy-mm-dd")
                  : ""
              }
            />
          </div>
          <div className="col-start-1">
            <label htmlFor="religion" className="block md:inline-block w-28">
              Religion
            </label>
            <input
              type="text"
              id="religion"
              onChange={(e) => setData({ ...data, religion: e.target.value })}
              value={data.religion}
            />
          </div>
          <div>
            <label htmlFor="blood" className="block md:inline-block w-28">
              Blood
            </label>
            <input
              type="text"
              id="blood"
              onChange={(e) => setData({ ...data, blood: e.target.value })}
              value={data.blood}
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
        <div>
          <input
            type="checkbox"
            id="resign"
            className="accent-red-500 mr-3 size-4 md:ml-[120px] mt-3"
            onChange={(e) => setData({ ...data, resign: !data.resign })}
            value={data.resign}
          />
          <label
            htmlFor="resign"
            className={`inline-block ${
              data.resign ? "text-red-500 font-medium" : ""
            }`}
          >
            Employee Resigned
          </label>
        </div>
        <div className="w-full flex justify-end">
          <button
            className="btn-green px-2"
            onClick={submitEmp}
            disabled={pending}
          >
            {pending ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </section>
  );
}

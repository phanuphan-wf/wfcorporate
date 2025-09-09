import React, { useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { useLocalStorage } from "../../../hook/useLocalStorage";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function EmployeeList() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_eml;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [data, setData] = useState([]);
  const [department, setDepartment] = useState([]);

  const getData = async () => {
    const res = await Axios.get(url + "/getEmp").then((r) => setData(r.data));
  };

  const getDepartment = async () => {
    const res = await Axios.get(url + "/getDept").then((r) =>
      setDepartment(r.data)
    );
  };

  useEffect(() => {
    getDepartment();
  }, []);

  useEffect(() => {
    getData();
  }, [bearer]);

  const acc = useLocalStorage("user")[0].ALevel;
  const dept = useLocalStorage("user")[0].Dept;

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (dept == 7) {
      setAuth(true);
    } else if (dept == 1 || dept == 6) {
      if (acc == 1) {
        setAuth(true);
      }
    } else {
      setAuth(false);
    }
  }, [acc, dept]);

  const nav = useNavigate();

  const editEm = (id) => {
    nav("/solution/management/editemployee/" + id);
  };

  return (
    <section id="employeelist">
      <div className="text-xl border-b w-full pb-4">Our Team</div>
      {department.map((dept) => (
        <div key={dept.id}>
          <div className="text-lg font-medium text-white mt-4 bg-gradient-to-r from-red-500 to-transparent to-[80%] px-3">
            {dept.name}
          </div>
          <div className="flex flex-wrap">
            {data.map(
              (e) =>
                e.department == dept.id && (
                  <div key={e.id} className="w-full md:w-1/2 p-4">
                    <div
                      className={`border rounded-lg overflow-hidden grid ${
                        auth ? "md:grid-cols-[1fr_1fr_0.2fr]" : "md:grid-cols-2"
                      }`}
                    >
                      <div className="p-4">
                        <div className="text-lg font-bold">{e.name}</div>
                        <div className="text-sm">{e.position}</div>
                      </div>
                      <div className="h-full flex flex-col justify-end py-4">
                        <div className="text-sm">Tel : {e.tel}</div>
                        <div className="text-sm">Ext. : {e.ext}</div>
                      </div>
                      {auth && (
                        <div
                          className="bg-yellow-500 flex justify-center items-center text-white text-lg cursor-pointer hover:bg-yellow-600"
                          onClick={() => editEm(e.id)}
                        >
                          <FaUserEdit />
                        </div>
                      )}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export default EmployeeList;

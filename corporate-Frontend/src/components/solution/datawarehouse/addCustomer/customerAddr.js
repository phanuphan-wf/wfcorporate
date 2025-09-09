import React, { useContext, useEffect, useState } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "../addNewCus";

export default function CustomerAddr(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctm;
  const bearer = useHeader();
  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };
  const { customerAC } = useContext(dataContext);
  const [customerA, setCustomerA] = customerAC;

  const [province, setProvince] = useState([]);
  const getProvince = async () => {
    const res = await Axios.get(url + "/getProvince").then((r) =>
      setProvince(r.data)
    );
  };
  useEffect(() => {
    getProvince();
  }, []);

  const [district, setDistrict] = useState([]);
  const provinceChange = (p) => {
    const pdata = province.filter((x) => x.id == p)[0];
    setCustomerA({ ...customerA, Province: pdata.name, Postal: "" });
    getDistrict(pdata.id);
    setSubdistrict([]);
    document.getElementById("districtcmb").value = "0";
    document.getElementById("subdistrictcmb").value = "0";
  };

  const getDistrict = async (d) => {
    const res = await Axios.get(url + "/getDistrict/" + d).then((r) =>
      setDistrict(r.data)
    );
  };

  const [subdistrict, setSubdistrict] = useState([]);
  const districtChange = (d) => {
    const ddata = district.filter((x) => x.id == d)[0];
    setCustomerA({ ...customerA, District: ddata.name, Postal: "" });
    getSubdistrict(ddata.id);
    document.getElementById("subdistrictcmb").value = "0";
  };

  const getSubdistrict = async (s) => {
    const res = await Axios.get(url + "/getSubDistrict/" + s).then((r) =>
      setSubdistrict(r.data)
    );
  };

  const subdisChange = (s) => {
    const sdata = subdistrict.filter((x) => x.id == s)[0];
    setCustomerA({
      ...customerA,
      SubDistrict: sdata.name,
      Postal: sdata.zip.toString(),
    });
  };

  return (
    <div id="customer-address" className="mt-2">
      <div className="md:flex items-start gap-2">
        <label htmlFor="street">Address :</label>
        <textarea
          id="street"
          rows={2}
          className="border-[#b3b3b3] border rounded-md md:w-3/4 lg:w-1/2 w-full"
          onChange={(e) =>
            setCustomerA({ ...customerA, Street: e.target.value })
          }
          value={customerA.Street}
        />
      </div>
      <div className="flex items-center justify-between gap-2 mt-2 md:w-3/4 flex-wrap">
        <div className="flex items-center gap-2 md:flex-auto max-md:w-full">
          <label htmlFor="province" className="min-w-fit">
            Province :
          </label>
          <select
            id="province"
            className="w-full cmb"
            onChange={(e) => provinceChange(e.target.value)}
          >
            <option value={"0"} disabled hidden selected>
              please select Province
            </option>
            {province.map((p, i) => (
              <option value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 md:flex-auto max-md:w-full">
          <label htmlFor="districtcmb" className="min-w-fit">
            District :
          </label>
          <select
            id="districtcmb"
            className="w-full cmb"
            onChange={(e) => districtChange(e.target.value)}
          >
            <option value={"0"} disabled hidden selected>
              please select District
            </option>
            {district.map((d, i) => (
              <option value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-2 md:w-3/4 flex-wrap">
        <div className="flex items-center gap-2 md:flex-auto max-md:w-full">
          <label htmlFor="subdistrictcmb" className="min-w-fit">
            Subdistrict :
          </label>
          <select
            id="subdistrictcmb"
            className="w-full cmb"
            onChange={(e) => subdisChange(e.target.value)}
          >
            <option value={"0"} disabled hidden selected>
              please select Subdistrict
            </option>
            {subdistrict.map((s, i) => (
              <option value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 md:flex-auto max-md:w-full">
          <label htmlFor="postal" className="min-w-fit">
            Postal :
          </label>
          <input
            id="postal"
            className="w-full"
            value={customerA.Postal}
            onChange={(e) =>
              setCustomerA({ ...customerA, Postal: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-2 md:w-3/4 flex-wrap">
        <div className="flex items-center gap-2 md:flex-auto max-md:w-full">
          <label htmlFor="tel" className="min-w-fit">
            Telephone :
          </label>
          <input
            id="tel"
            className="w-full"
            onChange={(e) =>
              setCustomerA({ ...customerA, Tel: e.target.value })
            }
            value={customerA.Tel}
          />
        </div>
        <div className="flex items-center gap-2 md:flex-auto max-md:w-full">
          <label htmlFor="line" className="min-w-fit">
            Line :
          </label>
          <input
            id="line"
            className="w-full"
            onChange={(e) =>
              setCustomerA({ ...customerA, Fax: e.target.value })
            }
            value={customerA.Fax}
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-2 md:w-3/4 flex-wrap">
        <div className="flex items-center gap-2 md:flex-auto max-md:w-full">
          <label htmlFor="email" className="min-w-fit">
            Email :
          </label>
          <input
            id="email"
            className="w-full"
            onChange={(e) =>
              setCustomerA({ ...customerA, email: e.target.value })
            }
            value={customerA.email}
          />
        </div>
        <div className="flex items-center gap-2 md:flex-auto max-md:w-full">
          <label htmlFor="line" className="min-w-fit">
            Website :
          </label>
          <input
            id="line"
            className="w-full"
            onChange={(e) =>
              setCustomerA({ ...customerA, web: e.target.value })
            }
            value={customerA.web}
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-2 md:w-3/4 flex-wrap">
        <div className="flex items-center gap-2 flex-auto">
          <label htmlFor="taxID" className="min-w-fit">
            Tax ID :
          </label>
          <input
            id="taxID"
            className="w-full"
            onChange={(e) =>
              setCustomerA({ ...customerA, TaxID: e.target.value })
            }
            value={customerA.TaxID}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="office" className="min-w-fit">
              Office :
            </label>
            <select
              id="office"
              className="w-full cmb"
              onChange={(e) =>
                setCustomerA({
                  ...customerA,
                  Branch: e.target.value,
                  subBranch:
                    e.target.value != "2" ? "000" : customerA.subBranch,
                })
              }
            >
              <option value={"1"}>Head Office</option>
              <option value={"2"}>Branch</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="branch" className="min-w-fit">
              Branch :
            </label>
            <input
              id="branch"
              className="w-full disabled:bg-gray-300 disabled:border-gray-300"
              onChange={(e) =>
                setCustomerA({ ...customerA, subBranch: e.target.value })
              }
              value={customerA.subBranch != "000" ? customerA.subBranch : ""}
              disabled={customerA.Branch != "2"}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 w-2/3">
        <label htmlFor="taxName" className="min-w-fit">
          Tax Name :
        </label>
        <input
          id="taxName"
          className="w-full"
          onChange={(e) =>
            setCustomerA({ ...customerA, TaxName: e.target.value })
          }
          value={customerA.TaxName}
        />
      </div>
    </div>
  );
}

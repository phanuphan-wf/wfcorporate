import { useState, useEffect, createContext } from "react";
import Axios from "axios";

export const dataContext = createContext();

export default function ServiceReceive() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_squ;

  const [service, setService] = useState(0);
  const [serviceList, setServiceList] = useState([]);
  const getServiceList = async () => {
    const res = await Axios.get(url + "/getService").then((r) => {
      if (r.status == 200) {
        setServiceList(r.data);
      }
    });
  };

  useEffect(() => {
    getServiceList();
  }, []);

  return (
    <dataContext.Provider value={{ serv: service }}>
      <h2 className="text-xl md:text-3xl font-medium">Services Receiving</h2>
      <div className="flex gap-4 items-center mt-8">
        <label htmlFor="cmb-service">Service :</label>
        <select className="cmb" onChange={(e) => setService(e.target.value)}>
          <option value={0} disabled hidden select>
            please select service
          </option>
          {serviceList.map((s, i) => (
            <option key={`service-item-${i + 1}`}>{s.name}</option>
          ))}
        </select>
      </div>
    </dataContext.Provider>
  );
}

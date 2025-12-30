import { useContext, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { dataContext } from ".";
import Axios from "axios";

export default function Download() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_squ;
  const { exID, quotaC } = useContext(dataContext);

  const [quota, setQuota] = quotaC;
  const data = quota.map((q) => q.customerID);

  const exportfile =
    "link_list_" +
    exID +
    "(" +
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear() +
    ").csv";

  const [list, setList] = useState([]);
  const getList = async () => {
    const res = await Axios.post(url + `/getCustomerList/${exID}`, data).then(
      (r) => {
        if (r.status == 200) {
          setList(r.data);
        }
      }
    );
  };

  useEffect(() => {
    if (data.length > 0) {
      getList();
    }
  }, [quota]);

  return (
    <div className="mb-16">
      {quota.length != 0 && (
        <CSVLink data={list} filename={exportfile} className="btn-green px-2">
          Download CSV
        </CSVLink>
      )}
    </div>
  );
}

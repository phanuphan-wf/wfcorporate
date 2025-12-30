import { useContext, useState, useEffect } from "react";
import Axios from "axios";
import { dataContext } from "./index";

export default function UsedList() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_squ;
  const { serv, cidC } = useContext(dataContext);

  const [cid, setCid] = cidC;

  const [userlist, setUserlist] = useState([]);

  const getUsedList = async () => {
    const res = await Axios.get(url + "/checkUser/" + cid + "/" + serv).then(
      (r) => {
        if (r.status == 200) {
          setUserlist(r.data);
        }
      }
    );
  };

  useEffect(() => {
    if (cid) {
      getUsedList();
    } else {
      setUserlist([]);
    }
  }, [cid]);

  const formatDateTime = (dateString) => {
    const locale = "en-EN";

    const d = new Date(dateString);
    d.setHours(d.getHours() + 7);

    return d.toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    //console.log(userlist);
  }, [userlist]);

  return (
    <section className="userlist mt-8">
      <table className="w-full lg:w-[750px]">
        <tr className="border-b">
          <th className="text-start w-[50%] border-r">Used Name</th>
          <th className="text-center w-[50%]">Used Time</th>
        </tr>
        {userlist.map((u, i) => (
          <tr className="border-b last:border-b-0">
            <td className="border-l-0 border-r">{u.name + " " + u.surname}</td>
            <td className="border-l text-center">{formatDateTime(u.usedAt)}</td>
          </tr>
        ))}
      </table>
    </section>
  );
}

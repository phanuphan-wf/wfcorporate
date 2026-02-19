import { useState, useEffect } from "react";
import Axios from "axios";

export default function ShowHighlightList(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;
  const [expoList, setExpoList] = useState([]);

  /* ================== GET LIST ================== */
  const getShow = async () => {
    try {
      const res = await Axios.get(url + "/getShow");
      if (res.status === 200) {
        setExpoList(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* โหลดข้อมูลครั้งแรก + เมื่อ reload เปลี่ยน */
  useEffect(() => {
    getShow();
  }, [props.reload]);

  useEffect(() => {
    console.log(expoList);
  }, [expoList]);

  return (
    <section className="Show Expo">
      <div className="flex items-center gap-4">
        <div className="font-medium text-lg">Expo list</div>
      </div>

      <table className="w-[1024px] my-4">
        <thead>
          <tr className="border border-neutral-600">
            <th>Expo</th>
            <th className="border-l border-neutral-600">ExID</th>
            <th className="border-l border-neutral-600">Title</th>
            <th className="border-l border-neutral-600">Show Day</th>
            <th className="border-l border-neutral-600">Time</th>
            <th className="border-l border-neutral-600">Venue</th>
          </tr>
        </thead>
        <tbody>
          {expoList.length > 0 &&
            expoList.map((h, i) => (
              <tr className="border border-neutral-600">
                <td className="align-middle border-l border-neutral-600 text-center">
                  <img
                    src={
                      "https://worldfair.blob.core.windows.net/webcalendar/" +
                      h.banner
                    }
                    alt={`${h.banner}`}
                    className="w-[100px] h-[100px] object-contain mx-auto"
                  />
                </td>

                <td className="align-middle border-b border-neutral-600 text-center">
                  {h.exID}
                </td>

                <td className="align-middle border-b border-neutral-600 text-center">
                  {h.title}
                </td>
                <td className="align-middle border-b border-neutral-600 text-center">
                  {h.dates}
                </td>
                <td className="align-middle border-b border-neutral-600 text-center">
                  {h.times}
                </td>
                <td className="align-middle border-b border-neutral-600 text-center">
                  {h.venue}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
}

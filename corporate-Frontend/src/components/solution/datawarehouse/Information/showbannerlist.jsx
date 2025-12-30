import { useState, useEffect } from "react";
import Axios from "axios";

export default function ShowBannerList(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;

  const [herolist, setHerolist] = useState([]);
  const getList = async () => {
    const res = await Axios.get(url + "/HeroShow").then((r) => {
      if (r.status == 200) {
        setHerolist(r.data);
      }
    });
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (herolist.length > 0) {
      initShow();
    }
  }, [herolist]);

  useEffect(() => {
    let c = props.reload;
    if (c.length != 0) {
      getList();
    }
  }, [props.reload]);

  const [show, setShow] = useState(0);

  const initShow = () => {
    const showID = herolist.filter((h) => h.show)[0];
    setShow(showID.id);
  };

  return (
    <section className="showbanner">
      <div className="font-medium text-lg">Banner list</div>
      <table className="w-[1024px] my-4">
        <thead>
          <tr className="border-b border-neutral-600">
            <th>On Show</th>
            <th className="border-l border-neutral-600">Banner</th>
            <th className="border-l border-neutral-600">ExID</th>
            <th className="border-l border-neutral-600">Title</th>
            <th className="border-l border-neutral-600">Show Day</th>
            <th className="border-l border-neutral-600">Vanue</th>
            <th className="border-l border-neutral-600">Show Time</th>
          </tr>
        </thead>
        <tbody>
          {herolist.length > 0 &&
            herolist.map((h, i) => (
              <tr
                className={`border-b border-neutral-600 last:border-b-0 ${
                  h.show ? "bg-red-100" : ""
                }`}>
                <td className="align-middle border-l-0 text-center">
                  <input
                    type="radio"
                    name="hero"
                    checked={h.id == show}
                    className="size-4 accent-red-500"
                    onChange={() => setShow(h.id)}
                  />
                </td>
                <td className="align-middle border-l border-neutral-600">
                  <img
                    src={
                      "https://worldfair.blob.core.windows.net/website/" +
                      h.banner
                    }
                    alt={`${h.banner}`}
                    className="object-contain w-[120px] h-20"
                  />
                </td>
                <td className="align-middle border-l border-neutral-600 text-center">
                  {h.exID}
                </td>
                <td className="align-middle border-l border-neutral-600">
                  {h.title}
                </td>
                <td className="align-middle border-l border-neutral-600 text-center">
                  {h.showdate}
                </td>
                <td className="align-middle border-l border-neutral-600">
                  {h.venue}
                </td>
                <td className="align-middle border-l border-neutral-600">
                  {h.showtime}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
}

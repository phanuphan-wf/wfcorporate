import React, { useContext, useState, useEffect } from "react";
import { dataContext } from "./smsNumber";
import Axios from "axios";

function ShowList(props) {
  const { url, exTypeC, exSelC } = useContext(dataContext);

  const [exType, setExType] = exTypeC;
  const [exlist, setExlist] = useState([]);

  const getExhibitor = async () => {
    const res = await Axios.get(url + "/Exhibitionload/" + exType).then((r) =>
      setExlist(r.data)
    );
  };

  const [venue, setVenue] = useState([]);

  const getUnique = () => {
    let ic = [];
    exlist.map((e, i) => {
      if (e.nickname != undefined) {
        ic.push(e.nickname);
      }
    });
    const uniqueCat = [...new Set(ic)];
    setVenue(uniqueCat);
  };

  useEffect(() => {
    getExhibitor();
  }, [exType]);

  useEffect(() => {
    getUnique();
    setExSelected([]);
  }, [exlist]);

  const [exSelected, setExSelected] = exSelC;

  const selectEx = (e) => {
    if (exSelected.includes(e)) {
      setExSelected(exSelected.filter((ex) => ex !== e));
    } else {
      setExSelected([...exSelected, e]);
    }
  };

  return (
    <div className="border rounded-lg px-4 py-2 border-gray-300 relative">
      <div className="absolute -top-[12px] left-5 bg-white px-4">
        <h2 className="font-medium">Show Select</h2>
      </div>

      {venue.map((v, i) => (
        <div key={v}>
          <div className="border-b border-red-500 mb-2">
            <div className="relative top-[4px] bg-white pr-2 w-fit">{v}</div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {exlist.map((ex, i) => {
              if (ex.nickname === v) {
                return (
                  <div className="flex gap-2 items-center" key={`exname-${i}`}>
                    <input
                      type="checkbox"
                      id={ex.exhibitionID}
                      className="size-4 accent-red-500"
                      onChange={() => selectEx(ex.exhibitionID)}
                      checked={exSelected.includes(ex.exhibitionID)}
                    />
                    <label htmlFor={ex.exhibitionID} className="ml-2">
                      {ex.exhibitionID}
                    </label>
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShowList;

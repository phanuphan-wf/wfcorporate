import { useState, useEffect, useContext } from "react";
import { BoothContext } from "./createBooth";
import Axios from "axios";

export default function ListBooth() {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cb;
  const { boothC, listVersion } = useContext(BoothContext);
  const [booth, setBooth] = boothC;
  const [list, setList] = useState([]);
  const [grouped, setGrouped] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(url + "/getBoothlist/" + booth.exid);
        setList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (booth.exid !== "0") {
      fetchData();
    } else {
      setList([]);
    }
  }, [booth.exid, listVersion]);

  // Group by row (letters prefix) and sort by numeric part.
  // Treat formats like A1/2 or A1,2 as the same row "A".
  // Do not show an OTHER row.
  useEffect(() => {
    const groups = new Map();
    for (const item of list) {
      const boothNo = (item.boothNo || item.BoothNo || "").toString().trim();
      const rowMatch = boothNo.match(/^[A-Za-z]+/);
      if (!rowMatch) continue; // skip entries without letter prefix
      const row = rowMatch[0].toUpperCase();
      const numMatch = boothNo.match(/(\d+)/); // first number only for sorting
      const num = numMatch
        ? parseInt(numMatch[1], 10)
        : Number.POSITIVE_INFINITY;
      if (!groups.has(row)) groups.set(row, []);
      groups.get(row).push({ item, boothNo, num });
    }
    const sorted = Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([row, items]) => {
        items.sort(
          (x, y) => x.num - y.num || x.boothNo.localeCompare(y.boothNo)
        );
        return { row, items };
      });
    setGrouped(sorted);
  }, [list]);

  return (
    <section className="list-box mt-8">
      <div className="border rounded-lg relative">
        <div className="absolute z-10 -top-[15px] left-4">
          <h3 className="bg-white px-3 py-1">List Booth</h3>
        </div>
        <div className="w-full pt-6 px-4 pb-4">
          {grouped.length === 0 ? (
            <div>No booths available for the selected exhibition.</div>
          ) : (
            grouped.map(({ row, items }) => (
              <div key={row} className="mb-4">
                <h4 className="font-semibold mb-2">Row {row}</h4>
                <div className="flex flex-wrap gap-2">
                  {items.map(({ item, boothNo }) => (
                    <span
                      key={item.boothID || item.BoothID || boothNo}
                      className={`px-2 py-1 border rounded ${
                        item.available
                          ? "bg-green-100 border-green-400"
                          : "bg-gray-200 border-gray-400 line-through"
                      }`}>
                      {boothNo}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

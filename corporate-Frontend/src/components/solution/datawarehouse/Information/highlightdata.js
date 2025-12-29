import React, { useEffect, useState } from "react";
import Axios from "axios";

export default function Hilight(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_web;

  const initData = {
    banner: "",
    title: "",
    text: "",
    date: "",
  };

  const [data, setData] = useState([initData]);

  const getHilight = async () => {
    const res = await Axios.get(url + "/getHilight").then((res) =>
      setData(res.data)
    );
  };

  useEffect(() => {
    getHilight();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
        // const res = await Axios.delete(
        // `${process.env.REACT_APP_API_URI}/exhibition/${data.ExhibitionID}`
        // );

        alert("Delete successful");

        // 🔁 หลังลบเสร็จ
        // navigate("/exhibition");
        // หรือ refresh data
    } catch (error) {
        console.error(error);
        alert("Delete failed");
    }
    };


  return (
    <section className="home_hilight">
      <div className=" bg-gray-300 py-6">
        <h1 className="text-center text-2xl md:text-4xl">
          ไฮไลท์งานแสดงสินค้า
        </h1>
        <div className="flex gap-4 md:gap-8 py-6 overflow-x-scroll overflow-hidden snap-mandatory snap-x  md:justify-center px-3 md:px-[100px]">
          {data.map((d, i) => (
            <div
              className="bg-white p-3 w-[300px] min-h-[450px] h-fit snap-center snap-always shadow-md flex-none"
              key={"card-ex-" + i}
            >
              <div className="w-full aspect-square">
                <img
                  src={
                    "https://worldfair.blob.core.windows.net/webcard/" +
                    d.banner
                  }
                  className="object-cover w-full"
                />
              </div>
              <div className="mt-3 flex flex-col justify-between h-fit">
                <div>
                  <strong>{d.title}</strong>
                </div>
                <div>{d.text}</div>
                <div>
                  <strong>{d.date}</strong>
                </div>

               <div>
                    <button
                        className="px-4 btn-primary mt-1"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>


              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

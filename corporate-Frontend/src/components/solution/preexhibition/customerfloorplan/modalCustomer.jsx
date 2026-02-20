import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";

export default function ModalShowCustomer(props) {
  const { i18n } = useTranslation();
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_fl;
  const [width, setWidth] = useState(window.innerWidth - 40);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth - 40);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  });

  const isTh = i18n.language == "th";

  const [data, setData] = useState({});

  const getData = async () => {
    if (props.id != 0 && props.id != undefined) {
      const res = await Axios.get(url + "/getDetail/" + props.id, {
        headers: {
          "Accept-Language": i18n.language,
        },
      }).then((r) => {
        if (r.status == 200) {
          setData(r.data);
        }
      });
    }
  };

  useEffect(() => {
    getData();
  }, [i18n.language, props.id]);

  const changeLanguage = () => {
    let lng = i18n.language;
    if (lng == "en") {
      i18n.changeLanguage("th");
    } else {
      i18n.changeLanguage("en");
    }
  };

  return (
    <section
      className="w-full h-screen fixed bg-black/20 z-30 top-0 left-0"
      hidden={!props.show}>
      <div
        className="w-full h-screen fixed z-30 top-0 left-0"
        onClick={props.onHide}></div>
      <div
        className="fixed z-50 left-[10px] top-1/2 -translate-y-1/2 h-fit min-h-[200px] bg-white rounded-xl p-4"
        style={{ width: width }}>
        <div className="w-fit ml-auto">
          <div className="flex items-center gap-2 text-sm">
            <span>Language:</span>
            <button
              className={`${i18n.language == "en" ? "text-red-500" : ""}`}
              onClick={changeLanguage}>
              EN
            </button>
            <span>|</span>
            <button
              className={`${i18n.language == "th" ? "text-red-500" : ""}`}
              onClick={changeLanguage}>
              ไทย
            </button>
          </div>
        </div>
        <div className="font-medium text-lg">{data?.name}</div>
        <div className="w-full max-w-[450px] mx-auto my-4 max-h-[300px] overflow-hidden">
          <img
            src={`https://worldfair.blob.core.windows.net/showfloorplan/${data?.picture}`}
            alt=""
            className="object-cover"
          />
        </div>
        <div className="flex items-center gap-4 mb-3">
          <label className="font-medium">
            {isTh ? "แถวทางเดิน :" : "Aisle :"}
          </label>
          <div>{data?.brow}</div>
        </div>
        <div className="mb-3">
          <label className="font-medium">
            {isTh ? "ข้อมูลร้านค้า :" : "Exhibitor Info :"}
          </label>
          <div className="pl-6">{data?.description}</div>
        </div>
        <div className="mb-3">
          <label className="font-medium">
            {isTh ? "ประเภทสินค้า :" : "Product :"}
          </label>
          <div className="pl-6">{data?.product}</div>
        </div>
        <div className="flex justify-end" onClick={props.onHide}>
          <button className="btn-gray px-4">
            {isTh ? "ปิดหน้าต่าง" : "close"}
          </button>
        </div>
      </div>
    </section>
  );
}

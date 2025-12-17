import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect, useContext } from "react";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";
import { dataContext } from "./exhibitorBadge";

export default function ModalQR(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_frontdesk;

  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };
  const { exID, exDataC } = useContext(dataContext);
  const [exData, setExData] = exDataC;

  const [excode, setExcode] = useState({});

  const getCode = async () => {
    try {
      const res = await Axios.get(
        url + "/getCustomerCode/" + exData.id + "/" + exID
      ).then((r) => {
        if (r.status == 200) {
          setExcode(r.data);
        }
      });
    } catch (err) {
      return;
    }
  };

  useEffect(() => {
    if (bearer) {
      if (exData.id != "" || exData.id != undefined) {
        getCode();
      }
    }
  }, [exData]);

  return (
    <section
      className={`customerQr absolute ${
        props.show ? "" : "hidden"
      } w-full h-screen z-50 bg-transparent top-0 left-0`}
      onClick={() => props.onHide()}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full lg:w-1/2 h-2/3 shadow-lg px-2 py-4 flex flex-col gap-4 justify-center rounded-lg">
        {Object.keys(excode).length != 0 ? (
          <div className=" flex flex-col gap-4 justify-between items-center h-3/4">
            <div className="text-center">
              <label className="text-2xl font-medium">
                Registration QR for
              </label>
              <p className="text-2xl mt-3 text-red-500">{excode.name}</p>
            </div>
            <div className="flex justify-center">
              <QRCodeSVG
                value={"https://www.worldfair.co.th/exregist/" + excode.code}
                size={200}
              />
            </div>
            <div>
              Please use mobile to capture this qr code to access registraion
              link
            </div>
          </div>
        ) : (
          <div>Cannot find data of this customer</div>
        )}
      </div>
    </section>
  );
}

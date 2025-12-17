import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import { useEffect, useState } from "react";

export default function Exqr() {
  const registcode = sessionStorage.getItem("excode");
  const { t, i18n } = useTranslation("exhibitor", { keyPrefix: "qr" });
  const url = process.env.REACT_APP_API_URI + "/api/Exregist";

  const [customer, setCustomer] = useState({});
  const getCustomer = async () => {
    try {
      const res = await Axios.get(url + "/getRegist/" + registcode).then((r) =>
        setCustomer(r.data)
      );
    } catch (err) {
      alert("Error! Cannot find exhibitor name");
    }
  };

  const [exhibition, setExhibition] = useState({});
  const getExhibition = async () => {
    try {
      const res = await Axios.get(url + "/getExhibition/" + registcode).then(
        (r) => setExhibition(r.data)
      );
    } catch (err) {
      alert("Error! Cannot find exhibition data");
    }
  };

  function formatDateTime(dateString) {
    const lang = i18n.language;

    const locale = lang === "th" ? "th-TH" : "en-US";

    return new Date(dateString).toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const footer = t("footer", { returnObjects: true });

  useEffect(() => {
    getCustomer();
    getExhibition();
  }, []);
  return (
    <div className="container mx-auto py-6 text-center">
      <div className="border-b">
        <div className="w-[100px] mx-auto mb-4">
          <img
            src={require("../img/logo-wf.png")}
            alt="wf"
            className="object-contain"
          />
        </div>
      </div>
      <h1
        className="font-medium text-3xl text-center mt-4 text-red-500"
        dangerouslySetInnerHTML={{ __html: t("title") }}
      />
      {Object.keys(exhibition).length && (
        <div>
          <h3 className="font-medium text-xl text-center">{exhibition.name}</h3>
          <p>
            {formatDateTime(exhibition.start) +
              " - " +
              formatDateTime(exhibition.end)}
          </p>
        </div>
      )}
      <div className="flex flex-col items-center mt-6">
        <div>
          <QRCodeSVG value={registcode} size={200} />
        </div>
        <div className="text-xs">{registcode}</div>
      </div>
      {Object.keys(customer).length && (
        <p className="text-lg font-medium py-4">{customer.name}</p>
      )}
      <div className="w-full px-4 max-w-[450px] text-start mx-auto">
        {footer.map((f, i) => (
          <ul className="list-disc list-inside text-sm first:text-red-500">
            <li>{f}</li>
          </ul>
        ))}
      </div>
    </div>
  );
}

import { QRCodeSVG } from "qrcode.react";

export default function Exqr() {
  const registcode = sessionStorage.getItem("excode");
  return (
    <div className="container mx-auto py-6">
      <div className="border-b">
        <div className="w-[100px] mx-auto mb-4">
          <img
            src={require("../img/logo-wf.png")}
            alt="wf"
            className="object-contain"
          />
        </div>
      </div>
      <h1 className="font-medium text-lg text-center mt-4">
        ขอบคุณสำหรับการลงทะเบียน
        <br />
        โปรดแสดง qr code กับเจ้าหน้าที่
        <br />
        เพื่อทำการลงทะเบียน
      </h1>
      <div className="flex flex-col items-center mt-6">
        <div>
          <QRCodeSVG value={registcode} size={200} />
        </div>
        <div className="text-xs">{registcode}</div>
      </div>
      <div>
        <p className="text-center w-3/4 mx-auto text-sm mt-4 text-red-500">
          ท่านสามารถบันทึกภาพหน้าจอให้เจ้าหน้าที่สำหรับการลงทะเบียนได้
          เพื่อความสะดวกในกรณีที่ต้องการปิดหน้าเบราเซอร์นี้
        </p>
      </div>
    </div>
  );
}

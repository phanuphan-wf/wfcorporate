import React, { useContext } from "react";
import { dataContext } from "../contractReceive";

export default function SignatureImg(prop) {
  const { signatureC } = useContext(dataContext);
  const [signImg, setSignImg] = signatureC;

  return (
    <div className="signatureImg">
      <div>
        <span>Signature Specimen</span>
      </div>
      <div className="w-full h-[120px] mt-2">
        <img
          src={
            signImg.img != undefined &&
            "https://worldfair.blob.core.windows.net/solution-signature/" +
              signImg.img +
              ".jpg"
          }
          alt="signature"
          className="object-contain object-center w-full max-h-[120px]"
        />
      </div>
    </div>
  );
}

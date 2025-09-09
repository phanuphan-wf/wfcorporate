import React from "react";

export default function CookieAccept(props) {
  const acceptCookies = () => {
    props.accept();
  };

  return (
    <div id="cookie-consent" className="cookie-consent">
      <div className="fixed bottom-0 w-full bg-slate-400 bg-opacity-70 h-fit z-[1000]">
        <div className="container my-4 text-white px-4">
          <div className="col-sm-8">
            <h4 className="cookie-consent__title font-medium border-b">
              นโยบายคุกกี้
            </h4>
          </div>
          <div className="flex justify-between mt-2 max-sm:flex-col gap-2">
            <p className="cookie-consent__message">
              เวปไซต์ของเวิลด์แฟร์ใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณเท่านั้น
              โดยการใช้เวปไซต์คุณต้องยอมรับการใช้คุกกี้
            </p>
            <div className="flex gap-3 max-sm:flex-col">
              <button
                className="cookie-consent__btn btn-primary px-2"
                id="accept-cookies"
                onClick={acceptCookies}
              >
                ยอมรับ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

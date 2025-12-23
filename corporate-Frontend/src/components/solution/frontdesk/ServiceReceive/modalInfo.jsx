import { useContext, useEffect } from "react";

import { dataContext } from "./index";

export default function ModalInfo() {
  const { show, modalTextC } = useContext(dataContext);

  const [isShow, setIsShow] = show;
  const [modalText, setModalText] = modalTextC;

  const textColors = {
    red: "text-red-500",
    green: "text-green-500",
    gray: "text-neutral-500",
  };

  const bgColors = {
    red: "bg-red-500",
    green: "bg-green-500",
    gray: "bg-neutral-500",
  };

  useEffect(() => {
    console.log(modalText);
  }, [modalText]);

  const modalAction = () => {
    // set modal action here

    setIsShow(false);
  };

  return (
    <section
      className={`modalInfo ${
        isShow ? "" : "hidden"
      } absolute top-0 left-0 w-full h-screen bg-transparent`}
      onClick={() => setIsShow(false)}>
      <div className="bg-white w-1/2 h-1/4 absolute top-1/2 left-1/2 shadow-lg -translate-x-1/2 -translate-y-2/3 rounded-xl flex flex-col justify-between py-4">
        <div
          className={`px-4 border-b ${textColors[modalText.hcolor]} text-lg `}>
          {modalText.header}
        </div>

        <div className={`${textColors[modalText.bcolor]} px-4 text-center`}>
          {modalText.body}
        </div>
        <div className="flex justify-between items-center px-4">
          {modalText.cancel ? (
            <button
              className="px-3 py-1 bg-zinc-500 rounded-lg text-white"
              onClick={() => setIsShow(false)}>
              Cancel
            </button>
          ) : (
            ""
          )}
          <button
            className={`px-3 py-1 ${
              modalText.btncolor != ""
                ? bgColors[modalText.btncolor]
                : "bg-red-500"
            } rounded-lg text-white min-w-16`}
            onClick={modalAction}>
            {modalText.button}
          </button>
        </div>
      </div>
    </section>
  );
}

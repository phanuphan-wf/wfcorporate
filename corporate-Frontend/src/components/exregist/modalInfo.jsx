import { useEffect } from "react";

//ไม่ได้ใช่ context เพราะform ส่งไม่ได้ create
export default function ModalInfo(props) {
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

  return (
    <section
      className={`modalInfo ${
        props.show ? "" : "hidden"
      } absolute top-0 left-0 w-full h-screen bg-transparent`}
      onClick={() => props.onHide()}>
      <div className="bg-white w-[calc(100%-16px)] lg:w-1/2 h-1/3 lg:h-1/4 absolute top-1/2 left-1/2 shadow-lg -translate-x-1/2 -translate-y-2/3 rounded-xl flex flex-col justify-between py-4 border">
        <div
          className={`px-4 border-b ${textColors[props.text.hcolor]} text-lg `}>
          {props.text.header}
        </div>

        <div
          className={`${textColors[props.text.bcolor]} px-4 text-center`}
          dangerouslySetInnerHTML={{ __html: props.text.body }}></div>
        <div className="flex justify-between items-center px-4">
          {props.text.cancel ? (
            <button
              className="px-3 py-1 bg-zinc-500 rounded-lg text-white"
              onClick={() => props.onHide()}>
              Cancel
            </button>
          ) : (
            ""
          )}
          <button
            className={`px-3 py-1 ${
              props.text.btncolor != ""
                ? bgColors[props.text.btncolor]
                : "bg-red-500"
            } rounded-lg text-white min-w-16`}
            onClick={() => props.onHide()}>
            {props.text.button}
          </button>
        </div>
      </div>
    </section>
  );
}

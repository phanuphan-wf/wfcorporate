import React, { useEffect, useState } from "react";

export default function Summarize(props) {
  const [sum, setSum] = useState({});

  useEffect(() => {
    setSum(props.data);
  }, [props.data]);

  return (
    <section className="summarize mt-5">
      <div className="flex flex-col gap-y-5 items-center sm:flex-row sm:justify-center md:justify-around md:gap-3 px-5">
        <div className="px-1 py-1 text-center rounded-lg sm:rounded-r-none md:rounded-lg bg-green-500 text-white w-56">
          <div className="py-1">Total Registration</div>
          <div className="py-2 text-slate-500 bg-white w-full rounded-b-md text-2xl">
            {sum.regist}
            <div className="text-sm">pax</div>
          </div>
        </div>
        <div className="px-1 py-1 text-center rounded-lg sm:rounded-none md:rounded-lg bg-red-500 text-white w-56">
          <div className="py-1">Preregistration</div>
          <div className="py-2 text-slate-500 bg-white w-full rounded-b-md text-2xl">
            {sum.preregist}
            <div className="text-sm">pax</div>
          </div>
        </div>
        <div className="px-1 py-1 text-center rounded-lg sm:rounded-l-none md:rounded-lg bg-blue-500 text-white w-56">
          <div className="py-1">Received</div>
          <div className="py-2 text-slate-500 bg-white w-full rounded-b-md text-2xl">
            {sum.present}
            <div className="text-sm">pax</div>
          </div>
        </div>
      </div>
    </section>
  );
}

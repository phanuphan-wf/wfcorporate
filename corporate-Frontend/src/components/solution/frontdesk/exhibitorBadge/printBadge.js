import React, { forwardRef, useEffect, useState } from "react";

import badge from "./i124ExBadge.jpg";

const PrintBadge = (props, ref) => {
  const [exName, setExName] = useState("");

  useEffect(() => {
    setExName(props.exName);
  }, [props.exName]);

  const [i, setI] = useState(0);

  useEffect(() => {
    setI(props.no * 3);
  }, [props.no]);

  return (
    <div
      className={`relative w-[56mm] h-[79mm] print:mt-[3mm] print:ml-[3mm]`}
      ref={ref}
    >
      <div className="absolute z-0 top-0 left-0 w-full">
        <img src={badge} />
      </div>
      <div
        className={`absolute w-full text-center font-semibold text-2xl px-1 top-[16mm] left-1/2 -translate-x-1/2 h-[18mm] text-clip overflow-hidden break-words whitespace-normal`}
      >
        {exName}
      </div>
    </div>
  );
};

export default forwardRef(PrintBadge);

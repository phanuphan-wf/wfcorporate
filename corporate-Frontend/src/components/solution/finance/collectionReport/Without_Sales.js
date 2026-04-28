import { useContext, useMemo } from "react";
import { dataContext } from "./report";

import PrintButton from "./PrintButton"; 

export default function Without_Sales() {
  const { reportC,filterC } = useContext(dataContext);
  const [reportlist] = reportC;
  const [filter] = filterC;

  return (
    <section className="mt-6 space-y-8">

     < h3 className="text-lg font-semibold">Without Sales</h3>
    </section>
  );
}

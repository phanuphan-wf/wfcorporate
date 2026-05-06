import { useContext, useMemo } from "react";
import { dataContext } from "./report";

export default function SummaryReport() {
  const { reportC,filterC} = useContext(dataContext);
  const [reportlist] = reportC;    
  const [filter] = filterC;

  

  return (
    <section className="mt-6 space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">Summary Report</h2>
       
      </div>
    </section>
  );
}

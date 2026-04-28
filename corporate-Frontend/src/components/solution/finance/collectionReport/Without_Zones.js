import { useContext, useMemo } from "react";
import { dataContext } from "./report";
import { pdf, Document, Page, Text, View, StyleSheet, Font ,Image} from "@react-pdf/renderer";

import PrintButton from "./PrintButton"; 

export default function Without_Zones() {
  const {filterC} = useContext(dataContext);  
  const [filter] = filterC;


  return (
    <section className="mt-6 space-y-8">
      <h3 className="text-lg font-semibold">Without Zones</h3>   
    </section>
  );
}

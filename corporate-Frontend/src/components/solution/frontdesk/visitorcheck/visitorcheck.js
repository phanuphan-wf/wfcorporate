import React, { useState } from "react";

import VisSearch from "./vissearch";
import VisCheck from "./vischeck";

export default function VisitorCheck(props) {
  const [reset, setReset] = useState(false);

  const onReset = () => {
    setReset(!reset);
  };

  return (
    <section className="visitorcheck">
      <div className="text-xl md:text-3xl font-medium">Visitor Check</div>
      <VisCheck reset={onReset} />
      <VisSearch reset={reset} />
    </section>
  );
}

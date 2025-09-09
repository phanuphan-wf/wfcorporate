import React, { useEffect } from "react";

import Hero from "./hero";
import Nextshow from "./nextshow";

export default function Calendar() {
  useEffect(() => {
    document.title = "Thailand's Leading Consumer Show Organizer | World Fair";
  }, []);
  return (
    <section className="calendar">
      <Hero />
      <Nextshow />
    </section>
  );
}

import React from "react";

import Hero from "./hero";
import Hilight from "./hilight";
import Exp from "./exp";
import Ani from "./40Ani";
import Trust from "./trust";

export default function Home() {
  return (
    <section className="home">
      <Hero />
      <Hilight />
      <Exp />
      <Ani />
      <Trust />
    </section>
  );
}

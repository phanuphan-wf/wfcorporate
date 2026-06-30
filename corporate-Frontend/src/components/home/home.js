import { useState } from "react";

import Hero from "./hero";
import Hilight from "./hilight";
import Exp from "./exp";
import Ani from "./40Ani";
import Trust from "./trust";

import SplaseModal from "./spModal";

export default function Home() {
  const [isShow, setIsShow] = useState(true);

  const closeModal = () => {
    setIsShow(false);
  };

  return (
    <section className="home">
      <SplaseModal show={isShow} onHide={closeModal} />
      <div
        className={`${isShow ? "grayscale" : ""} transition-all duration-500`}>
        <Hero />
        <Hilight />
        <Exp />
        <Ani />
        <Trust />
      </div>
    </section>
  );
}

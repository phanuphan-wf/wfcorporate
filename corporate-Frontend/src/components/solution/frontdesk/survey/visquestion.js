import React from "react";
import VisQOffent from "./vis-q-offent";
import VisQTV from "./vis-q-tv";
import VisQFav from "./vis-q-fav";
import VisMedia from "./vis-q-media";

export default function VisitorQuestion(props) {
  return (
    <section id="visitor-question">
      <div id="question header" className="border-b mb-4">
        <h1 className="text-xl">Visitor Question</h1>
      </div>
      <VisQOffent />
      <VisMedia />
      <VisQTV />
      <VisQFav />
    </section>
  );
}

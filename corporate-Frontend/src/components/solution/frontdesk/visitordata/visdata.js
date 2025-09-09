import React, { useEffect, useState } from "react";
import Axios from "axios";
import * as d3 from "d3";

import useHeader from "../../../hook/useHeader";

import Summarize from "./summarize";
import MediaSum from "./media";
import Receive from "./receive";

export default function VisitorData(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_frontdesk;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [visData, setVisData] = useState([]);
  const initFilter = { preregist: false, received: false };
  const [filter, setFilter] = useState(initFilter);
  const [loading, setLoading] = useState(true);

  const getvis = async () => {
    const res = await Axios.get(url + "/registData/false/false").then((res) => {
      setVisData(res.data);
    });
    setLoading(false);
  };

  useEffect(() => {
    getvis();
  }, [bearer, filter]);

  const [sum, setSum] = useState({});
  const [visitor, setVis] = useState([]);

  const countAll = () => {
    let vis = visData;
    if (filter.preregist) {
      vis = vis.filter((v) => v.preregist == false);
    }
    if (filter.received) {
      vis = vis.filter((v) => v.receive != null);
    }

    let Regist = d3.count(vis, (v) => v.id);
    let preRegist = d3.count(
      vis.filter((v) => v.preregist == true),
      (v) => v.id
    );
    let Present = d3.count(
      vis.filter((v) => v.receive != null),
      (v) => v.id
    );

    setSum({
      ...sum,
      regist: Regist,
      preregist: preRegist,
      present: Present,
    });
    setVis(vis);
  };

  useEffect(() => {
    countAll();
  }, [visData]);

  const onFilterChange = (f) => {
    setLoading(true);
    if (f == "p") {
      setFilter({ ...filter, preregist: !filter.preregist });
    } else {
      setFilter({ ...filter, received: !filter.received });
    }
  };

  return (
    <section className="visitorData">
      <div className="text-xl md:text-3xl font-medium">Visitor Data</div>
      <div>
        <div>Filter :</div>
        <div className="data-filter flex gap-8">
          <div>
            <input
              type="checkbox"
              id="received"
              className="mr-2"
              checked={filter.received}
              onChange={() => onFilterChange("r")}
            />
            <label for="receviec">Received Only</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="notpreregist"
              className="mr-2"
              checked={filter.preregist}
              onChange={() => onFilterChange("p")}
            />
            <label for="notpreregist">Not Preregister</label>
          </div>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Summarize data={sum} />
          <Receive data={visitor} />
          <MediaSum data={visitor} />
        </div>
      )}
    </section>
  );
}

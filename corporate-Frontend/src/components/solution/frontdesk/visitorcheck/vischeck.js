import React, { useState } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";
import SendPixelVis from "./SendPixelVisitor";

import ModalResult from "./modal_result";

export default function VisCheck(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_frontdesk;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [visID, setVisID] = useState();

  const initModal = { header: "", body: "" };
  const [modalText, setMtext] = useState(initModal);

  async function vischeck() {
    const res = await Axios.put(url + "/vischeck/" + visID);
    console.log(res.data);
    if (res.data.code === 200) {
      var receive = res.data.message;
      var name = receive.substring(2, receive.search(","));
      var mobile = receive.substring(receive.search(",") + 3);

      setMtext({
        header: "Visitor Info",
        body: (
          <div>
            <p>
              <strong>Registration Complete</strong>
            </p>{" "}
            <p>
              visitor name: <font className="text-success"> {name} </font>
            </p>
            <p>
              mobile: <font className="text-success"> {mobile} </font>
            </p>
          </div>
        ),
      });
      setIsOpen(true);
    }

    if (res.data.code === 201) {
      var receive = res.data.message;
      var name = receive.substring(2, receive.search(","));
      var mobile = receive.substring(
        receive.search(",m:") + 3,
        receive.search(",c:")
      );
      var campaign = receive.substring(receive.search(",c:") + 3);

      //pixel send only online regist and present, not neccessary for onsite registration

      SendPixelVis({ mob: mobile });

      setMtext({
        header: "Visitor Info",
        body: (
          <div>
            <p style={{ color: "#DC143C" }}>**Pre-Registration Visitor**</p>
            {campaign == "1" ? (
              <p className="text-center text-red-500">----Parking Card----</p>
            ) : campaign == "2" ? (
              <p className="text-center text-orange-400">----Bag Premium----</p>
            ) : (
              ""
            )}
            <p>
              <strong>Registration Complete</strong>
            </p>
            <p>
              visitor name: <font className="text-green-500"> {name} </font>
            </p>
            <p>
              mobile: <font className="text-green-500"> {mobile} </font>
            </p>
          </div>
        ),
      });
      setIsOpen(true);
    }

    if (res.data.code === 302) {
      var receive = res.data.message;
      var mon = receive.substring(0, receive.search("/"));
      var dat = receive.substring(
        receive.search("/") + 1,
        receive.indexOf("/", receive.search("/") + 1)
      );
      receive =
        dat +
        "/" +
        mon +
        "/" +
        receive.substring(receive.indexOf("/", receive.search("/") + 1) + 1);

      setMtext({
        header: <div className="text-red-700">Already received</div>,
        body: (
          <div>
            <p>Visitor has received on</p>
            <p className="text-red-500">{receive}</p>
          </div>
        ),
      });
      setIsOpen(true);
    }
    if (res.data.code === 404) {
      setMtext({
        header: <div className="text-red-700">Not found</div>,
        body: "This visitor code has not in our system",
      });
      setIsOpen(true);
    }
    if (res.data.code === 406) {
      setMtext({
        header: <div className="text-red-700">Wrong number</div>,
        body: "This visitor had registed with wrong mobile number",
      });
      setIsOpen(true);
    }

    if (res.data.code === 400) {
      setMtext({
        header: "Save error",
        body: (
          <div>
            visitor is not save to database
            <br />
            please try again
          </div>
        ),
      });
      setIsOpen(true);
    }
  }

  function closeModal() {
    setIsOpen(false);
    setVisID("");
    props.reset();
  }

  function onVisCheck() {
    vischeck();
  }

  return (
    <div className="my-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-center">
        <label for="viscode">Visitor Code</label>
        <input
          id="viscode"
          placeholder="Enter registration code"
          className="grow md:grow-0 md:w-1/2 lg:w-1/3"
          onChange={(e) => setVisID(e.target.value)}
          value={visID}
        />
        <div className="btn-primary w-1/3 md:w-1/6" onClick={onVisCheck}>
          Check
        </div>
      </div>
      <ModalResult
        show={isOpen}
        header={modalText.header}
        body={modalText.body}
        onHide={closeModal}
      />
    </div>
  );
}

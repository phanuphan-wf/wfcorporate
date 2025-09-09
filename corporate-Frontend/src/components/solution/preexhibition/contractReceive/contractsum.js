import React, { useEffect, useState, useContext } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbReplace } from "react-icons/tb";
import { dataContext } from "../contractReceive";
import useHeader from "../../../hook/useHeader";
import Axios from "axios";

import ModalDelHis from "./modalDelHis";
import ModalBoothedit from "./modalBoothedit";

export default function ContractSum(props) {
  const userLevel = JSON.parse(localStorage.getItem("user")).ALevel;

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_ctr;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  const { exhibitionC, contractDetailC, searchNameC, resetC } =
    useContext(dataContext);

  const [exhibition, setExhibition] = exhibitionC;
  const [contractDetail, setContractDetail] = contractDetailC;
  const [searchName, setSearchName] = searchNameC;
  const [reset, setReset] = resetC;

  const [data, setData] = useState([]);

  const [sumVol, setSum] = useState(0);

  const getContract = async () => {
    const res = await Axios.get(
      url + "/getContract/" + exhibition + "/" + contractDetail.CustomerID
    ).then((r) => {
      let dat = r.data;
      dat.map((d) => {
        d.cDate = convertDate(d.cDate);
      });
      setData(dat);
    });
  };

  const month = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const convertDate = (date) => {
    var yea = date.substring(0, 4);
    var mon = month.filter((m, i) => i + 1 == Number(date.substring(5, 7)));
    var dat = date.substring(8, 10);

    return dat + " " + mon + " " + yea;
  };

  const [discount, setDiscount] = useState([]);
  const getDiscount = async () => {
    let hid = [];
    data.map((d) => {
      hid.push(d.historyID);
    });
    const res = await Axios.get(url + "/getAdjPrice", {
      params: {
        Hid: hid,
      },
      paramsSerializer: {
        indexes: null,
      },
    }).then((r) => setDiscount(r.data));
  };

  useEffect(() => {
    if (exhibition != 0 && contractDetail.CustomerID != 0) {
      getContract();
    }
  }, [exhibition, contractDetail.CustomerID]);

  useEffect(() => {
    if (data.length) {
      getDiscount();
    }
  }, [data]);

  useEffect(() => {
    const sumvolume = data.reduce((a, v) => (a = a + v.volume), 0);
    setSum(sumvolume);
  }, [data]);

  const [modalDel, setModalDel] = useState(false);

  const initTxtDel = { booth: "", customer: "", hid: "" };
  const [txtDel, setTxtDel] = useState({});

  const closeModalDel = () => {
    setModalDel(false);
  };

  const delClick = (h, b) => {
    setTxtDel({ ...txtDel, hid: h, booth: b });
    setModalDel(true);
  };

  const confirmDel = async (cf) => {
    setModalDel(false);
    if (cf) {
      try {
        const res = await Axios.delete(url + "/delHistory/" + txtDel.hid).then(
          () => {
            let bdata = {
              BoothNo: txtDel.booth,
              ExhibitionID: exhibition,
            };
            const resb = Axios.put(url + "/boothAvai/true", bdata);
          }
        );
      } catch (err) {
        if (err.response.status == 400) {
          alert("Delete Data is not successful");
        }
      }
    }
    setReset(!reset);
  };

  useEffect(() => {
    setTxtDel({ ...txtDel, customer: searchName });
  }, [searchName]);

  useEffect(() => {
    getContract();
  }, [reset]);

  const [txtChange, setTxtChange] = useState({ booth: "", hid: "" });
  const [modalBoothedit, setModalBoothedit] = useState(false);

  const boothChange = (h, b) => {
    setTxtChange({ booth: b, hid: h });
    setModalBoothedit(true);
  };

  const closeModalBoothedit = () => {
    setModalBoothedit(false);
  };

  const confirmChange = (cf) => {
    if (cf) {
      getContract();
    }
    setModalBoothedit(false);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div id="contract-sum">
      <div>Total space in this exhibition</div>
      <div
        className={`border rounded-md p-3 ${
          data.length == 0 ? "h-[120px]" : ""
        }`}
      >
        {data.map((d, i) => (
          <div className="border rounded-md flex overflow-hidden mb-3 last:mb-0">
            <div className="w-8 bg-emerald-600 text-white flex items-center justify-center">
              {i + 1}
            </div>
            <div className="flex flex-wrap justify-between items-start w-full p-2 gap-y-2">
              <div>
                <h6 className="font-medium border-b">Booth No</h6>
                <div className="text-center py-2">{d.boothNo}</div>
              </div>
              <div>
                <h6 className="font-medium border-b">Spaces (Sq.m.)</h6>
                <div className="text-center py-2">{d.space}</div>
              </div>
              <div>
                <h6 className="font-medium border-b">Zone</h6>
                <div className="text-center py-2">{d.zone}</div>
              </div>
              {discount.map(
                (c, i) =>
                  c.historyID == d.historyID &&
                  c.discount == "conner" && (
                    <div>
                      <h6 className="font-medium border-b">+ Conner</h6>
                      <div className="text-center py-2">
                        {Number(c.volume)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      </div>
                    </div>
                  )
              )}
              {discount.map(
                (c, i) =>
                  c.historyID == d.historyID &&
                  c.discount == "electric" && (
                    <div>
                      <h6 className="font-medium border-b">- Electric</h6>
                      <div className="text-center py-2">
                        {Number(c.volume)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      </div>
                    </div>
                  )
              )}
              {discount.map(
                (c, i) =>
                  c.historyID == d.historyID &&
                  c.discount == "pillar" && (
                    <div>
                      <h6 className="font-medium border-b">- Pillar</h6>
                      <div className="text-center py-2">
                        {Number(c.volume)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      </div>
                    </div>
                  )
              )}
              {discount.map(
                (c, i) =>
                  c.historyID == d.historyID &&
                  c.discount == "early" && (
                    <div>
                      <h6 className="font-medium border-b">- Early</h6>
                      <div className="text-center py-2">
                        {Number(c.volume)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      </div>
                    </div>
                  )
              )}
              {discount.map(
                (c, i) =>
                  c.historyID == d.historyID &&
                  c.discount == "other" && (
                    <div>
                      <h6 className="font-medium border-b">- Other</h6>
                      <div className="text-center py-2">
                        {Number(c.volume)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      </div>
                    </div>
                  )
              )}
              {discount.map(
                (c, i) =>
                  c.historyID == d.historyID &&
                  c.discount == "otherP" && (
                    <div>
                      <h6 className="font-medium border-b">+ Other</h6>
                      <div className="text-center py-2">
                        {Number(c.volume)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      </div>
                    </div>
                  )
              )}
              <div>
                <h6 className="font-medium border-b">Amount (Baht)</h6>
                <div className="text-center py-2">
                  {Number(d.volume)
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                </div>
              </div>
              <div>
                <h6 className="font-medium border-b">Contract Date</h6>
                <div className="text-center py-2">{d.cDate}</div>
              </div>
              <div>
                <h6 className="font-medium border-b">Sign by</h6>
                <div className="text-center py-2">{d.signName}</div>
              </div>
              <div>
                <h6 className="font-medium border-b">Gridline</h6>
                <div className="text-center py-2">{d.grid}</div>
              </div>
            </div>
            <div
              className="w-10 bg-yellow-500 text-white flex items-center justify-center md:mr-0.5 text-xl"
              onClick={() => boothChange(d.historyID, d.boothNo)}
            >
              <TbReplace />
            </div>
            {userLevel == 1 && (
              <div
                className="w-8 bg-orange-600 text-white flex items-center justify-center"
                onClick={() => delClick(d.historyID, d.boothNo)}
              >
                <RiDeleteBin6Line />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="my-3">
        Total amount in this exhibition{" "}
        <span className="text-green-600">
          {Number(sumVol)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
        </span>{" "}
        Baht
      </div>
      <ModalDelHis
        show={modalDel}
        onHide={closeModalDel}
        txtDel={txtDel}
        confirmDel={confirmDel}
      />
      <ModalBoothedit
        show={modalBoothedit}
        onHide={closeModalBoothedit}
        txtChange={txtChange}
        confirm={confirmChange}
      />
    </div>
  );
}

import React, { useState, useEffect } from "react";

export default function ModalComm(props) {
  const [mdata, setMData] = useState({});

  const initData = { newcomm: 0, salecomm: 0, account: "" };

  const [newd, setNew] = useState(initData);

  const [change, setChange] = useState(false);

  useEffect(() => {
    let pd = props.dat;
    if (pd.length) {
      setMData(pd[0]);
      setNew({
        newcomm: pd[0].newcomm,
        salecomm: pd[0].salecomm,
        account: pd[0].account,
      });
      setChange(false);
    }
  }, [props.dat]);

  function commChange() {
    let comm = document.getElementById("txt-comm").value;
    if (!parseFloat(comm) && comm !== "") {
      alert("Please insert data in number format only");
      return;
    }

    if (comm !== "") {
      if (mdata.newcus) {
        setNew({ ...newd, newcomm: parseFloat(comm) });
      } else {
        setNew({ ...newd, salecomm: parseFloat(comm) });
      }
    } else {
      setNew({ ...newd, newcomm: mdata.newcomm, salecomm: mdata.salecomm });
    }
  }

  function confirmClick() {
    props.confirm(newd);
  }

  useEffect(() => {
    if (mdata.account !== newd.account) {
      setChange(true);
    } else {
      setChange(false);
    }
  }, [newd.account]);

  return (
    <div
      id="staticModal"
      data-modal-backdrop="static"
      tabIndex="-1"
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-600 bg-opacity-50 ${
        props.show ? "" : "hidden"
      }`}
    >
      <div className="relative w-full max-w-3xl md:max-w-xl lg:max-w-3xl max-h-full top-[100px] left-1/2 -translate-x-1/2">
        {/*-- Modal content --*/}
        <div className="relative bg-white rounded-lg shadow">
          {/*-- Modal header --*/}
          <div className="p-4 border-b rounded-t">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Change Commission Data
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-hide="staticModal"
                onClick={props.close}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div id="comm-modal-boby">
              <div className={"my-2"}>
                <div>
                  You will changing commission data of{" "}
                  {mdata.name + " for " + mdata.exID}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <label column xs={3}>
                    Commission
                  </label>
                  <div xs={6}>
                    <input
                      placeholder="percent commission"
                      id="txt-comm"
                      onChange={commChange}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label column xs={3}>
                    Account Type
                  </label>
                  <div xs={6}>
                    <select
                      className="cmb"
                      id="account"
                      value={newd.account}
                      onChange={(e) =>
                        setNew({ ...newd, account: e.target.value })
                      }
                    >
                      <option value="0">select account</option>
                      <option value="C">บริษัท</option>
                      <option value="T">บริษัท(ไม่หักTAX)</option>
                      <option value="P">ส่วนตัว</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b justify-between">
            <button
              data-modal-hide="staticModal"
              type="button"
              className="btn-gray"
              onClick={props.close}
            >
              Cancel
            </button>
            <button
              data-modal-hide="staticModal"
              type="button"
              className="btn-primary"
              onClick={confirmClick}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

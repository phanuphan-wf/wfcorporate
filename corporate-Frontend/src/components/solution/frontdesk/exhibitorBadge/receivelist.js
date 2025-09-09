import React, { useEffect, useState } from "react";

import useCheckMobile from "../../../hook/useCheckMobile";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function ReceiveList(props) {
  const initName = { name: "", surname: "", pid: "", mobile: "", receive: 1 };
  const [rlist, setRlist] = useState([]);

  const [rName, setRName] = useState(initName);

  const addName = () => {
    if (rName.name == "" && rName.mobile == "") {
      alert("Please insert receiver data before added");
      return;
    }
    if (added) {
      setRlist([...rlist, rName]);
    } else {
      setRlist([rName]);
    }
    setRName(initName);
    setAdded(true);
    setMob(true);
  };

  const deleteName = (id) => {
    setRlist((l) => l.filter((l, i) => i != id));
  };

  const [pidCheck, setPid] = useState(false);

  const pidChange = (pid) => {
    if (pid.match(/^\d{1}[-]\d{4}[-]\d{5}[-]\d{2}[-]\d{1}$/)) {
      setPid(true);
    } else {
      setPid(false);
    }
    setRName({ ...rName, pid: pid });
  };

  const [mobCheck, setMob] = useState(true);

  const mobChange = (mob) => {
    if (mob.match(/^[0]\d{9}$/) || mob == "") {
      setMob(true);
    } else {
      setMob(false);
    }
    setRName({ ...rName, mobile: mob });
  };

  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (rlist.length > 0) {
      if (rName.name != "" || rName.mobile != "") {
        setCanPrint(false);
      } else {
        setCanPrint(true);
      }
    }

    if (!added) {
      if (rName.name != "" || rName.mobile != "") {
        setRlist([rName]);
        setCanPrint(true);
      } else {
        setRlist([]);
        setCanPrint(false);
      }
    }
  }, [rName]);

  useEffect(() => {
    props.data(rlist);
    if (!rlist.length) {
      setAdded(false);
      setCanPrint(false);
    }
  }, [rlist]);

  const [canPrint, setCanPrint] = useState(false);

  useEffect(() => {
    props.btn(canPrint);
  }, [canPrint]);

  useEffect(() => {
    if (props.ready) {
      setRlist([]);
      setRName(initName);
    }
  }, [props.save]);

  useEffect(() => {
    let d = props.regData;
    if (d && Object.keys(d).length != 0) {
      if (rlist.length == 0) {
        setRlist([
          ...rlist,
          {
            name: d.name,
            surname: d.surname,
            pid: d.pid,
            mobile: d.mobile,
            receive: d.recNum,
          },
        ]);
      }
      setAdded(true);
      setCanPrint(true);
    }
  }, [props.regData]);

  return (
    <div>
      {added && (
        <div className="mt-3 border-b">
          <table className="w-full">
            <thead>
              <tr>
                <td className="w-1/6">Name:</td>
                <td className="w-1/6">Surname:</td>
                <td className="w-1/5">Id Card:</td>
                <td className="w-1/6">Mobile:</td>
                <td className="w-1/6">Request:</td>
                <td className="w-1/12"></td>
              </tr>
            </thead>
            <tbody>
              {rlist.map((l, i) => (
                <tr>
                  <td>{l.name}</td>
                  <td>{l.surname}</td>
                  <td>{l.pid}</td>
                  <td>{l.mobile}</td>
                  <td>{l.receive}</td>
                  <td>
                    <div
                      className="hover:text-red-500 w-fit"
                      onClick={() => deleteName(i)}>
                      <RiDeleteBin6Line />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 flex gap-2 items-start flex-auto w-full max-sm:flex-wrap">
        <div className="w-1/2 lg:w-1/4">
          <label htmlFor="fname" className="block">
            Name:
          </label>
          <input
            id="fname"
            className="w-full"
            onChange={(e) => setRName({ ...rName, name: e.target.value })}
            value={rName.name}
          />
        </div>
        <div className="w-1/2 lg:w-1/4">
          <label htmlFor="fsurname" className="block">
            Surname:
          </label>
          <input
            id="fsurname"
            className="w-full"
            onChange={(e) => setRName({ ...rName, surname: e.target.value })}
            value={rName.surname}
          />
        </div>
        <div className="w-full md:w-2/3 lg:w-1/2">
          <label htmlFor="pid" className="block">
            Id card:
          </label>
          <input
            id="pid"
            className="w-full"
            onChange={(e) => pidChange(e.target.value)}
            value={rName.pid}
          />
          <span className={`${pidCheck ? "hidden" : ""} text-red-500`}>
            format: x-xxxx-xxxxx-xx-x
          </span>
        </div>
      </div>
      <div className="mt-3 flex gap-2 items-start flex-auto max-sm:flex-wrap">
        <div className="w-1/2 sm:w-1/3 md:w-1/2 lg:w-1/4">
          <label htmlFor="mobile" className="block">
            Mobile:
          </label>
          <input
            id="mobile"
            className="w-full"
            onChange={(e) => mobChange(e.target.value)}
            value={rName.mobile}
          />
          <span className={`${mobCheck ? "hidden" : ""} text-red-500`}>
            Mobile not correct format
          </span>
        </div>
        <div className="w-1/3 lg:w-1/6">
          <label htmlFor="receive" className="block">
            Request:
          </label>
          <input
            id="receive"
            type="number"
            className="w-full"
            onChange={(e) => setRName({ ...rName, receive: e.target.value })}
            value={rName.receive}
          />
        </div>
        <div
          className="btn-primary px-6 md:px-4 h-fit bg-green-600 border-green-600 hover:bg-white hover:border-green-600 hover:text-green-600 sm:mt-6"
          onClick={addName}>
          Add
        </div>
      </div>
    </div>
  );
}

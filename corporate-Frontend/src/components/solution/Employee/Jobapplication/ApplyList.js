import React, { useState, useEffect } from "react";
import axios from "axios";

import ModalApply from "./ModalList";

import { MdFiberNew } from "react-icons/md";
import { FaFolderOpen } from "react-icons/fa6";

export default function ApplyList(props) {
  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_job;

  const [applyList, setApplyList] = useState([]);
  
  
  const [modalFillShow, setModalFillShow] = useState({
    show: false,
    module: "",
    watch: "",
  });


  const closeFillModal = () => {
    setModalFillShow({ show: false, module: "" });
  };

  const getApplyList = async () => {
    try {
      const res = await axios.get(url + "/getapplylist");
      if (res.status === 200) {
        setApplyList(res.data);
      }
    } catch (err) {
      console.error("getApplyList error:", err);
    }
  };

  useEffect(() => {
    getApplyList();
  }, [props.reload]);

  return (
    <section className="ApplyList p-4">
      <div className="text-xl md:text-3xl font-medium mb-4">Job Applications</div>

      <div className="visitor-search border-t">
        <div className="my-3 w-full overflow-x-auto">
          <table className="w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-slate-300">
                <th className="border p-2">id</th>
                <th className="border p-2">name</th>
                <th className="border p-2">surname</th>
                <th className="border p-2">mobile</th>
                <th className="border p-2">jobName</th>
                <th className="border p-2">applyDate</th>
                <th className="border p-2">watch</th>
              </tr>
            </thead>

            <tbody>
              {applyList.map((app, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="border p-2 text-center">{app.id}</td>
                  <td className="border p-2 text-center">{app.name}</td>
                  <td className="border p-2 text-center">{app.surname}</td>
                  <td className="border p-2 text-center">{app.mobile}</td>
                  <td className="border p-2 text-center">{app.jobName}</td>
                  <td className="border p-2 text-center">
                    {new Date(app.applyDate).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <div
                      className="flex items-center justify-center gap-2 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => {
                        setModalFillShow({
                          show: true,
                          module: app.id,
                          watch: app.watch,
                        });
                      }}

                    >
                      {!app.watch && (
                        <MdFiberNew size={30} className="text-red-500" />
                      )}

                      {app.watch && (
                        <span className="flex items-center gap-1 text-sm font-medium text-blue-600">
                          <FaFolderOpen className="text-xl text-yellow-500" />
                          {new Date(app.watch).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            
          </table>


         {modalFillShow.show && (
          <ModalApply
            show={modalFillShow.show}
            id={modalFillShow.module}
            watch={modalFillShow.watch}           
            onClose={closeFillModal}
            onReload={getApplyList}
          />
        )}

              

        </div>
      </div>
    </section>
  );
}
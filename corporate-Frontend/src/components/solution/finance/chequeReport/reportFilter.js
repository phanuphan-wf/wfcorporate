import React, { useState, useContext, useEffect } from "react";
import { dataContext } from "./report";
import Axios from "axios";

import { CgMoreO } from "react-icons/cg";
import ModalSeach from "./modalSearch";

function ReportFilter() {
  const { filterC } = useContext(dataContext);
  const [filterOpen, setFilterOpen] = useState(false);
  const [exhibition, setExhibition] = useState([]);
  const [sales, setSales] = useState([]);
  const [customer, setCustomer] = useState("");
  const [bank, setBank] = useState([]);

  const [pastEx, setPastEx] = useState(false);
  const [filter, setFilter] = filterC;

  const [isSearch, setIsSearch] = useState(false);

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_cr;

  const getExhibition = async () => {
    const res = await Axios.get(url + "/getExhibition/" + pastEx);
    setExhibition(res.data);
  };

  const getSales = async () => {
    const res = await Axios.get(url + "/getSales");
    setSales(res.data);
  };

  const getBank = async () => {
    const res = await Axios.get(url + "/getBank");
    setBank(res.data);
  };

  useEffect(() => {
    getExhibition();
    getSales();
    getBank();
  }, [pastEx]);

  const closeSearch = () => {
    setIsSearch(false);
  };

  const customerClick = async (id) => {
    const data = { cid: id, exid: filter.exID };
    const res = await Axios.post(url + "/getCustomerData", data).then((r) => {
      if (r.status === 200) {
        setCustomer(
          (r.data[0].prefix ? r.data[0].prefix + " " : "") +
            r.data[0].name.trim() +
            (r.data[0].subfix ? " " + r.data[0].subfix : "")
        );
        setFilter({ ...filter, customer: id });
      }
    });
    setIsSearch(false);
  };

  useEffect(() => {
    if (customer == "") {
      setFilter({ ...filter, customer: "0" });
    }
  }, [customer]);

  useEffect(() => {
    //console.log(bank);
  }, [bank]);

  return (
    <div id="reportFilter">
      <div className="mt-n4 mt-md-0">
        <div>
          <button
            className={`rounded-md py-0.5 text-white px-1 ${
              !filterOpen ? "bg-green-600 px-2" : "bg-red-500"
            }`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {!filterOpen ? (
              <div className="flex items-center gap-2">
                <CgMoreO /> Filter
              </div>
            ) : (
              <div>Close panel</div>
            )}
          </button>
        </div>
      </div>
      <div
        id="collapse"
        className={`${
          !filterOpen ? "h-0 py-0" : "border py-3"
        } transition-all duration-300 ease-in-out w-full overflow-hidden px-3  border-gray-300 rounded-md  my-3`}
      >
        <div>
          <div className="mb-3">
            <div className="sm:flex items-center gap-2">
              <label>Exhibition</label>
              <div>
                <select
                  className="cmb min-w-fit"
                  id="exhibition"
                  onChange={(e) =>
                    setFilter({ ...filter, exID: e.target.value })
                  }
                  value={filter.exID}
                >
                  <option value="0">All exhibition</option>
                  {exhibition.length > 0 &&
                    exhibition.map((e) => (
                      <option value={e.code}>
                        {e.name + " (" + e.code + ")"}
                      </option>
                    ))}
                </select>
              </div>
              <div className="sm:flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chb-pastEx"
                  onChange={() => setPastEx(!pastEx)}
                  className="size-4 accent-red-500 mr-3"
                />
                <label for="chb-pastEx">Past Exhibition</label>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="sm:flex items-center gap-2">
              <label column xs={3} md={2}>
                Sales Name
              </label>
              <div>
                <select
                  className="cmb w-[300px]"
                  id="sales"
                  onChange={(e) =>
                    setFilter({ ...filter, sales: e.target.value })
                  }
                  value={filter.sales}
                >
                  <option value="0">All sales</option>
                  {sales.length > 0 &&
                    sales.map((s) => <option value={s.eid}>{s.name}</option>)}
                </select>
              </div>

              <div className="sm:flex items-center gap-2">
                <label className="block">Customer Name</label>
                <input
                  type="text"
                  id="txt-customer"
                  onChange={(e) => setCustomer(e.target.value)}
                  value={customer}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsSearch(true);
                    }
                  }}
                  className="w-[300px]"
                />
              </div>
            </div>
          </div>
          <div className="md:flex items-center gap-2">
            <div className="sm:flex items-center gap-2">
              <label className="block">Bank</label>
              <div>
                <select
                  className="cmb w-[300px]"
                  id="sales"
                  onChange={(e) =>
                    setFilter({ ...filter, bank: e.target.value })
                  }
                  value={filter.bank}
                >
                  <option value="0">All bank</option>
                  {bank.length > 0 &&
                    bank.map((s) => <option value={s.bid}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="sm:flex items-center gap-2">
              <label className="block">Account</label>
              <div>
                <select
                  className="cmb w-[300px]"
                  id="sales"
                  onChange={(e) =>
                    setFilter({ ...filter, account: e.target.value })
                  }
                  value={filter.account}
                >
                  <option value="0">All account</option>
                  {[
                    { aid: "c", name: "Company" },
                    { aid: "p", name: "Personal" },
                    { aid: "w", name: "Wait" },
                  ].map((s) => (
                    <option value={s.aid}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalSeach
        show={isSearch}
        onHide={closeSearch}
        exid={filter.exID}
        search={customer}
        fill={customerClick}
      />
    </div>
  );
}

export default ReportFilter;

import React, { createContext, useState, useRef, useEffect } from "react";
import Axios from "axios";
import useHeader from "../../../hook/useHeader";

import { FaCalendarAlt } from "react-icons/fa";

export const dataContext = createContext();

function PrintCheque(props) {

  const url = process.env.REACT_APP_API_URI + process.env.REACT_APP_pch;
  const bearer = useHeader();

  Axios.defaults.headers.common = {
    Authorization: "Bearer " + bearer,
  };

  // --- Demo Data ---
  const [banks, setbanks] = useState([]);


  const [bankData, setBankData] = useState({
    bankID: "",
    fullName: "",
    code: "",
  });

  const [selectedBank, setSelectedBank] = useState([]);

  const [accounts] = useState([
    "World Fair Co., Ltd. 100-1-xxxxx-x",
    "World Fair Co., Ltd. 200-2-yyyyy-y"
  ]);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

  const [bookNo, setBookNo] = useState("849");

  // Cheque list on the left
  const [chequeList] = useState([
    { no: "45935581", payee: "Revenue Department" },
    { no: "45935582", payee: "" },
    { no: "45935583", payee: "" },
    { no: "45935584", payee: "" },
    { no: "45935585", payee: "" },
    { no: "45935586", payee: "" },
    { no: "45935587", payee: "" },
    { no: "45935588", payee: "" },
    { no: "45935589", payee: "" },
    { no: "45935590", payee: "" },
    { no: "45935591", payee: "" },
    { no: "45935592", payee: "" },
    { no: "45935593", payee: "Cash" },
    { no: "45935594", payee: "Cash" },
    { no: "45935595", payee: "Cash" },
    { no: "45935596", payee: "Cash" },
    { no: "45935597", payee: "Mrs. Kanda Mongkolsamrit" },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentCheque = chequeList[selectedIndex];

  // Form states & Date Picker Ref
  const dateInputRef = useRef(null);
  const [isAcPayee, setIsAcPayee] = useState(false);
  const [chequeDate, setChequeDate] = useState("2026-11-15");
  const [payeeName, setPayeeName] = useState(currentCheque.payee);
  const [isCrossHolder, setIsCrossHolder] = useState(true);
  const [amountNum, setAmountNum] = useState("15,000.00");
  const [amountText, setAmountText] = useState("(* Fifteen Thousand Baht Only *)");
  const [memo, setMemo] = useState("Exhibition operating expenses");

  const handleSelectCheque = (index) => {
    setSelectedIndex(index);
    setPayeeName(chequeList[index].payee);
  };

  const getBank = async () => {
    try {
      const res = await Axios.get(url + "/banks");
      setbanks(res.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  }

  const handleSelectBank = (e) => {
    const selectedCode = e.target.value;    
    const foundBank = banks.find((item) => item.code === selectedCode);
    if (foundBank) {
      setBankData({
        bankID: foundBank.bankID,
        fullName: foundBank.fullName,
        code: foundBank.code,
      });
    } else {     
      setBankData({
        bankID: "",
        fullName: "",
        code: "",
      });
    }
  };

  const handleOpenCalendar = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === "function") {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };





  useEffect(() => {
    getBank();
    //console.log(banks);
  }, []);


  // useEffect(() => {    
  //   console.log("1. ค่า bearer:", bearer); 
  // }, [bearer]);


  useEffect(() => {
    console.log("ข้อมูล bankData ล่าสุด:", bankData);
  }, [bankData]); // จะทำงานทุกครั้งที่ค่าใน bankData เปลี่ยนแปลง


  return (

    <dataContext.Provider
      value={{
        bankDataC: [selectedBank, setSelectedBank],
      }}
    >
      <section id="printCheque" className="p-4 bg-gray-100 min-h-screen text-sm text-gray-800">
        <div className="max-w-full mx-auto bg-white border border-gray-300 shadow-md p-4 rounded">


          <div className="flex flex-row items-center gap-4 border-b pb-4 mb-4">
            {/* ฝั่งซ้าย: โลโก้ และ ชื่อหน้า Print Check (สัดส่วน 1/3) */}
            <div className="basis-1/3">
              <div className="flex flex-row items-center">
                <div className="basis-1/2 flex justify-start">
                  <img
                    src="/android-chrome-192x192.png"
                    alt="World Fair Logo"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="basis-1/2">
                  <div className="text-lg font-semibold text-red-700 border-l pl-4">
                    Print Check
                  </div>
                </div>
              </div>
            </div>

            {/* ฝั่งขวา: เลือกธนาคาร ชิดซ้าย (สัดส่วน 2/3) */}
            <div className="basis-2/3 flex items-center justify-start gap-2">
              <label className="font-medium">Bank : </label>
              <select
                value={bankData.code}
                onChange={handleSelectBank}
                className="border border-gray-300 rounded px-2 py-1 bg-white w-100 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="">-- เลือกธนาคาร --</option>
                {banks.map((item, i) => (
                  <option key={item.bankID || i} value={item.code}>
                    {item.fullName}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* แถวบน: Account, Book No และ ปุ่มจัดการ (ปรับระยะห่าง mb-4 ให้พอดีสวยงาม) */}
          <div className="flex flex-row gap-4 items-end">

            {/* ฝั่งซ้าย: Account และ Book No. (สัดส่วน 1/3) */}
            <div className="basis-1/3">
              <div className="flex flex-row gap-2">
                {/* Account (สัดส่วน 2/3 ของฝั่งซ้าย) */}
                <div className="basis-2/3">
                  <label htmlFor="account-select" className="block mb-1 text-base font-medium text-gray-700">
                    Account
                  </label>
                  <select
                    id="account-select"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-800 text-sm rounded px-2 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm"
                  >
                    {accounts.map((acc, i) => (
                      <option key={i} value={acc}>{acc}</option>
                    ))}
                  </select>
                </div>

                {/* Book No. (สัดส่วน 1/3 ของฝั่งซ้าย) */}
                <div className="basis-1/3">
                  <label htmlFor="book-no" className="block mb-1 text-base font-medium text-gray-700">
                    Book No.
                  </label>
                  <input
                    id="book-no"
                    type="text"
                    value={bookNo}
                    onChange={(e) => setBookNo(e.target.value)}
                    className="bg-blue-50 border border-gray-300 text-blue-800 font-semibold text-sm rounded px-3 py-2 text-center focus:ring-blue-500 focus:border-blue-500 block w-full max-w-[185px] shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* ฝั่งขวา: ปุ่ม Add New Book และ Manage Accounts (สัดส่วน 2/3) */}
            <div className="basis-2/3 flex items-center justify-between pb-0.5">
              <button className="border border-gray-400 px-3 py-2 mt-5 bg-white hover:bg-gray-100 rounded text-xs shadow-sm">
                Add New Book &gt;&gt;
              </button>
              <button className="border border-gray-400 px-3 py-2 mt-5 bg-white hover:bg-gray-100 rounded text-xs shadow-sm">
                Manage Accounts
              </button>
            </div>

          </div>

          {/* Main Content: Split Left-Right (Cheque List & Form) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">

            {/* Left Table: Cheque List */}
            <div className="md:col-span-4 border border-gray-300 rounded flex flex-col h-[400px]">
              <div className="bg-gray-200 grid grid-cols-2 p-2 font-semibold border-b border-gray-300 text-xs">
                <span>Cheque No.</span>
                <span>Payee</span>
              </div>
              <div className="overflow-y-auto flex-1 bg-white">
                {chequeList.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectCheque(index)}
                    className={`grid grid-cols-2 p-1.5 cursor-pointer text-xs border-b border-gray-100 ${selectedIndex === index ? "bg-blue-600 text-white" : "hover:bg-gray-50"
                      }`}
                  >
                    <span>{item.no}</span>
                    <span className="truncate">{item.payee}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Form: Cheque Details */}
            <div className="md:col-span-8 border border-gray-300 rounded p-4 bg-gray-50/50 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="font-semibold text-gray-700 border-b pb-1">Cheque Details</div>

                {/* Top row: A/C Payee and Date (พร้อมระบบคลิกปฏิทินเลือกวันที่) */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAcPayee}
                      onChange={(e) => setIsAcPayee(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span>A/C Payee Only</span>
                  </label>

                  <div className="flex items-center gap-2 relative">
                    <input
                      type="text"
                      value={chequeDate}
                      onChange={(e) => setChequeDate(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-36 text-right bg-white"
                    />

                    {/* ซ่อน input type="date" ไว้สั่งเปิดปฏิทิน */}
                    <input
                      type="date"
                      ref={dateInputRef}
                      value={chequeDate}
                      onChange={(e) => setChequeDate(e.target.value)}
                      className="absolute opacity-0 pointer-events-none w-0 h-0"
                    />

                    {/* ปุ่มไอคอนปฏิทิน กดแล้วเด้งหน้าต่างเลือกวันที่ */}
                    <span
                      onClick={handleOpenCalendar}
                      className="border border-gray-300 bg-gray-100 px-2 py-2 rounded cursor-pointer flex items-center justify-center text-gray-600 hover:bg-gray-200"
                      title="Select Date"
                    >
                      <FaCalendarAlt />
                    </span>
                  </div>
                </div>

                {/* Payee */}
                <div className="flex items-center gap-2">
                  <label className="w-20 font-medium">Payee</label>
                  <input
                    type="text"
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 flex-1 bg-white"
                  />
                  <button className="border border-gray-400 px-3 py-1 bg-white hover:bg-gray-100 rounded text-xs">
                    Search
                  </button>
                </div>

                {/* Cross Holder */}
                <div className="flex justify-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCrossHolder}
                      onChange={(e) => setIsCrossHolder(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span>A/C Payee &amp; Order</span>
                  </label>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-2">
                  <label className="w-20 font-medium">Amount</label>
                  <input
                    type="text"
                    value={amountNum}
                    onChange={(e) => setAmountNum(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-44 bg-white font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-20 font-medium text-transparent">Amount</label>
                  <input
                    type="text"
                    value={amountText}
                    onChange={(e) => setAmountText(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 flex-1 bg-white text-gray-600"
                  />
                </div>

                {/* Memo */}
                <div className="flex items-center gap-2">
                  <label className="w-20 font-medium">Memo</label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 flex-1 bg-white"
                  />
                  <button className="border border-gray-400 px-3 py-1 bg-white hover:bg-gray-100 rounded text-xs">
                    Add Memo...
                  </button>
                </div>
              </div>

              {/* Bottom Actions (ปุ่ม Print Report สีเขียว) */}
              <div className="flex items-center justify-between pt-6 border-t mt-6">
                <button className="border border-green-600 px-4 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded shadow-sm font-medium">
                  Print Report
                </button>
                <div className="flex gap-2">
                  <button className="border border-gray-400 px-4 py-1.5 bg-white hover:bg-gray-100 rounded shadow-sm">
                    Preview
                  </button>
                  <button className="border border-blue-600 px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded shadow-sm font-medium">
                    Print Check
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </dataContext.Provider>
  );
}

export default PrintCheque;
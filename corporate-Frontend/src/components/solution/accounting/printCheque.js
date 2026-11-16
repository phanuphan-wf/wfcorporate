import React, { useState } from "react";

export default function PrintCheque() {
  // --- ข้อมูลจำลอง (Demo Data) ---
  const [banks] = useState(["กสิกรไทย", "ไทยพาณิชย์", "กรุงเทพ", "กรุงไทย"]);
  const [selectedBank, setSelectedBank] = useState("กสิกรไทย");
  
  const [accounts] = useState([
    "บริษัท เวิลด์ แฟร์ จำกัด 100-1-xxxxx-x",
    "บริษัท เวิลด์ แฟร์ จำกัด 200-2-yyyyy-y"
  ]);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  
  const [bookNo, setBookNo] = useState("849");

  // รายการเช็คฝั่งซ้าย
  const [chequeList] = useState([
    { no: "45935581", payee: "กรมสรรพากร" },
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
    { no: "45935593", payee: "เงินสด" },
    { no: "45935594", payee: "เงินสด" },
    { no: "45935595", payee: "เงินสด" },
    { no: "45935596", payee: "เงินสด" },
    { no: "45935597", payee: "นางกานดา มงคลสัมฤทธิ์" },
  ]);

  // เลือกรายการเช็คมาแสดงในฟอร์มขวา (เริ่มต้นเลือกใบแรก)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentCheque = chequeList[selectedIndex];

  // State สำหรับฟอร์มกรอกข้อมูล
  const [isAcPayee, setIsAcPayee] = useState(false);
  const [chequeDate, setChequeDate] = useState("15 พฤศจิกายน 2569");
  const [payeeName, setPayeeName] = useState(currentCheque.payee);
  const [isCrossHolder, setIsCrossHolder] = useState(true);
  const [amountNum, setAmountNum] = useState("15,000.00");
  const [amountText, setAmountText] = useState("(* หนึ่งหมื่นห้าพันบาทถ้วน *)");
  const [memo, setMemo] = useState("ค่าใช้จ่ายในการจัดงานแสดงสินค้า");

  // เมื่อคลิกเปลี่ยนแถวในตาราง
  const handleSelectCheque = (index) => {
    setSelectedIndex(index);
    setPayeeName(chequeList[index].payee);
  };

  return (
    <section id="printCheque" className="p-4 bg-gray-100 min-h-screen text-sm text-gray-800">
      <div className="max-w-6xl mx-auto bg-white border border-gray-300 shadow-md p-4 rounded">
        
        {/* ส่วนหัว: โลโก้ และ เมนูเลือกธนาคาร */}
        <div className="flex flex-wrap items-center justify-between border-b pb-4 mb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="text-red-600 font-bold italic text-lg leading-tight">
              <span className="text-2xl">W</span>orld <span className="text-2xl">F</span>air<br />
              <span className="text-xs font-normal text-gray-500">World Fair</span>
            </div>
            <div className="text-lg font-semibold text-red-700 border-l pl-4">
              พิมพ์เช็ค
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium">ธนาคาร</label>
            <select 
              value={selectedBank} 
              onChange={(e) => setSelectedBank(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 bg-white w-44"
            >
              {banks.map((b, i) => (
                <option key={i} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* แถวเลือกบัญชี และ เล่มที่ */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="font-medium">บัญชี</label>
            <select 
              value={selectedAccount} 
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 bg-white w-72"
            >
              {accounts.map((acc, i) => (
                <option key={i} value={acc}>{acc}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium">เล่มที่</label>
            <input 
              type="text" 
              value={bookNo} 
              onChange={(e) => setBookNo(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-20 text-center bg-blue-50 text-blue-800 font-semibold"
            />
          </div>

          <button className="border border-gray-400 px-3 py-1 bg-gray-50 hover:bg-gray-100 rounded text-xs">
            เพิ่มเล่มใหม่ &gt;&gt;
          </button>

          <div className="ml-auto">
            <button className="border border-gray-400 px-3 py-1 bg-gray-50 hover:bg-gray-100 rounded text-xs">
              จัดการบัญชี
            </button>
          </div>
        </div>

        {/* ส่วนเนื้อหาหลัก แบ่งซ้าย-ขวา */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* ตารางฝั่งซ้าย (รายการเช็ค) */}
          <div className="md:col-span-4 border border-gray-300 rounded flex flex-col h-[400px]">
            <div className="bg-gray-200 grid grid-cols-2 p-2 font-semibold border-b border-gray-300 text-xs">
              <span>เช็คเลขที่</span>
              <span>สั่งจ่าย</span>
            </div>
            <div className="overflow-y-auto flex-1 bg-white">
              {chequeList.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => handleSelectCheque(index)}
                  className={`grid grid-cols-2 p-1.5 cursor-pointer text-xs border-b border-gray-100 ${
                    selectedIndex === index ? "bg-blue-600 text-white" : "hover:bg-gray-50"
                  }`}
                >
                  <span>{item.no}</span>
                  <span className="truncate">{item.payee}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ฟอร์มฝั่งขวา (รายละเอียดเช็ค) */}
          <div className="md:col-span-8 border border-gray-300 rounded p-4 bg-gray-50/50 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="font-semibold text-gray-700 border-b pb-1">รายละเอียดเช็ค</div>

              {/* บรรทัดบน: A/C Payee และ วันที่ */}
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

                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={chequeDate} 
                    onChange={(e) => setChequeDate(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-36 text-right bg-white" 
                  />
                  <span className="border border-gray-300 bg-gray-100 px-2 py-1 rounded cursor-pointer">📅</span>
                </div>
              </div>

              {/* สั่งจ่าย */}
              <div className="flex items-center gap-2">
                <label className="w-20 font-medium">สั่งจ่าย</label>
                <input 
                  type="text" 
                  value={payeeName} 
                  onChange={(e) => setPayeeName(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 flex-1 bg-white"
                />
                <button className="border border-gray-400 px-3 py-1 bg-white hover:bg-gray-100 rounded text-xs">
                  ค้นหา
                </button>
              </div>

              {/* ขีดคร่อมผู้ถือ */}
              <div className="flex justify-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isCrossHolder} 
                    onChange={(e) => setIsCrossHolder(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>ขีดคร่อมผู้ถือ</span>
                </label>
              </div>

              {/* จำนวนเงิน */}
              <div className="flex items-center gap-2">
                <label className="w-20 font-medium">จำนวนเงิน</label>
                <input 
                  type="text" 
                  value={amountNum} 
                  onChange={(e) => setAmountNum(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-44 bg-white font-semibold"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="w-20 font-medium text-transparent">จำนวนเงิน</label>
                <input 
                  type="text" 
                  value={amountText} 
                  onChange={(e) => setAmountText(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 flex-1 bg-white text-gray-600"
                />
              </div>

              {/* บันทึกการจ่าย */}
              <div className="flex items-center gap-2">
                <label className="w-20 font-medium">บันทึกการจ่าย</label>
                <input 
                  type="text" 
                  value={memo} 
                  onChange={(e) => setMemo(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 flex-1 bg-white"
                />
                <button className="border border-gray-400 px-3 py-1 bg-white hover:bg-gray-100 rounded text-xs">
                  เพิ่มบันทึก...
                </button>
              </div>
            </div>

            {/* ปุ่มกระทำด้านล่างขวา */}
            <div className="flex items-center justify-between pt-6 border-t mt-6">
              <button className="border border-gray-400 px-4 py-1.5 bg-white hover:bg-gray-100 rounded shadow-sm">
                พิมพ์รายงาน
              </button>
              <div className="flex gap-2">
                <button className="border border-gray-400 px-4 py-1.5 bg-white hover:bg-gray-100 rounded shadow-sm">
                  ตัวอย่างก่อนพิมพ์
                </button>
                <button className="border border-blue-600 px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded shadow-sm font-medium">
                  พิมพ์เช็ค
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
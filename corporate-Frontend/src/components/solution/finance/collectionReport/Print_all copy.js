import { useContext, useMemo ,useEffect} from "react";
import { dataContext } from "./report";
import { pdf, Document, Page, Text, View, StyleSheet, Font ,Image} from "@react-pdf/renderer";
// import { Table, TH, TR, TD } from "@ag-media/react-pdf-table";

import PrintButton from "./PrintButton"; 

function PrintReport() {
  const { reportC,eventC,filterC } = useContext(dataContext);
  const [reportlist] = reportC; 
  const [event] = eventC;
  const [filter] = filterC;
  
  //console.log("filter 👉", filter);
  //console.log("reportlist 👉", reportlist);
 

    const normalizedList = useMemo(() => {
    const list = Array.isArray(reportlist) ? reportlist : [];
   // console.log("🔹 raw reportlist 👉", list);
   // console.log("🔹 filter 👉", filter);

    if (list.length === 0) return [];

    // ✅ สร้าง Sales Group แบบ Dynamic จาก reportlist
    const uniqueSales = [...new Set(list.map((r) => r.sales).filter(Boolean))];
    const salesGroupMap = uniqueSales.reduce((acc, name) => {
      acc[name] = [name]; // ให้แต่ละ Sales เป็น group ของตัวเอง
      return acc;
    }, {});
    //console.log("🧩 Dynamic salesGroupMap 👉", salesGroupMap);

    // เริ่มกรองข้อมูล
    let filtered = list;   
    
     //  กรอง exID
    if (filter.exID && filter.exID !== "0") {
      filtered = filtered.filter((r) => r.exid === filter.exID);
    }

    // กรอง Sales — รองรับทั้งชื่อรายบุคคล และกลุ่ม (จาก filter.sales)
    if (filter.sales && filter.sales !== "0") {
      const selectedSales =
        salesGroupMap[filter.sales] || [filter.sales];
      filtered = filtered.filter((r) =>
        selectedSales.some(
          (s) => r.sales?.trim()?.toLowerCase() === s.trim().toLowerCase()
        )
      );
    }

    //  กรอง Zone
    if (filter.zone && filter.zone !== "0") {
      filtered = filtered.filter(
        (r) => r.zone?.toLowerCase() === filter.zone.toLowerCase()
      );
    }   

    //  กรองชื่อลูกค้า
    if (filter.customername && filter.customername !== "0") {
      filtered = filtered.filter(
        (r) =>
          r.name?.trim()?.toLowerCase() ===
          filter.customername.trim()?.toLowerCase()
      );
    }

    //console.log("✅ filtered 👉", filtered);

    // 🧮 คำนวณยอดรวมและ balance ตามบริษัท
    const seen = new Map();
    const balanceMap = new Map();

    filtered.forEach((row) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      balanceMap.set(
        company,
        (balanceMap.get(company) || 0) + Number(row?.volume ?? 0)
      );
    });

    filtered.forEach((row, idx) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      if (!seen.has(company)) {
        seen.set(company, idx);
        row.amount = Number(row?.amount ?? 0);
      } else {
        row.amount = 0;
      }
    });

    const result = filtered.map((row, idx) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      const firstIndex = seen.get(company);
      const balance =
        idx === firstIndex
          ? balanceMap.get(company) - Number(row?.amount ?? 0)
          : 0;
      return { ...row, balance };
    });

    //console.log("📊 normalizedList 👉", result);
    return result;
  }, [reportlist, filter]);




  // ✅ 1) Group ซ้อนกัน: Zone → Sales (ใช้ normalizedList)
  const groupedByZoneAndSales = useMemo(() => {
    return normalizedList.reduce((acc, item) => {
      const zone = item?.zone ?? "ไม่ระบุโซน";
      const sales = item?.sales ?? "ไม่ระบุ Sales";

      if (!acc[zone]) acc[zone] = {};
      if (!acc[zone][sales]) acc[zone][sales] = [];
      acc[zone][sales].push(item);

      return acc;
    }, {});
  }, [normalizedList]);

  // ✅ 2) ฟังก์ชันรวมยอด (เมื่อ amount ในแถวถัด ๆ ไปเป็น 0 แล้ว การรวมจะถูกต้องเอง)
  const calcTotals = (rows) => ({
    qty: rows.reduce((sum, r) => sum + Number(r?.qty ?? 0), 0),
    volume: rows.reduce((sum, r) => sum + Number(r?.volume ?? 0), 0),
    amount: rows.reduce((sum, r) => sum + Number(r?.amount ?? 0), 0),
    balance: rows.reduce((sum, r) => sum + Number(r?.balance ?? 0), 0),
  });

  

    // 1️⃣ Register ฟอนต์   
    Font.register({
      family: "Sarabun",
      fonts: [
          { src: "/fonts/Sarabun-Regular.ttf", fontWeight: "400", fontStyle: "normal" },
          { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "700", fontStyle: "normal" },
          { src: "/fonts/Sarabun-Italic.ttf", fontWeight: "400", fontStyle: "italic" },
          { src: "/fonts/Sarabun-ThinItalic.ttf", fontWeight: "100", fontStyle: "italic" },
      ],
    });


      // 2️⃣ ใช้ชื่อเดียวกันใน style 
    const styles = StyleSheet.create({
      page: { padding: 20, fontSize: 10, fontFamily: "Sarabun" }, 
      header: { fontSize: 11, marginBottom: 8, fontFamily: "Sarabun" },
      zoneTitle: { fontSize: 8, marginTop: 8, fontWeight: "bold", fontFamily: "Sarabun" },
      salesTitle: { fontSize: 8, marginTop: 4, marginLeft: 10, fontFamily: "Sarabun" },

      row: {
        flexDirection: "row",
        borderBottom: "1px solid #ccc",
        paddingVertical: 1.5,
        fontFamily: "Sarabun",
      },

      col: { width: "11%", textAlign: "center", fontSize: 8.5, fontFamily: "Sarabun" },
      textLeft: { textAlign: "left", fontFamily: "Sarabun" },

      // ✅ ตารางหลัก
      table: {
        borderWidth: 0.5,
        borderColor: "black",
        flexDirection: "column",
        margin: 0,
        padding: 0,
      },


      tableRow: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderColor: "black",
        alignItems: "center",        
      },
      
      tableHeader: {
        backgroundColor: "#f0f0f0",
        fontWeight: "bold",
        borderTopWidth: 1,        // เพิ่มเส้นขอบด้านบน
        borderBottomWidth: 1,     // เส้นขอบด้านล่างหนา
        borderColor: "black",     // ให้เส้นขอบแสดงผลแน่นอน
      },


      tableCell: {
        fontSize: 7,
        paddingVertical: 2,
        paddingHorizontal: 3,
        borderRightWidth: 0.5,
        borderColor: "black",
        fontFamily: "Sarabun",
      },

      // ✅ ช่องสุดท้ายในแต่ละแถว — ไม่ให้มีเส้นขวาซ้อนกับกรอบนอก
      tableCellLast: {
        fontSize: 7,
        padding: 2,
        borderColor: "black",
        fontFamily: "Sarabun", 
        borderRightWidth: 0, // ❌ ปิดเส้นขวาในช่องสุดท้าย       
      },

      tableCellFirst: {
          fontSize: 7,
          paddingVertical: 2,
          paddingHorizontal: 3,
          borderLeftWidth: 0.5,  // ✅ เพิ่มเส้นซ้าย
          borderRightWidth: 0.5,
          borderColor: "black",
          fontFamily: "Sarabun",
      },


      tableFooter: {
        backgroundColor: "#fafafa",
        borderTopWidth: 1,
      },
    });


    // ฟังก์ชันแปลงเป็น วัน/เดือน/ปี พ.ศ.
    const formatThaiDate = (date) => {
      const d = date.getDate();
      const m = date.getMonth() + 1; // เดือน 0–11
      const y = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
      return `${d}/${m}/${y}`;
    };

    // ฟังก์ชันแปลงวันที่
    const formatThaiDateJob = (dateString) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      const months = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
      return `${day} ${month} ${year}`;
    };


    // ======= ฟังก์ชันสร้าง PDF และดาวน์โหลด =======
  const handlePrint = async () => {
    

    const ReportPDF = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between", // ✅ ให้แต่ละคอลัมอยู่ห่างกันพอดี
              marginBottom: 1, // ระยะห่างจากบรรทัดถัดไป
            }}
          >
            {/* คอลัมน์ซ้าย: โลโก้ */}
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Image
                src="/android-chrome-192x192.png"
                style={{ width: 40, height: 40 }}
              />
            </View>

            {/* คอลัมน์กลาง: หัวเรื่อง */}
            <View style={{ flex: 2, alignItems: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  fontFamily: "Sarabun",
                }}
              >
                ** รายงานการเก็บเงิน **
              </Text>
            </View>

            {/* คอลัมน์ขวา: วันที่ */}
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text
                style={{
                  textAlign: "right",
                  fontSize: 10,
                  fontFamily: "Sarabun",
                }}
              >
                ณ วันที่ {formatThaiDate(new Date())}
              </Text>
            </View>
          </View>


            {/* ส่วนข้อมูล event */}
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    fontFamily: "Sarabun",
                    marginVertical: 2,
                  }}
                >
                  {event ? event.name : "-"}
                </Text>

                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    fontFamily: "Sarabun",
                    marginVertical: 2,
                  }}
                >
                  {event
                    ? `${formatThaiDateJob(event.sDate)} - ${formatThaiDateJob(event.eDate)}`
                    : "-"}
                </Text>

                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    fontFamily: "Sarabun",
                    marginVertical: 2,                 
                  }}
                >
                  {event ? event.venue : "-"}
                </Text>
              </View>
            </View>


          {Object.entries(groupedByZoneAndSales).map(([zone, salesGroup]) => (
            <View key={zone} style={styles.section}>
              
              {Object.entries(salesGroup).map(([sales, rows]) => {
                const total = calcTotals(rows);
                return (
                  <View key={sales} style={{ marginLeft: 10  ,marginTop: 6}}>                   
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                    {/* ด้านซ้าย */}
                    <Text style={{ flex: 1, textAlign: "left", fontSize: 8 }}>                    
                      พนักงานขาย : {sales}
                    </Text>

                    {/* ด้านกลาง */}
                    <Text style={{ flex: 1, textAlign: "center", fontSize: 8 }}>
                        โซน : {zone}
                    </Text>

                    {/* ด้านขวา — แสดงเลขหน้า */}
                    <Text
                      style={{ flex: 1, textAlign: "right", fontSize: 8 }}
                      render={({ pageNumber, totalPages }) =>
                        `หน้าที่ : ${pageNumber}`
                        // `หน้าที่ ${pageNumber} / ${totalPages}`
                      }
                    />
                  </View>
                    {/* แถวหัวตาราง */}
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, { width: 30,  textAlign: "center" }]}>ลำดับ </Text>
                        <Text style={[styles.tableCell, { width: 120, textAlign: "center" }]}>ชื่อลูกค้า</Text>
                        <Text style={[styles.tableCell, { width: 20,  textAlign: "center" }]}>หน้า</Text>
                        <Text style={[styles.tableCell, { width: 25,  textAlign: "left"   }]}>#บูท</Text>
                        <Text style={[styles.tableCell, { width: 30,  textAlign: "center" }]}>จำนวน </Text>
                        <Text style={[styles.tableCell, { width: 50,  textAlign: "center" }]}>ยอดเงิน</Text>
                        <Text style={[styles.tableCell, { width: 50,  textAlign: "center" }]}>ชำระแล้ว </Text>
                        <Text style={[styles.tableCell, { width: 50,  textAlign: "center" }]}>ยอดคงค้าง</Text>
                        <Text style={[styles.tableCell, { flex: 2, width: 150, textAlign: "center" }]}>โทรศัพท์</Text>
                      </View>
                   

                   {/* ข้อมูล */}
                    {rows.map((r, i) => (
                      <View key={i} style={styles.tableRow}>
                        <Text style={[styles.tableCellFirst, { width: 30, textAlign: "center" }]}>{i + 1}</Text>
                        <Text style={[styles.tableCell, { width: 120, textAlign: "left" }]}>{r.name ?? "-"} </Text>
                        <Text style={[styles.tableCell, { width: 20, textAlign: "center" }]}>-</Text>
                        <Text style={[styles.tableCell, { width: 25, textAlign: "center" }]}>{r.booth ?? "-"}</Text>
                        <Text style={[styles.tableCell, { width: 30, textAlign: "center" }]}>
                          {Number(r.qty ?? 0).toLocaleString()}
                        </Text>
                        <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>
                          {Number(r.volume ?? 0).toLocaleString()}
                        </Text>
                        <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>
                          {(r.amount ?? 0) === 0 ? "-------" : Number(r.amount).toLocaleString()}
                        </Text>
                        <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>
                          {(r.balance ?? 0) === 0 ? "-------" : Number(r.balance).toLocaleString()}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 2, width: 150, textAlign: "left" }]}>
                          {r.tel ?? "-"}
                        </Text>
                      </View>
                    ))}

                    {/* Total */}
                    <View style={[styles.tableRow, styles.tableFooter]}>                 
                      <Text style={[styles.tableCell, {width: 195,textAlign: "right", fontWeight: "bold",},]}> 
                        รวมยอดทั้งสิ้น 
                      </Text>                
                      <Text style={[styles.tableCell, {width: 30, textAlign: "center" }]}>
                        {Number(total.qty ?? 0).toFixed(2)}
                      </Text>
                      <Text style={[styles.tableCell,{width: 50,textAlign: "center",},]}>
                        {Number(total.volume ?? 0).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2,})}
                      </Text>
                      <Text style={[styles.tableCell,{width: 50,textAlign: "center",},]}>
                         {Number(total.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2,})}
                      </Text>
                      <Text style={[styles.tableCell, {width: 50, textAlign: "center",},]}>
                        {Number(total.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2,})}
                      </Text>
                       <Text style={[styles.tableCell, {flex: 2,width: 150, textAlign: "center" }]}></Text> 
                    </View>

                </View>
                );
              })}
            </View>
          ))}
        </Page>
      </Document>
    );
    
    // if (!show) return; // ป้องกัน undefined

    const blob = await pdf(<ReportPDF />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Report_All.pdf";
    link.click();
  };

  return (
    <section className="mt-6 space-y-8">

      {/* <PrintButton event={event} onPrint={handlePrint} /> */}
      {/* ✅ Summary */}

      {/* <div className="border border-zinc-300 rounded-md p-4 bg-white">
        <h3 className="font-semibold text-red-600">Report (Print All)</h3>
        <p>Zone ทั้งหมด: {Object.keys(groupedByZoneAndSales).length} โซน</p>
        <p>
          Sales ทั้งหมด:{" "}
          {
            new Set(
              (Array.isArray(reportlist) ? reportlist : []).map(
                (item) => item?.sales ?? "ไม่ระบุ Sales"
              )
            ).size
          }{" "}
          คน
        </p>
      </div>   */}


      {/* ✅ ตาราง Zone > Sales */}
      {Object.entries(groupedByZoneAndSales).map(([zone, salesObj], idx) => (
        <div
          key={`zone-${idx}`}
          className="border border-zinc-300 rounded-md p-4 bg-white mb-4"
        >
          <h4 className="font-semibold text-green-600 mb-2">Zone: {zone}</h4>

          {Object.entries(salesObj).map(([sales, rows], sIdx) => {
            const total = calcTotals(rows);

            return (
              <div key={`sales-${sIdx}`} className="mb-6">
                <div className="relative flex items-center mb-2">
                  <h3 className="flex-1 text-left">พนักงานขาย : {sales}</h3>
                  <h3 className="absolute left-1/2 -translate-x-1/2 text-center">
                    โซน : {zone}
                  </h3>
                  {/* <h3 className="flex-1 text-right">หน้าที่ : </h3> */}
                </div>

                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">ลำดับ</th>
                      <th className="border px-2 py-1">ชื่อลูกค้า</th>
                      <th className="border px-2 py-1">หน้า</th>
                      <th className="border px-2 py-1">#บูธ</th>
                      <th className="border px-2 py-1">จำนวน</th>
                      <th className="border px-2 py-1">ยอดเงิน</th>
                      <th className="border px-2 py-1">ชำระแล้ว</th>
                      <th className="border px-2 py-1">ยอดคงค้าง</th>
                      <th className="border px-2 py-1">โทรศัพท์</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={`${row?.name ?? "unknown"}-${i}`}>
                        <td className="border px-2 py-1 text-center">{i + 1}</td>
                        <td className="border px-2 py-1">{row?.name}</td>
                        <td className="border px-2 py-1 text-center">
                          {row?.page ?? "-"}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {row?.booth ?? "-"}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {Number(row?.qty ?? 0).toFixed(2)}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {Number(row?.volume ?? 0).toLocaleString()}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {Number(row?.amount ?? 0) === 0
                            ? "---------"
                            : Number(row?.amount).toLocaleString()}
                        </td>
                       <td className="border px-2 py-1 text-right">
                         {row.balance === 0 ? "---------" : row.balance.toLocaleString()}
                       </td>


                        
                        <td className="border px-2 py-1">{row?.tel ?? "-"}</td>
                      </tr>
                    ))}

                    {/* ✅ Total row */}
                    <tr className="font-semibold bg-gray-50">
                      <td className="border px-2 py-1 text-center" colSpan={4}>
                        รวมยอดทั้งสิ้น
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {total.qty.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {total.volume.toLocaleString()}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {total.amount.toLocaleString()}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {total.balance.toLocaleString()}
                      </td>
                      <td className="border px-2 py-1"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}

export default PrintReport;

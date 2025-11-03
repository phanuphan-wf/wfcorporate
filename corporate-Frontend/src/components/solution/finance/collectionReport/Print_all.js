import { useContext, useMemo } from "react";
import { dataContext } from "./report";
import { pdf, Document, Page, Text, View, StyleSheet, Font ,Image} from "@react-pdf/renderer";

import PrintButton from "./PrintButton"; 

function PrintReport() {
  const { reportC,eventC } = useContext(dataContext);
  const [reportlist] = reportC;    
  const [event] = eventC;
  
  console.log("event 👉", event);


  // ✅ 0) ปรับข้อมูลให้ amount แสดงเฉพาะแถวแรกของแต่ละบริษัท (แถวถัดไป = 0)
  const normalizedList = useMemo(() => {
    const list = Array.isArray(reportlist) ? reportlist : [];
    const seen = new Map(); // เก็บ company → index ของแถวแรก

    // 1) mark amount แถวแรกของแต่ละบริษัท
    list.forEach((row, idx) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      if (!seen.has(company)) {
        seen.set(company, idx); // เก็บ index แถวแรก
        row.amount = Number(row?.amount ?? 0);
      } else {
        row.amount = 0;
      }
    });

    // 2) รวม volume ของบริษัทเดียวกัน
    const balanceMap = new Map();
    list.forEach((row) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      balanceMap.set(company, (balanceMap.get(company) || 0) + Number(row?.volume ?? 0));
    });

    // 3) set balance แถวแรกของบริษัท, แถวถัดไป = 0
    return list.map((row, idx) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      const firstIndex = seen.get(company);
      const balance = idx === firstIndex ? balanceMap.get(company) - Number(row?.amount ?? 0) : 0;
      return { ...row, balance };
    });
  }, [reportlist]);


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
    page: { padding: 20, fontSize: 10, fontFamily: "Sarabun" }, // เดิม 12 → ลดเป็น 10
    header: { fontSize: 11, marginBottom: 8, fontFamily: "Sarabun" },
    zoneTitle: { fontSize: 8, marginTop: 8, fontWeight: "bold", fontFamily: "Sarabun" },
    salesTitle: { fontSize: 8, marginTop: 4, marginLeft: 10, fontFamily: "Sarabun" },
    row: {
      flexDirection: "row",
      borderBottom: "1px solid #ccc",
      paddingVertical: 1.5, // ลดระยะห่าง
      fontFamily: "Sarabun",
    },
    col: { width: "11%", textAlign: "center", fontSize: 8.5, fontFamily: "Sarabun" },
    textLeft: { textAlign: "left", fontFamily: "Sarabun" },

    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 0.5,
      borderColor: "#999",
      alignItems: "center",
      minHeight: 20,
    },
    tableHeader: {
      backgroundColor: "#f0f0f0",
      borderTopWidth: 0.5,
      borderBottomWidth: 1,
      fontWeight: 'bold',
    },
    tableFooter: {
      backgroundColor: "#fafafa",
      borderTopWidth: 1,
    },
    tableCell: {
      fontSize: 7, // 👈 ปรับจาก 8 เป็น 7
      padding: 2,
      borderRightWidth: 0.5,
      borderColor: "#999",
      fontFamily: "Sarabun",
    },

     tableName: {
      fontSize: 7, // 👈 ปรับจาก 8 เป็น 7
      padding: 2,
      borderRightWidth: 1.0,
      borderColor: "#999",
      fontFamily: "Sarabun",
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


   
  //const { filterC, showC } = useContext(dataContext);
  //const [show] = showC; // สมมติว่า showC เป็น [show, setShow]

  // ======= ฟังก์ชันสร้าง PDF และดาวน์โหลด =======
  const handlePrint = async () => {
    

    const ReportPDF = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          
           <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* โลโก้ชิดซ้าย */}
              <Image
                src="/android-chrome-192x192.png"   // path ของไฟล์โลโก้ใน public
                style={{ width: 60, height: 60 }}
              />

              {/* ตรงกลาง */}
              <Text style={{ textAlign: "center", flex: 1, fontSize: 10, fontFamily: "Sarabun" }}>
                ** รายงานการเรียกเก็บเงิน **
              </Text>

              {/* ชิดขวา */}
              <Text style={{ textAlign: "right", fontSize: 10, fontFamily: "Sarabun" }}>
                ณ วันที่ {formatThaiDate(new Date())}
              </Text>
            </View>

            <View style={{ alignItems: "center"}}>
              <View
                style={{
                  flexDirection: "column", // ✅ เปลี่ยนเป็น column เพื่อให้ขึ้นบรรทัดใหม่
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
                   {event ? `${formatThaiDateJob(event.sDate)} - ${formatThaiDateJob(event.eDate)}` : "-"}
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
                  <View key={sales} style={{ marginLeft: 10 }}>                   
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
                      โซน: {zone}
                    </Text>

                    {/* ด้านกลาง */}
                    <Text style={{ flex: 1, textAlign: "center", fontSize: 8 }}>
                      พนักงานขาย: {sales}
                    </Text>

                    {/* ด้านขวา — แสดงเลขหน้า */}
                    <Text
                      style={{ flex: 1, textAlign: "right", fontSize: 8 }}
                      render={({ pageNumber, totalPages }) =>
                        `หน้าที่ ${pageNumber}`
                        // `หน้าที่ ${pageNumber} / ${totalPages}`
                      }
                    />
                  </View>



                    {/* แถวหัวตาราง */}
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, { width: 30,  textAlign: "center" }]}>ลำดับ</Text>
                        <Text style={[styles.tableCell, { width: 100, textAlign: "center" }]}>ชื่อลูกค้า</Text>
                        <Text style={[styles.tableCell, { width: 20,  textAlign: "center" }]}>หน้า</Text>
                        <Text style={[styles.tableCell, { width: 20,  textAlign: "left"   }]}>#บูท</Text>
                        <Text style={[styles.tableCell, { width: 50,  textAlign: "center" }]}>จำนวน </Text>
                        <Text style={[styles.tableCell, { width: 50,  textAlign: "center" }]}>ยอดเงิน</Text>
                        <Text style={[styles.tableCell, { width: 50,  textAlign: "center" }]}>ชำระแล้ว </Text>
                        <Text style={[styles.tableCell, { width: 50,  textAlign: "center" }]}>ยอดคงค้าง</Text>
                        <Text style={[styles.tableCell, {flex: 2, width: 100, textAlign: "center" }]}>โทรศัพท์</Text>
                      </View>
                    {/* ข้อมูล */}
                    /* {rows.map((r, i) => (
                      <View key={i} style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: 30, textAlign: "center" }]}>{i + 1} </Text>
                        <Text style={[styles.tableCell, { width: 100, textAlign: "left" }]}>{r.name ?? "-"} </Text>
                        <Text style={[styles.tableCell, { width: 20, textAlign: "center" }]}>-</Text>
                        <Text style={[styles.tableCell, { width: 20, textAlign: "center" }]}>{r.booth ?? "-"}</Text>
                        <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>
                          {Number(r.qty ?? 0).toLocaleString()}
                        </Text>
                        <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>
                          {Number(r.volume ?? 0).toLocaleString()}
                        </Text>
                        <Text style={[styles.tableCell, {width: 50, textAlign: "center" }]}>
                          {(r.amount ?? 0) === 0 ? "-------" : Number(r.amount).toLocaleString()}
                        </Text>

                        <Text style={[styles.tableCell, {width: 50, textAlign: "center" }]}>
                          {(r.balance ?? 0) === 0 ? "-------" : Number(r.balance).toLocaleString()}
                        </Text>

                       <Text style={[styles.tableCell, { flex: 2, width: 100, textAlign: "left" }]}>
                          {r.tel ?? "-"}
                        </Text>

                      
                      </View>
                    ))} 

                    {/* Total */}
                    <View style={[styles.tableRow, styles.tableFooter]}>
                      <Text style={[styles.tableCell, {flex: 2, width: 148, textAlign: "right" }]}>รวมยอดทั้งสิ้น</Text>
                     

                      <Text style={[styles.tableCell, { width: 45, textAlign: "center" }]}>
                        {Number(total.qty ?? 0).toFixed(2)}
                      </Text>
                      

                      <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>
                        {Number(total.volume ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                      <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>
                        {Number(total.amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                      <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>
                        {Number(total.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>


                      <Text style={[styles.tableCell, {flex: 2, width: 100, textAlign: "center" }]}></Text>
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

       <PrintButton event={event} onPrint={handlePrint} />
      {/* ✅ Summary */}
      <div className="border border-zinc-300 rounded-md p-4 bg-white">
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
      </div>     

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
                  <h3 className="flex-1 text-right">หน้าที่ : </h3>
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

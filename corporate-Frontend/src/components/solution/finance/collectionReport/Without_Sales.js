import { useContext, useMemo } from "react";
import { dataContext } from "./report";
import { pdf, Document, Page, Text, View, StyleSheet, Font ,Image} from "@react-pdf/renderer";

import PrintButton from "./PrintButton"; 

export default function Without_Sales() {
  const { reportC,eventC,filterC } = useContext(dataContext);
  const [reportlist] = reportC;
  const [event] = eventC;
  const [filter] = filterC;
  

  // console.log("filter 👉", filter);
  // console.log("event 👉",event);
  // console.log("reportlist 👉", reportlist);
 
  // 🎯 ส่วนกรองข้อมูลหลักจาก filter ก่อนเข้าสู่ normalizedList
  const filteredList = useMemo(() => {
    let list = Array.isArray(reportlist) ? [...reportlist] : [];

    // 🔹 กรองตาม exID (ต้องมีเสมอ)
    if (filter.exID && filter.exID !== "0") {
      list = list.filter((r) => r.exid === filter.exID);
    }

    // 🔹 กรองตาม sales (ถ้ามีเลือก)
    if (filter.sales && filter.sales !== "0") {
      list = list.filter((r) => r.sales === filter.sales);
    }

    // 🔹 กรองตาม zone
    if (filter.zone && filter.zone !== "0") {
      list = list.filter((r) => r.zone === filter.zone);
    }

    // 🔹 กรองตาม customer
    if (filter.customer && filter.customer !== "0") {
      list = list.filter((r) => r.name === filter.customername);
    }

    return list;
  }, [reportlist, filter]);



  const normalizedList = useMemo(() => {
    const list = Array.isArray(filteredList) ? filteredList : [];
    const seen = new Map();

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
  }, [filteredList]);
 

    // Group เฉพาะ Zone
    const groupedByZone = useMemo(() => {
      return normalizedList.reduce((acc, r) => {
        const zone = r?.zone ?? "ไม่ระบุโซน";
        if (!acc[zone]) acc[zone] = [];
        acc[zone].push(r);
        return acc;
      }, {});
    }, [normalizedList]);

    const calcTotals = (rows) => ({
      qty: rows.reduce((s, r) => s + Number(r?.qty ?? 0), 0),
      volume: rows.reduce((s, r) => s + Number(r?.volume ?? 0), 0),
      amount: rows.reduce((s, r) => s + Number(r?.amount ?? 0), 0),
      balance: rows.reduce((s, r) => s + Number(r?.balance ?? 0), 0),
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
          flexWrap: "wrap",       // ✅ เพิ่มบรรทัดนี้
          wordBreak: "break-word" // ✅ เพิ่มบรรทัดนี้
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

          {/* ===== ส่วนหัวกระดาษ ===== */}

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

            {/* ===== ดึงข้อมูล groupedByZone ไปแสดงใน PDF ===== */}
            {Object.entries(groupedByZone).map(([zone, rows], zIndex) => {
              const total = calcTotals(rows);
              return (
                <View key={zIndex} style={{ marginBottom: 8 }}>
                  <Text style={{fontSize: 8,marginBottom: 4,fontFamily: "Sarabun",}}>
                    โซน : {zone}
                  </Text>

                  {/* หัวตาราง */}
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.tableCell, { width: 25, textAlign: "center" }]}>ลำดับ </Text>
                    <Text style={[styles.tableCell, { width: 100, textAlign: "center" }]}>ชื่อลูกค้า</Text>
                    <Text style={[styles.tableCell, { width: 30, textAlign: "center" }]}>หน้า</Text>
                    <Text style={[styles.tableCell, { width: 30, textAlign: "center" }]}>#บูธ</Text>
                    <Text style={[styles.tableCell, { width: 40, textAlign: "center" }]}>จำนวน </Text>
                    <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>ยอดเงิน</Text>
                    <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>ชำระแล้ว </Text>
                    <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>ยอดคงค้าง</Text>
                    <Text style={[styles.tableCell, { width: 100, textAlign: "center" }]}>โทรศัพท์</Text>
                    <Text style={[styles.tableCellLast, { flex: 1,width: 100, textAlign: "center" }]}>Sales</Text>
                  </View>

                  {/* แถวข้อมูล */}
                  {rows.map((r, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={[styles.tableCellFirst, { width: 25, textAlign: "center" }]}>{i + 1}</Text>
                      <Text style={[styles.tableCell, { width: 100 }]}>{r.name ?? "-"} </Text>
                      <Text style={[styles.tableCell, { width: 30, textAlign: "center" }]}>{r.page ?? "-"}</Text>
                      <Text style={[styles.tableCell, { width: 30, textAlign: "center" }]}>{r.booth ?? "-"}</Text>
                      <Text style={[styles.tableCell, { width: 40, textAlign: "right" }]}>
                        {Number(r.qty ?? 0).toLocaleString()}
                      </Text>
                      <Text style={[styles.tableCell, { width: 50, textAlign: "right" }]}>
                        {Number(r.volume ?? 0).toLocaleString()}
                      </Text>
                      <Text style={[styles.tableCell, { width: 50, textAlign: "right" }]}>
                        {Number(r.amount ?? 0) === 0 ? "-------" : Number(r.amount).toLocaleString()}
                      </Text>
                      <Text style={[styles.tableCell, { width: 50, textAlign: "right" }]}>
                        {Number(r.balance ?? 0) === 0 ? "-------" : Number(r.balance).toLocaleString()}
                      </Text>
                      
                      <View style={[styles.tableCell, { width: 100, textAlign: "left" }]}>
                        {(r.tel ? r.tel : "-")
                          .match(/.{1,25}/g)  // ตัดข้อความทุก 25 ตัวอักษร
                          .map((line, i) => (
                            <Text key={i}>{line}</Text>
                          ))}
                      </View>


                      <Text style={[styles.tableCell, { flex: 1 ,width: 100 ,textAlign: "left"}]}>{r.sales ?? "-"} </Text>
                    </View>
                  ))}

                  {/* รวมยอด */}
                  <View style={[styles.tableRow, styles.tableFooter]}>
                    <Text style={[styles.tableCell, { width: 185, textAlign: "right" }]}>รวมยอดทั้งสิ้น</Text>
                    <Text style={[styles.tableCell, { width: 40, textAlign: "right" }]}>
                      {Number(total.qty).toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCell, { width: 50, textAlign: "right" }]}>
                      {Number(total.volume).toLocaleString()}
                    </Text>
                    <Text style={[styles.tableCell, { width: 50, textAlign: "right" }]}>
                      {Number(total.amount).toLocaleString()}
                    </Text>
                    <Text style={[styles.tableCell, { width: 50, textAlign: "right" }]}>
                      {Number(total.balance).toLocaleString()}
                    </Text>
                    <Text style={[styles.tableCellLast, { flex: 1 }]} />
                  </View>
                </View>
              );
            })}

          
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

  const TableHead = () => (
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
        <th className="border px-2 py-1">Sales</th>
      </tr>
    </thead>
  );

  const TableRows = ({ rows }) => (
    <tbody>
      {rows.map((row, i) => (
        <tr key={`${row?.name ?? "unk"}-${i}`}>
          <td className="border px-2 py-1 text-center">{i + 1}</td>
          <td className="border px-2 py-1">{row?.name}</td>
          <td className="border px-2 py-1 text-center">{row?.page ?? "-"}</td>
          <td className="border px-2 py-1 text-center">{row?.booth ?? "-"}</td>
          <td className="border px-2 py-1 text-right">{Number(row?.qty ?? 0).toFixed(2)}</td>
          <td className="border px-2 py-1 text-right">{Number(row?.volume ?? 0).toLocaleString()}</td>
          <td className="border px-2 py-1 text-right">
              {Number(row?.amount ?? 0) === 0 ? "---------": Number(row?.amount).toLocaleString()}
          </td>
          <td className="border px-2 py-1 text-right">
            {row.balance === 0 ? "---------" : row.balance.toLocaleString()}
          </td>
          <td className="border px-2 py-1">{row?.tel ?? "-"}</td>
          <td className="border px-2 py-1">{row?.sales ?? "-"}</td>
        </tr>
      ))}
    </tbody>
  );

  const TotalRow = ({ rows }) => {
    const t = calcTotals(rows);
    return (
      <tfoot>
        <tr className="font-semibold bg-gray-50">
          <td className="border px-2 py-1 text-center" colSpan={4}>ยอดรวมทั้งสิ้น</td>
          <td className="border px-2 py-1 text-right">{t.qty.toFixed(2)}</td>
          <td className="border px-2 py-1 text-right">{t.volume.toLocaleString()}</td>
          <td className="border px-2 py-1 text-right">{t.amount.toLocaleString()}</td>
          <td className="border px-2 py-1 text-right">{t.balance.toLocaleString()}</td>
          <td className="border px-2 py-1"></td>
        </tr>
      </tfoot>
    );
  };

  return (
    <section className="mt-6 space-y-8">

      <PrintButton event={event} onPrint={handlePrint} />

      {/* <div className="border border-zinc-300 rounded-md p-4 bg-white">
        <h3 className="font-semibold text-red-600">Report (Without Sales)</h3>
        <p>Zone ทั้งหมด: {Object.keys(groupedByZone).length} โซน</p>
      </div> */}

      {Object.entries(groupedByZone).map(([zone, rows]) => (
        <div key={`zone-only-${zone}`} className="border border-zinc-300 rounded-md p-4 bg-white mb-4">
          <h4 className="font-semibold text-green-600 mb-2">Zone: {zone}</h4>
          <table className="w-full border-collapse border">
            <TableHead />
            <TableRows rows={rows} />
            <TotalRow rows={rows} />
          </table>
        </div>
      ))}
    </section>
  );
}

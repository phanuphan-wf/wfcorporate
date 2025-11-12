import { useContext, useMemo } from "react";
import { dataContext } from "./report";
import { pdf, Document, Page, Text, View, StyleSheet, Font ,Image} from "@react-pdf/renderer";

import PrintButton from "./PrintButton"; 

export default function SummaryReport() {
  const { reportC, eventC, filterC} = useContext(dataContext);
  const [reportlist] = reportC;    
  const [event] = eventC;
  const [filter] = filterC;

   // 🔹 กรองข้อมูลตาม filter ก่อน
  const filteredList = useMemo(() => {
    let list = Array.isArray(reportlist) ? [...reportlist] : [];

    if (filter.exID && filter.exID !== "0") {
      list = list.filter((r) => r.exid === filter.exID);
    }

    if (filter.sales && filter.sales !== "0") {
      list = list.filter((r) => r.sales === filter.sales);
    }

    if (filter.zone && filter.zone !== "0") {
      list = list.filter((r) => r.zone === filter.zone);
    }

    if (filter.customer && filter.customer !== "0") {
      list = list.filter((r) => r.name === filter.customername);
    }

    return list;
  }, [reportlist, filter]);

   // ✅ Normalize list เหมือนเดิม
  const normalizedList = useMemo(() => {
    const list = Array.isArray(filteredList) ? filteredList : [];
    const seen = new Map();
    const balanceMap = new Map();

    list.forEach((row) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      balanceMap.set(company, (balanceMap.get(company) || 0) + Number(row?.volume ?? 0));
    });

    list.forEach((row, idx) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      if (!seen.has(company)) {
        seen.set(company, idx);
        row.amount = Number(row?.amount ?? 0);
      } else {
        row.amount = 0;
      }
    });

    return list.map((row, idx) => {
      const company = row?.name ?? "ไม่ระบุบริษัท";
      const firstIndex = seen.get(company);
      const balance = idx === firstIndex ? balanceMap.get(company) - Number(row?.amount ?? 0) : 0;
      return { ...row, balance };
    });
  }, [filteredList]);


  // (ตัวเลือก) เรียงข้อมูลให้อ่านง่าย: Zone > Sales > Name
  const sortedRows = useMemo(() => {
    return [...normalizedList].sort((a, b) => {
      const za = (a?.zone ?? "ไม่ระบุโซน").localeCompare(b?.zone ?? "ไม่ระบุโซน", "th");
      if (za !== 0) return za;
      const sa = (a?.sales ?? "ไม่ระบุ Sales").localeCompare(b?.sales ?? "ไม่ระบุ Sales", "th");
      if (sa !== 0) return sa;
      return (a?.name ?? "").localeCompare(b?.name ?? "", "th");
    });
  }, [normalizedList]);

  const totals = useMemo(() => ({
    qty: sortedRows.reduce((s, r) => s + Number(r?.qty ?? 0), 0),
    volume: sortedRows.reduce((s, r) => s + Number(r?.volume ?? 0), 0),
    amount: sortedRows.reduce((s, r) => s + Number(r?.amount ?? 0), 0),
    balance: sortedRows.reduce((s, r) => s + Number(r?.balance ?? 0), 0),
  }), [sortedRows]);

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
    const ReportPDF = ({ rows, totals }) => (
      <Document>
        <Page size="A4" style={styles.page}>

          {/* Header */}            
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

          {/* Table */}
          <View style={styles.table}>          

            {/* หัวตาราง */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: 22, textAlign: "center" }]}>ลำดับ </Text>
              <Text style={[styles.tableCell, { width: 40, textAlign: "center" }]}>โซน </Text>
              <Text style={[styles.tableCell, { width: 70, textAlign: "center" }]}>ฝ่ายขาย</Text>
              <Text style={[styles.tableCell, { width: 100, textAlign: "center" }]}>ชื่อลูกค้า</Text>
              <Text style={[styles.tableCell, { width: 22, textAlign: "center" }]}>หน้า</Text>
              <Text style={[styles.tableCell, { width: 30, textAlign: "center" }]}>#บูธ</Text>
              <Text style={[styles.tableCell, { width: 30, textAlign: "center" }]}>จำนวน </Text>
              <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>ยอดเงิน</Text>
              <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>ชำระแล้ว </Text>
              <Text style={[styles.tableCell, { width: 50, textAlign: "center" }]}>ยอดคงค้าง</Text>             
              <Text style={[styles.tableCellLast, {width: 100, textAlign: "center" }]}>โทรศัพท์</Text>
            </View>

            {/* Rows */}
            {rows.map((r, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={[styles.tableCell, { width: 22 ,textAlign: "center" }]}>
                  <Text style={styles.textCenter}>{i + 1}</Text>
                </View>
                <View style={[styles.tableCell, { width: 40 }]}>
                  <Text>{r.zone}</Text>
                </View>
                <View style={[styles.tableCell, { width: 70 ,textAlign: "left"}]}>
                  <Text>{r.sales}</Text>
                </View>
                <View style={[styles.tableCell, { width: 100,textAlign: "left" }]}>
                  <Text>{r.name} </Text>
                </View>                
                <View style={[styles.tableCell, { width: 22 ,textAlign: "center" }]}>
                  <Text>{r.page ?? "-"}</Text>
                </View>
                <View style={[styles.tableCell, { width: 30 ,textAlign: "center"}]}>
                  <Text style={styles.textCenter}>{r.booth ?? "-"}</Text>
                </View>
                <View style={[styles.tableCell, { width: 30 ,textAlign: "right" }]}>
                  <Text>{r.qty?.toFixed(2)}</Text>
                </View>
                <View style={[styles.tableCell, { width: 50 ,textAlign: "right" }]}>
                  <Text>{r.volume?.toLocaleString()}</Text>
                </View>
                <View style={[styles.tableCell, { width: 50 ,textAlign: "right"}]}>
                  <Text>{Number(r.amount ?? 0) === 0 ? "-------" : Number(r.amount).toLocaleString()}</Text>
                </View>
                <View style={[styles.tableCell, { width: 50 ,textAlign: "right"}]}>
                  <Text>{Number(r.balance ?? 0) === 0 ? "-------" : Number(r.balance).toLocaleString()}</Text>
                </View>                 
                
               <View style={[styles.tableCell, { width: 100, textAlign: "left" }]}>
                        {(r.tel ? r.tel : "-")
                          .match(/.{1,25}/g)  // ตัดข้อความทุก 25 ตัวอักษร
                          .map((line, i) => (
                            <Text key={i}>{line}</Text>
                          ))}
                </View>

              </View>
            ))}

            {/* Footer */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              {/* รวมช่อง 1–4 (ลำดับ–ชื่อ) */}
              <View style={[styles.tableCell, { width: 22 + 40 + 70 + 100 +22+30}]}>
                <Text style={{ textAlign: "right" }}>รวมยอดทั้งสิ้น</Text>
              </View>
             
              <View style={[styles.tableCell, { width: 30, textAlign: "right" }]}>
                <Text>{totals.qty.toFixed(2)}</Text>
              </View>
              <View style={[styles.tableCell, { width: 50, textAlign: "right" }]}>
                <Text>{totals.volume.toLocaleString()}</Text>
              </View>
              <View style={[styles.tableCell, { width: 50, textAlign: "right" }]}>
                <Text>{totals.amount.toLocaleString()}</Text>
              </View>
              <View style={[styles.tableCell, { width: 50, textAlign: "right" }]}>
                <Text>{totals.balance.toLocaleString()}</Text>
              </View>
              <View style={[styles.tableCell, { width: 100 }]} />
            </View>
            
          </View>
        </Page>
      </Document>
    );

    const blob = await pdf(<ReportPDF rows={sortedRows} totals={totals} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Summary_Report.pdf";
    a.click();
  };

  

  const TableHead = () => (
    <thead>
      <tr className="bg-gray-100">
        <th className="border px-2 py-1">ลำดับ</th>
        <th className="border px-2 py-1">โซน</th>
        <th className="border px-2 py-1">ฝ่ายขาย</th>
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
  );

  const TotalRow = () => (
    <tfoot>
      <tr className="font-semibold bg-gray-50">
        <td className="border px-2 py-1 text-center" colSpan={6}>ยอดรวมทั้งสิ้น</td>
        <td className="border px-2 py-1 text-right">{totals.qty.toFixed(2)}</td>
        <td className="border px-2 py-1 text-right">{totals.volume.toLocaleString()}</td>
        <td className="border px-2 py-1 text-right">{totals.amount.toLocaleString()}</td>
        <td className="border px-2 py-1 text-right">{totals.balance.toLocaleString()}</td>
        <td className="border px-2 py-1"></td>
      </tr>
    </tfoot>
  );

  return (
    <section className="mt-6 space-y-8">
      {/* <PrintButton event={event} onPrint={handlePrint} /> */}
      {/* Summary cards */}
      {/* <div className="border border-zinc-300 rounded-md p-4 bg-white">
        <h3 className="font-semibold text-red-600 mb-3">Summary Report</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded bg-gray-50 border">
            <div className="text-zinc-500 text-sm">จำนวนรวม</div>
            <div className="font-semibold">{totals.qty.toFixed(2)}</div>
          </div>
          <div className="p-3 rounded bg-gray-50 border">
            <div className="text-zinc-500 text-sm">ยอดเงินรวม</div>
            <div className="font-semibold">{totals.volume.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded bg-gray-50 border">
            <div className="text-zinc-500 text-sm">ชำระแล้วรวม</div>
            <div className="font-semibold">{totals.amount.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded bg-gray-50 border">
            <div className="text-zinc-500 text-sm">ยอดคงค้างรวม</div>
            <div className="font-semibold">{totals.balance.toLocaleString()}</div>
          </div>
        </div>
      </div> */}

      {/* One big table */}
      <div className="border border-zinc-300 rounded-md p-4 bg-white mb-4">
        <table className="w-full border-collapse border">
          <TableHead />
          <tbody>
            {sortedRows.map((row, i) => (
              <tr key={`${row?.name ?? "unk"}-${i}`}>
                <td className="border px-2 py-1 text-center">{i + 1}</td>
                <td className="border px-2 py-1">{row?.zone ?? "ไม่ระบุโซน"}</td>
                <td className="border px-2 py-1">{row?.sales ?? "ไม่ระบุ Sales"}</td>
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
   
                <td className="border px-2 py-1 whitespace-pre-wrap break-words">
                  {row?.tel
                    ? row.tel.length > 25
                      ? row.tel.substring(0, 25) + "\n" + row.tel.substring(25)
                      : row.tel
                    : "-"}
                </td>

              </tr>
            ))}
          </tbody>
          <TotalRow />
        </table>
      </div>
    </section>
  );
}

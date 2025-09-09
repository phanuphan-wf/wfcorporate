import React, { useState } from "react";

export default function News(props) {
  const [data, setData] = useState([
    {
      banner: "news_231221.png",
      title: "ทีมงาน เวิลด์ แฟร์ สัมมนาเตรียมความพร้อมจัดงานใหญ่",
      hilight: (
        <div>
          ทีมงาน เวิลด์ แฟร์ สัมมนาเตรียมความพร้อมจัดงานใหญ่ ระดับเมกะโชว์ “
          FURNITURE MEGA SHOW 2024” ที่อิมแพ็ค เมืองทองธานี วันที่ 13-21 มกราคม
          2567
          <br />
          <br />
          เตรียมตัวให้พร้อม แล้วไปพบกันนะคะ
        </div>
      ),
    },
    {
      banner: "news_230803.png",
      title: "ขอบคุณผู้ชมงาน เฟอร์นิเจอร์ แฟร์ 2023",
      hilight:
        "ทีมงานบริษัท เวิลด์ แฟร์ จำกัด ขอขอบคุณผู้ชมงาน เฟอร์นิเจอร์ แฟร์ 2023 ทุกท่าน ที่ให้เกียรติเข้าชมงานอย่างท่วมท้นตลอด 9 วันของการจัดงาน แล้วพบกันใหม่ในงานครั้งถัดไปของ เวิลด์ แฟร์ นะคะ",
    },
    {
      banner: "news_230623.png",
      title: "เดินทางมา เวิลด์ แฟร์ สะดวกมาก",
      hilight:
        "รถไฟฟ้าสายสีเหลือง ลาดพร้าว - สำโรง มาแล้วน้า เดินทางมาบริษัท เวิลด์ แฟร์ ง่ายและสะดวกมาก ลงสถานีลาดพร้าว 101 ออกทางออกที่ 4 ถึงออฟฟิศเลย ใช้เวลาไม่กี่นาที แวะมาหาเราได้นะคะ ยินดีต้อนรับ",
    },
  ]);
  return (
    <section className="news my-10">
      <div className="headline mb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-center">
            ข่าวสาร
          </h1>
        </div>
        <div className="flex justify-center py-4 mb-5">
          <svg height={10} width={160}>
            <line
              x1="0"
              y1="0"
              x2="160"
              y2="0"
              style={{ stroke: "rgb(255,0,0)", strokeWidth: "5px" }}
            />
          </svg>
        </div>
      </div>
      <div className="news_link px-5 sm:px-10 md:container md:px-5">
        {data.map((d, i) => (
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-3/5 sm:w-1/2 md:w-1/3 flex-none mx-auto">
              <img
                src={
                  "https://worldfair.blob.core.windows.net/webnews/" + d.banner
                }
                alt={"banner_" + i}
                className="object-cover"
              />
            </div>
            <div className="px-4 md:px-0 md:my-auto">
              <div className="text-red-500 text-xl">{d.title}</div>
              <p className="max-h-[190px] overflow-hidden text-ellipsis mt-3 ml-3">
                {d.hilight}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

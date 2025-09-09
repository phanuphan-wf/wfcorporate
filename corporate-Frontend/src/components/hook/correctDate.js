/* Description
d - is sql return date format
mt - "s" for convert to short month name "l" for convert to full month name*/

function CorrectDate(d, mt, format) {
  let dd = "";
  let mm = "";
  let yy = "";

  if (d.indexOf("T") !== -1) {
    d = d.substring(0, d.indexOf("T"));
  }

  yy = d.substring(0, d.indexOf("-"));
  let mi = d.substring(d.indexOf("-") + 1, d.indexOf("-") + 3);
  dd = d.substring(d.length - 2);

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fullMonth = month.map((m, i) => {
    const date = new Date(2000, i, 1);
    return date.toLocaleString("en-US", { month: "long" });
  });

  switch (mt) {
    case "s":
      mm = month[Number(mi) - 1];
      break;
    case "f":
      mm = fullMonth[Number(mi) - 1];
      break;
    default:
      mm = mi;
      break;
  }

  switch (format) {
    case "mm/dd/yyyy":
      return mm + "/" + dd + "/" + yy;
    case "yyyy-mm-dd":
      return yy + "-" + mm + "-" + dd;
    default:
      return dd + "/" + mm + "/" + yy;
  }
}

export default CorrectDate;

// Customer_A.Branch is the location type; subBranch is the branch number.
export function taxBranchLabel(branch, subBranch, language = "en") {
  if (String(branch ?? "").trim() === "1") {
    return language === "th" ? "สำนักงานใหญ่" : "Head Office";
  }
  const label = language === "th" ? "สาขา" : "Branch";
  const number = String(subBranch ?? "").trim();
  return number ? `${label} ${number}` : label;
}

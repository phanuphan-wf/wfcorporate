import { useState } from "react";

// Token ออกโดย backend หลังยืนยัน OTP เท่านั้น
export default function useHeader() {
  const [header] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user"))?.accessToken || null; }
    catch { return null; }
  });
  return header;
}

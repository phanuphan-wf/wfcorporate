import React from "react";
import { useAuth } from "../../../hook/useAuth";
import { canIssueDocuments } from "../documentAccess";

// Menu reservation only; receipt issuance is outside the current scope.
export default function TaxInvoice() {
  const { user } = useAuth();
  if (!canIssueDocuments(user)) return <p role="alert">คุณไม่มีสิทธิ์เข้าหน้านี้</p>;
  return <section><h1 className="text-2xl font-semibold">Tax Invoice</h1><p className="mt-3 text-gray-500">ยังไม่เปิดใช้งานการออกใบเสร็จรับเงิน / ใบกำกับภาษี</p></section>;
}

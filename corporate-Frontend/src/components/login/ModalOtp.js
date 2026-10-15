import React, { useEffect, useRef, useState } from "react";

export default function ModalOtp({ challenge, busy, error, onVerify, onResend, onCancel }) {
  const [digits, setDigits] = useState(() => Array(6).fill(""));
  const otp = digits.join("");
  const inputs = useRef([]);
  const [now, setNow] = useState(Date.now());
  const dialog = useRef(null);
  useEffect(() => {
    setDigits(Array(6).fill(""));
    setNow(Date.now());
    if (!challenge) return;
    const element = dialog.current;
    element?.showModal();
    inputs.current[0]?.focus();
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(timer); element?.close(); };
  }, [challenge]);
  const fillDigits = (index, value) => {
    const numbers = value.replace(/[^0-9]/g, "").slice(0, 6 - index);
    if (!numbers) return;
    setDigits((current) => {
      const next = [...current];
      numbers.split("").forEach((digit, offset) => { next[index + offset] = digit; });
      return next;
    });
    inputs.current[Math.min(index + numbers.length, 5)]?.focus();
  };
  const clearDigit = (index) => setDigits((current) => current.map((digit, position) => position === index ? "" : digit));
  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const position = digits[index] || index === 0 ? index : index - 1;
      clearDigit(position);
      inputs.current[position]?.focus();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      inputs.current[Math.max(0, Math.min(5, index + (event.key === "ArrowLeft" ? -1 : 1)))]?.focus();
    }
  };
  if (!challenge) return null;
  const remaining = Math.max(0, Math.ceil((Date.parse(challenge.expiresAt) - now) / 1000));
  const resendWait = Math.max(0, Math.ceil((Date.parse(challenge.resendAvailableAt) - now) / 1000));
  return (
    <dialog ref={dialog} onCancel={(e) => { e.preventDefault(); if (!busy) onCancel(); }}
      aria-labelledby="otp-title" className="rounded-xl p-6 w-[92%] max-w-md shadow-xl backdrop:bg-gray-900/60">
      <form onSubmit={(e) => { e.preventDefault(); if (!busy && remaining > 0 && /^\d{6}$/.test(otp)) onVerify(otp); }}>
        <h2 id="otp-title" className="text-xl font-medium mb-3">ยืนยันตัวตนด้วย OTP</h2>
        <p>ส่งรหัส 6 หลักไปที่ {challenge.maskedPhone} แล้ว</p>
        <fieldset className="mt-4" disabled={busy}>
          <legend className="mb-2 text-base">รหัส OTP</legend>
          <div className="flex justify-center gap-2" dir="ltr">
            {digits.map((digit, index) => (
              <input key={index} ref={(element) => { inputs.current[index] = element; }}
                id={`login-otp-${index + 1}`} aria-label={`รหัส OTP หลักที่ ${index + 1}`}
                type="text" inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"}
                pattern="[0-9]" maxLength={index === 0 ? 6 : 1} value={digit}
                onFocus={(event) => event.target.select()}
                onChange={(event) => {
                  if (event.target.value === "") clearDigit(index);
                  else fillDigits(index, event.target.value);
                }}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPaste={(event) => {
                  event.preventDefault();
                  const value = event.clipboardData.getData("text").replace(/[^0-9]/g, "");
                  fillDigits(value.length >= 6 ? 0 : index, value);
                }}
                className="w-9 sm:w-11 h-12 min-w-0 text-center text-2xl font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
            ))}
          </div>
        </fieldset>
        <p className="my-3 text-sm" role="timer">{remaining ? `รหัสหมดอายุใน ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")} นาที` : "รหัสหมดอายุ กรุณาขอ OTP ใหม่"}</p>
        {error && <p role="alert" className="text-red-600 mb-3">{error}</p>}
        <button type="submit" disabled={busy || remaining === 0 || otp.length !== 6} className="btn-primary w-full disabled:opacity-50">{busy ? "กำลังดำเนินการ..." : "ยืนยัน OTP"}</button>
        <button type="button" disabled={busy || resendWait > 0} onClick={onResend} className="block mx-auto mt-4 text-blue-700 disabled:text-gray-400">{resendWait > 0 ? `ขอรหัสใหม่ได้ใน ${resendWait} วินาที` : "ไม่ได้รับ SMS? ขอ OTP ใหม่"}</button>
        <button type="button" disabled={busy} onClick={onCancel} className="block mx-auto mt-3 text-gray-500">ยกเลิก</button>
      </form>
    </dialog>
  );
}

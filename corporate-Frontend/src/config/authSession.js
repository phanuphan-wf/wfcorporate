// ค่าสำรองสำหรับ session เดิม; session ใหม่รับค่าจาก backend LoginSecurity
// ปรับเวลา/เปิดปิดจริงที่ backend appsettings.json แล้ว restart backend
export const AUTH_SESSION = {
  enabled: true,
  idleMinutes: 10,
  maxMinutes: 4 * 60,
};

export const SESSION_KEYS = {
  started: "authSessionStartedAt",
  activity: "authSessionLastActivityAt",
};

export function getSessionDeadline(startedAt, lastActivityAt, config = AUTH_SESSION) {
  if (!config.enabled) return Infinity;
  if (!Number.isFinite(startedAt) || !Number.isFinite(lastActivityAt) ||
      startedAt <= 0 || lastActivityAt < startedAt) return 0;
  return Math.min(startedAt + config.maxMinutes * 60000,
    lastActivityAt + config.idleMinutes * 60000);
}

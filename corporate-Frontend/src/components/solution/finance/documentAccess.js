// Shared access for Invoice and the future Tax Invoice page.
export const documentAccess = [
  { dept: 1, acc: 1 },
  { dept: 6, acc: 1 },
  { dept: 6, acc: 2 },
];

export function canIssueDocuments(user) {
  return documentAccess.some(({ dept, acc }) =>
    Number(user?.Dept) === dept && Number(user?.ALevel) === acc);
}

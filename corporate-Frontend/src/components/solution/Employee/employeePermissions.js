export const employeeManagementAccess = [
  { dept: 1, acc: 1 },
  { dept: 6, acc: 1 },
  { dept: 7, acc: 1 },
  { dept: 7, acc: 2 },
];

export function canManageEmployees(user) {
  const department = String(user?.Dept);
  const accessLevel = String(user?.ALevel);

  return employeeManagementAccess.some(
    ({ dept, acc }) => department === String(dept) && accessLevel === String(acc)
  );
}

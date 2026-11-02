export const APP_ROLES = ["student", "reviewer", "admin"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const PERMISSIONS = [
  "view_student_area",
  "view_admin_area",
  "manage_users",
  "manage_curriculum",
  "manage_content",
  "review_exams",
  "manage_exam_sources",
  "manage_settings",
  "view_analytics",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<AppRole, readonly Permission[]> = {
  student: ["view_student_area"],
  reviewer: [
    "view_student_area",
    "view_admin_area",
    "review_exams",
    "manage_exam_sources",
    "view_analytics",
  ],
  admin: [...PERMISSIONS],
};

export function hasPermission(role: AppRole, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function assertPermission(role: AppRole, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error(`Role "${role}" is not allowed to perform "${permission}"`);
  }
}

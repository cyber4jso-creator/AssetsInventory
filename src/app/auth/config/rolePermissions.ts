import type { Permission, Role } from "../types";

// ─────────────────────────────────────────────
// Role → Permission mapping — single source of truth.
// Each tier is composed from the one below it so no
// permission list is ever retyped.
// ─────────────────────────────────────────────

const EMPLOYEE_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "assets.view",
  "requests.view",
  "requests.create",
  "assistant.use",
  "notifications.view",
  "settings.view",
];

const DEPARTMENT_MANAGER_PERMISSIONS: Permission[] = [
  ...EMPLOYEE_PERMISSIONS,
  "requests.approve",
  "reports.view",
  "assets.qr",
];

const ASSET_MANAGER_PERMISSIONS: Permission[] = [
  ...DEPARTMENT_MANAGER_PERMISSIONS,
  "assets.create",
  "assets.edit",
  "assets.transfer",
  "reports.export",
];

const AUDITOR_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "assets.view",
  "requests.view",
  "reports.view",
  "reports.export",
  "audit.view",
  "assistant.use",
  "notifications.view",
  "settings.view",
];

const SUPER_ADMIN_PERMISSIONS: Permission[] = [
  ...ASSET_MANAGER_PERMISSIONS,
  "assets.delete",
  "users.manage",
  "settings.manage",
  "audit.view",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  "employee":            EMPLOYEE_PERMISSIONS,
  "department-manager":  DEPARTMENT_MANAGER_PERMISSIONS,
  "asset-manager":       ASSET_MANAGER_PERMISSIONS,
  "auditor":             AUDITOR_PERMISSIONS,
  "super-admin":         SUPER_ADMIN_PERMISSIONS,
};

export const ROLE_LABELS: Record<Role, string> = {
  "super-admin":         "مدير عام النظام",
  "asset-manager":       "مدير الأصول",
  "department-manager":  "مدير القسم",
  "employee":            "موظف",
  "auditor":             "مراجع",
};

export const PERMISSION_LABELS: Record<Permission, string> = {
  "dashboard.view":      "عرض لوحة التحكم",
  "assets.view":         "عرض الأصول",
  "assets.create":       "إضافة أصل",
  "assets.edit":         "تعديل أصل",
  "assets.delete":       "حذف أصل",
  "assets.transfer":     "نقل أصل",
  "assets.qr":           "إصدار وطباعة رموز QR",
  "requests.view":       "عرض الطلبات",
  "requests.create":     "إنشاء طلب",
  "requests.approve":    "اعتماد الطلبات",
  "reports.view":        "عرض التقارير",
  "reports.export":      "تصدير التقارير والبيانات",
  "audit.view":          "عرض سجل المراجعة",
  "users.manage":        "إدارة المستخدمين والأدوار",
  "settings.view":       "الوصول إلى الإعدادات الشخصية",
  "settings.manage":     "إدارة إعدادات النظام",
  "assistant.use":       "استخدام المساعد الذكي",
  "notifications.view":  "عرض الإشعارات",
};

import {
  Package, CheckCircle, Clock, ArrowLeftRight,
  Plus, User, Wrench, Shield, Tag, Archive,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Asset, AssetStatus, BusinessCriticality, AssetHistoryEvent, AssetHistoryEventType } from "../types";

export const STATUS: Record<AssetStatus, { label: string; bg: string; text: string; dot: string }> = {
  active:      { label: "نشط",         bg: "#EDF3EF", text: "#3D6B47", dot: "#4F7C5A" },
  maintenance: { label: "في الصيانة", bg: "#FDF6ED", text: "#8B6914", dot: "#D0A165" },
  reserved:    { label: "محجوز",       bg: "#EEF0F8", text: "#2A3172", dot: "#3D4589" },
  inactive:    { label: "معطل",        bg: "#FAEDED", text: "#9E3A3A", dot: "#C44D4D" },
  transferred: { label: "مُحال",       bg: "#F0EFE9", text: "#4B5563", dot: "#6B7280" },
};

export const CRITICALITY: Record<BusinessCriticality, { label: string; bg: string; text: string; dot: string }> = {
  Critical: { label: "Critical", bg: "#FAEDED", text: "#9E3A3A", dot: "#C44D4D" },
  High:     { label: "High",     bg: "#FDF6ED", text: "#8B6914", dot: "#D0A165" },
  Medium:   { label: "Medium",   bg: "#FDF6ED", text: "#8B6914", dot: "#D0A165" },
  Low:      { label: "Low",      bg: "#EDF3EF", text: "#3D6B47", dot: "#4F7C5A" },
};

export const BUSINESS_CRITICALITY_OPTIONS: BusinessCriticality[] = ["Critical", "High", "Medium", "Low"];

export const ASSETS: Asset[] = [
  { id: "AST-2024-0001", name: "حاسوب مكتبي Dell OptiPlex 7090", category: "أجهزة حاسوب",    type: "حاسوب مكتبي",             department: "تقنية المعلومات",     location: "مبنى أ - الطابق 2",           status: "active",      businessCriticality: "Medium",   assignedTo: "أحمد محمد السعدي",       purchaseDate: "2023-03-15", warrantyExpiration: "2026-03-15", value: 4500,  serial: "SN-DEL-0001", model: "OptiPlex 7090",          manufacturer: "Dell",   supplier: "شركة الأنظمة المتقدمة لتقنية المعلومات" },
  { id: "AST-2024-0002", name: "طابعة HP LaserJet Pro M404n",    category: "أجهزة طباعة",     type: "طابعة ليزر",              department: "المالية",              location: "مبنى ب - الطابق 1",           status: "maintenance", businessCriticality: "Medium",   assignedTo: "سارة عبدالله الحربي",    purchaseDate: "2022-11-08", warrantyExpiration: "2026-08-20", value: 1800,  serial: "SN-HP-0002",  model: "LaserJet Pro M404n",     manufacturer: "HP",     supplier: "مؤسسة الحلول المكتبية" },
  { id: "AST-2024-0003", name: "جهاز عرض Epson EB-L200F",        category: "أجهزة عرض",       type: "جهاز عرض بيانات",         department: "الإدارة",              location: "قاعة الاجتماعات الكبرى",     status: "active",      businessCriticality: "Medium",   assignedTo: "خالد ناصر العمري",       purchaseDate: "2023-06-20", warrantyExpiration: "2027-06-20", value: 6200,  serial: "SN-EPS-0003", model: "EB-L200F",               manufacturer: "Epson",  supplier: "شركة تقنيات العرض الحديثة" },
  { id: "AST-2024-0004", name: "مكتب تنفيذي — طقم كامل",        category: "أثاث مكتبي",      type: "مكتب تنفيذي",             department: "الإدارة العليا",        location: "مبنى أ - الطابق 3",           status: "active",      businessCriticality: "Low",      assignedTo: "فيصل الحربي",            purchaseDate: "2021-09-01", warrantyExpiration: "2023-09-01", value: 3200,  serial: "SN-FRN-0004", model: "Executive Suite EX-500", manufacturer: "أثاث الرياض للمكاتب", supplier: "أثاث الرياض للمكاتب" },
  { id: "AST-2024-0005", name: "سيارة تويوتا كامري 2022",        category: "مركبات",           type: "سيارة ركاب",              department: "الخدمات اللوجستية",    location: "موقف السيارات الرئيسي",      status: "reserved",    businessCriticality: "High",     assignedTo: "قسم الخدمات",            purchaseDate: "2022-01-15", warrantyExpiration: "2026-08-01", value: 85000, serial: "SN-CAR-0005", model: "Camry 2022 GLE",         manufacturer: "Toyota", supplier: "شركة الجزيرة للسيارات" },
  { id: "AST-2024-0006", name: "خادم Dell PowerEdge R740",       category: "أجهزة خوادم",     type: "خادم Rack",               department: "تقنية المعلومات",      location: "غرفة الخوادم — المبنى ج",    status: "active",      businessCriticality: "Critical", assignedTo: "قسم تقنية المعلومات",    purchaseDate: "2023-01-10", warrantyExpiration: "2026-01-15", value: 45000, serial: "SN-SRV-0006", model: "PowerEdge R740",         manufacturer: "Dell",   supplier: "شركة الأنظمة المتقدمة لتقنية المعلومات" },
  { id: "AST-2024-0007", name: "مكيف مركزي ميدي إير 24000BTU",  category: "أجهزة تكييف",    type: "مكيف مركزي",              department: "الموارد البشرية",       location: "مبنى ب - الطابق 2",           status: "maintenance", businessCriticality: "High",     assignedTo: "",                        purchaseDate: "2020-07-12", warrantyExpiration: "2022-07-12", value: 5500,  serial: "SN-AC-0007",  model: "MDVI-24CRN1",            manufacturer: "Midea", supplier: "مؤسسة التبريد والتكييف المتحدة" },
  { id: "AST-2024-0008", name: "ماسح ضوئي Canon DR-C225W",       category: "أجهزة مسح",       type: "ماسح ضوئي مستندات",       department: "السجلات والأرشيف",     location: "مبنى أ - الطابق 1",           status: "active",      businessCriticality: "Medium",   assignedTo: "ليلى العمري",             purchaseDate: "2023-08-25", warrantyExpiration: "2027-02-25", value: 2100,  serial: "SN-SCN-0008", model: "DR-C225W",               manufacturer: "Canon", supplier: "شركة المستندات الرقمية" },
];

// ─────────────────────────────────────────────
// Asset History — لكل نوع حدث مظهره وحقوله الخاصة،
// بحيث تتم إضافة أنواع أحداث جديدة مستقبلاً دون تعديل واجهة العرض
// ─────────────────────────────────────────────

export const HISTORY_EVENT_META: Record<AssetHistoryEventType, {
  label: string;
  icon: LucideIcon;
  bg: string;
  text: string;
  getFields: (e: AssetHistoryEvent) => { label: string; value?: string }[];
}> = {
  created: {
    label: "إنشاء الأصل", icon: Plus, bg: "#EDF3EF", text: "#3D6B47",
    getFields: e => [
      { label: "بواسطة", value: e.performedBy },
      { label: "القسم",  value: e.department },
      { label: "الموقع", value: e.location },
      { label: "السبب",  value: e.reason },
    ],
  },
  assigned: {
    label: "إسناد", icon: User, bg: "#EEF0F8", text: "#2A3172",
    getFields: e => [
      { label: "بواسطة", value: e.performedBy },
      { label: "من",     value: e.from },
      { label: "إلى",    value: e.to },
      { label: "القسم",  value: e.department },
      { label: "السبب",  value: e.reason },
    ],
  },
  transferred: {
    label: "نقل", icon: ArrowLeftRight, bg: "#F0EFE9", text: "#4B5563",
    getFields: e => [
      { label: "المسؤول السابق",  value: e.from },
      { label: "المسؤول الحالي",  value: e.to },
      { label: "القسم السابق",    value: e.fromDepartment },
      { label: "القسم الحالي",    value: e.toDepartment },
      { label: "الموقع",          value: e.location },
      { label: "سبب النقل",       value: e.reason },
      { label: "تم النقل بواسطة", value: e.performedBy },
    ],
  },
  maintenance: {
    label: "صيانة", icon: Wrench, bg: "#FDF6ED", text: "#8B6914",
    getFields: e => [
      { label: "بواسطة", value: e.performedBy },
      { label: "القسم",  value: e.department },
      { label: "الموقع", value: e.location },
      { label: "السبب",  value: e.reason },
      { label: "النتيجة", value: e.result },
    ],
  },
  warranty: {
    label: "تحديث الضمان", icon: Shield, bg: "#FDF6ED", text: "#8B6914",
    getFields: e => [
      { label: "بواسطة", value: e.performedBy },
      { label: "السبب",  value: e.reason },
    ],
  },
  "status-changed": {
    label: "تغيير الحالة", icon: Tag, bg: "#F0EFE9", text: "#6B7280",
    getFields: e => [
      { label: "بواسطة", value: e.performedBy },
      { label: "من",     value: e.from },
      { label: "إلى",    value: e.to },
      { label: "السبب",  value: e.reason },
    ],
  },
  disposed: {
    label: "إخراج من الخدمة", icon: Archive, bg: "#FAEDED", text: "#9E3A3A",
    getFields: e => [
      { label: "بواسطة", value: e.performedBy },
      { label: "الموقع", value: e.location },
      { label: "السبب",  value: e.reason },
    ],
  },
};

export const ASSET_HISTORY: AssetHistoryEvent[] = [
  // AST-2024-0001 — حاسوب مكتبي Dell OptiPlex 7090
  { id: "AST-2024-0001-H1", assetId: "AST-2024-0001", type: "created",         timestamp: "2023-03-15T09:00:00", performedBy: "سارة المالكي",        department: "تقنية المعلومات", location: "المستودع الرئيسي",  reason: "استلام الجهاز من المورد وتسجيله في النظام" },
  { id: "AST-2024-0001-H2", assetId: "AST-2024-0001", type: "assigned",        timestamp: "2023-03-20T10:30:00", performedBy: "خالد الشهري",         from: "المستودع الرئيسي", to: "منيرة الشمري",             department: "المالية",         reason: "إسناد أولي لقسم المالية" },
  { id: "AST-2024-0001-H3", assetId: "AST-2024-0001", type: "transferred",     timestamp: "2024-02-10T11:15:00", performedBy: "خالد الشهري",         from: "منيرة الشمري",     to: "أحمد محمد السعدي",         fromDepartment: "المالية", toDepartment: "تقنية المعلومات", reason: "إعادة توزيع الأجهزة حسب الاحتياج التشغيلي" },
  { id: "AST-2024-0001-H4", assetId: "AST-2024-0001", type: "maintenance",     timestamp: "2024-05-05T13:00:00", performedBy: "فريق الدعم الفني",   department: "تقنية المعلومات", location: "مبنى أ - الطابق 2", reason: "استبدال قرص التخزين SSD بعد تدهور الأداء", notes: "تم إجراء فحص شامل للجهاز وتحديث البرامج", result: "تم استبدال القرص بنجاح واجتاز اختبار الأداء" },
  { id: "AST-2024-0001-H5", assetId: "AST-2024-0001", type: "warranty",        timestamp: "2024-05-06T09:00:00", performedBy: "فريق الدعم الفني",   reason: "تمديد فترة الضمان بعد أعمال الصيانة", notes: "الضمان الممتد ساري حتى 2026-05-06" },
  { id: "AST-2024-0001-H6", assetId: "AST-2024-0001", type: "status-changed",  timestamp: "2024-05-07T09:30:00", performedBy: "خالد الشهري",         from: "في الصيانة", to: "نشط", status: "active", reason: "استئناف العمل بعد اكتمال الصيانة" },

  // AST-2024-0002 — طابعة HP LaserJet Pro M404n
  { id: "AST-2024-0002-H1", assetId: "AST-2024-0002", type: "created",        timestamp: "2022-11-08T10:00:00", performedBy: "سارة المالكي",  department: "المالية", location: "مبنى ب - الطابق 1" },
  { id: "AST-2024-0002-H2", assetId: "AST-2024-0002", type: "assigned",       timestamp: "2022-11-12T09:00:00", performedBy: "خالد الشهري",   from: "المستودع الرئيسي", to: "سارة عبدالله الحربي", department: "المالية" },
  { id: "AST-2024-0002-H3", assetId: "AST-2024-0002", type: "maintenance",    timestamp: "2023-05-20T14:00:00", performedBy: "فريق الدعم الفني", reason: "تنظيف رأس الطباعة واستبدال خرطوشة الحبر", notes: "تمت الصيانة دون رصد أعطال إضافية", result: "تعمل الطابعة بكفاءة كاملة بعد الصيانة" },
  { id: "AST-2024-0002-H4", assetId: "AST-2024-0002", type: "status-changed", timestamp: "2024-06-01T09:15:00", performedBy: "خالد الشهري",   from: "نشط", to: "في الصيانة", status: "maintenance", reason: "عطل في وحدة التحميص يتطلب فحصاً فنياً" },

  // AST-2024-0003 — جهاز عرض Epson EB-L200F
  { id: "AST-2024-0003-H1", assetId: "AST-2024-0003", type: "created",    timestamp: "2023-06-20T09:00:00", performedBy: "سارة المالكي", department: "المالية", location: "مبنى ب - الطابق 1" },
  { id: "AST-2024-0003-H2", assetId: "AST-2024-0003", type: "assigned",   timestamp: "2023-06-25T09:30:00", performedBy: "خالد الشهري",  from: "المستودع الرئيسي", to: "فهد الزهراني", department: "المالية" },
  { id: "AST-2024-0003-H3", assetId: "AST-2024-0003", type: "transferred", timestamp: "2024-06-15T08:55:00", performedBy: "سارة المالكي", from: "فهد الزهراني", to: "خالد ناصر العمري", fromDepartment: "المالية", toDepartment: "الإدارة", location: "قاعة الاجتماعات الكبرى", reason: "إعادة توزيع الأجهزة حسب الاحتياج" },

  // AST-2024-0004 — مكتب تنفيذي
  { id: "AST-2024-0004-H1", assetId: "AST-2024-0004", type: "created",  timestamp: "2021-09-01T09:00:00", performedBy: "سارة المالكي", department: "الإدارة العليا", location: "مبنى أ - الطابق 3" },
  { id: "AST-2024-0004-H2", assetId: "AST-2024-0004", type: "assigned", timestamp: "2021-09-05T10:00:00", performedBy: "خالد الشهري",  from: "المستودع الرئيسي", to: "فيصل الحربي", department: "الإدارة العليا" },

  // AST-2024-0005 — سيارة تويوتا كامري 2022
  { id: "AST-2024-0005-H1", assetId: "AST-2024-0005", type: "created",        timestamp: "2022-01-15T09:00:00", performedBy: "سارة المالكي",       department: "الخدمات اللوجستية", location: "موقف السيارات الرئيسي" },
  { id: "AST-2024-0005-H2", assetId: "AST-2024-0005", type: "assigned",       timestamp: "2022-01-20T09:30:00", performedBy: "خالد الشهري",        from: "المستودع الرئيسي", to: "قسم الخدمات", department: "الخدمات اللوجستية" },
  { id: "AST-2024-0005-H3", assetId: "AST-2024-0005", type: "maintenance",    timestamp: "2023-04-10T08:00:00", performedBy: "ورشة الصيانة المعتمدة", reason: "صيانة دورية عند 20,000 كم", notes: "فحص شامل واستبدال الزيوت والفلاتر", result: "تم إنجاز الصيانة الدورية دون ملاحظات" },
  { id: "AST-2024-0005-H4", assetId: "AST-2024-0005", type: "status-changed", timestamp: "2024-05-01T09:00:00", performedBy: "قسم الخدمات",        from: "نشط", to: "محجوز", status: "reserved", reason: "حجز السيارة لاستخدام إداري خاص لمدة أسبوعين" },

  // AST-2024-0006 — خادم Dell PowerEdge R740
  { id: "AST-2024-0006-H1", assetId: "AST-2024-0006", type: "created",     timestamp: "2023-01-10T09:00:00", performedBy: "سارة المالكي",     department: "تقنية المعلومات", location: "غرفة الخوادم — المبنى ج" },
  { id: "AST-2024-0006-H2", assetId: "AST-2024-0006", type: "assigned",    timestamp: "2023-01-15T10:00:00", performedBy: "خالد الشهري",      from: "المستودع الرئيسي", to: "قسم تقنية المعلومات", department: "تقنية المعلومات" },
  { id: "AST-2024-0006-H3", assetId: "AST-2024-0006", type: "warranty",    timestamp: "2023-01-15T10:30:00", performedBy: "خالد الشهري",      reason: "تسجيل بيانات الضمان عند التركيب", notes: "ضمان Dell لمدة 3 سنوات ساري حتى 2026-01-15" },
  { id: "AST-2024-0006-H4", assetId: "AST-2024-0006", type: "maintenance", timestamp: "2024-02-20T11:00:00", performedBy: "فريق الدعم الفني", reason: "تحديث البرامج الثابتة (Firmware) والتحقق من أداء الأقراص", result: "تم تحديث البرامج الثابتة وتأكيد استقرار الأداء" },
  { id: "AST-2024-0006-H5", assetId: "AST-2024-0006", type: "warranty",    timestamp: "2024-06-01T09:00:00", performedBy: "النظام",           reason: "تنبيه تلقائي بقرب انتهاء فترة الضمان", notes: "ينتهي الضمان خلال 30 يوماً — يُنصح بالتجديد" },

  // AST-2024-0007 — مكيف مركزي
  { id: "AST-2024-0007-H1", assetId: "AST-2024-0007", type: "created",        timestamp: "2020-07-12T09:00:00", performedBy: "سارة المالكي", department: "الموارد البشرية", location: "مبنى ب - الطابق 2" },
  { id: "AST-2024-0007-H2", assetId: "AST-2024-0007", type: "assigned",       timestamp: "2020-07-15T09:30:00", performedBy: "خالد الشهري",  from: "المستودع الرئيسي", to: "قسم الصيانة العامة", department: "الموارد البشرية" },
  { id: "AST-2024-0007-H3", assetId: "AST-2024-0007", type: "maintenance",    timestamp: "2022-08-01T10:00:00", performedBy: "ورشة الصيانة المعتمدة", reason: "إعادة تعبئة غاز التبريد", result: "تمت إعادة التبريد إلى المستوى الطبيعي" },
  { id: "AST-2024-0007-H4", assetId: "AST-2024-0007", type: "status-changed", timestamp: "2024-06-10T09:00:00", performedBy: "خالد الشهري",  from: "نشط", to: "في الصيانة", status: "maintenance", reason: "توقف الوحدة عن العمل — يحتاج فحص الضاغط", notes: "تم رفع طلب صيانة عاجل" },

  // AST-2024-0008 — ماسح ضوئي Canon DR-C225W
  { id: "AST-2024-0008-H1", assetId: "AST-2024-0008", type: "created",  timestamp: "2024-06-15T09:14:22", performedBy: "محمد العتيبي", department: "السجلات والأرشيف", location: "مبنى أ - الطابق 1", reason: "إضافة الجهاز للنظام بعد الاستلام" },
  { id: "AST-2024-0008-H2", assetId: "AST-2024-0008", type: "assigned", timestamp: "2024-06-16T09:00:00", performedBy: "خالد الشهري", from: "المستودع الرئيسي", to: "ليلى العمري", department: "السجلات والأرشيف" },
];

export const KPI_DATA = [
  { label: "إجمالي الأصول",   value: "2,847", change: "+12%", up: true,  icon: Package,        color: "#2A3172", bg: "#EEF0F8" },
  { label: "الأصول النشطة",   value: "2,391", change: "+8%",  up: true,  icon: CheckCircle,    color: "#4F7C5A", bg: "#EDF3EF" },
  { label: "قيد الصيانة",     value: "183",   change: "-3%",  up: false, icon: Clock,          color: "#D0A165", bg: "#FDF6ED" },
  { label: "نقل هذا الشهر",   value: "64",    change: "+21%", up: true,  icon: ArrowLeftRight, color: "#3D4589", bg: "#EEF0F8" },
];

export const MONTHLY = [
  { m: "يناير", إضافات: 45, نقل: 23, صيانة: 12 },
  { m: "فبراير", إضافات: 38, نقل: 31, صيانة: 18 },
  { m: "مارس",   إضافات: 62, نقل: 28, صيانة: 9  },
  { m: "أبريل",  إضافات: 51, نقل: 19, صيانة: 22 },
  { m: "مايو",   إضافات: 78, نقل: 41, صيانة: 14 },
  { m: "يونيو",  إضافات: 44, نقل: 35, صيانة: 11 },
];

export const DEPT_PIE = [
  { name: "تقنية المعلومات", value: 485, color: "#2A3172" },
  { name: "الإدارة",          value: 312, color: "#3D4589" },
  { name: "المالية",          value: 278, color: "#D0A165" },
  { name: "الموارد البشرية",  value: 195, color: "#4F7C5A" },
  { name: "الخدمات",          value: 241, color: "#6B7280" },
  { name: "أخرى",             value: 336, color: "#9CA3AF" },
];

export const USERS = [
  { id: 1, name: "محمد العتيبي",    email: "m.otaibi@org.sa",  role: "مدير النظام",    department: "تقنية المعلومات", status: "active"   as const, lastLogin: "اليوم، 09:14"   },
  { id: 2, name: "سارة المالكي",    email: "s.malki@org.sa",   role: "مشرف أصول",      department: "المالية",          status: "active"   as const, lastLogin: "أمس، 16:32"     },
  { id: 3, name: "خالد الشهري",     email: "k.shahri@org.sa",  role: "مدخل بيانات",    department: "السجلات",          status: "active"   as const, lastLogin: "اليوم، 08:05"   },
  { id: 4, name: "نورة الزهراني",   email: "n.zahrani@org.sa", role: "مراجع",           department: "الإدارة",          status: "inactive" as const, lastLogin: "منذ أسبوعين"   },
  { id: 5, name: "عبدالله الغامدي", email: "a.ghamdi@org.sa",  role: "مشرف أصول",      department: "الموارد البشرية",  status: "active"   as const, lastLogin: "اليوم، 11:47"   },
];

export const AUDIT_LOGS = [
  { id: 1, time: "2024-06-15 09:14:22", user: "محمد العتيبي", action: "إضافة أصل",    entity: "AST-2024-0008", details: "تم إضافة ماسح ضوئي Canon DR-C225W",              type: "create" },
  { id: 2, time: "2024-06-15 08:55:10", user: "سارة المالكي",  action: "نقل أصل",     entity: "AST-2024-0003", details: "نقل من قسم المالية إلى قسم الإدارة",             type: "update" },
  { id: 3, time: "2024-06-14 15:33:01", user: "خالد الشهري",  action: "تعديل أصل",   entity: "AST-2024-0001", details: "تحديث بيانات الموقع والمسؤول",                    type: "update" },
  { id: 4, time: "2024-06-14 11:20:44", user: "نورة الزهراني", action: "تسجيل دخول", entity: "—",             details: "تسجيل دخول من عنوان IP: 10.0.1.45",              type: "auth"   },
  { id: 5, time: "2024-06-14 10:05:18", user: "محمد العتيبي", action: "تعطيل مستخدم", entity: "USR-0012",     details: "تم إيقاف حساب المستخدم مؤقتاً لانتهاك السياسة", type: "delete" },
];

export const NOTIFICATIONS = [
  { id: 1, title: "طلب نقل أصل معلق",        body: "طلب نقل حاسوب مكتبي من قسم التقنية — بانتظار موافقتك",                    time: "منذ 15 دقيقة", read: false, type: "warning" },
  { id: 2, title: "اكتملت عملية الصيانة",    body: "أنهت وحدة الصيانة العمل على الطابعة HP LaserJet — جاهزة للتسليم",         time: "منذ ساعة",     read: false, type: "success" },
  { id: 3, title: "تنبيه: انتهاء ضمان أصل", body: "ينتهي ضمان الخادم Dell PowerEdge R740 خلال 30 يوماً",                     time: "منذ 3 ساعات",  read: true,  type: "info"    },
  { id: 4, title: "تم اعتماد طلب الشراء",    body: "اعتمد مدير المالية طلب شراء معدات القسم الجديدة بقيمة 48,000 ريال",      time: "أمس",          read: true,  type: "success" },
];

export const AI_INIT = [
  { role: "assistant" as const, content: "مرحباً، أنا مساعد نظام حصر الأصول الذكي. يمكنني مساعدتك في البحث عن الأصول، تتبع الحركات، استعراض التقارير، وتحليل بيانات الجرد. كيف يمكنني مساعدتك اليوم؟" },
];

export const AI_SUGGESTIONS = [
  "كم عدد الأصول النشطة في قسم تقنية المعلومات؟",
  "أظهر لي آخر عمليات النقل هذا الشهر",
  "ما هي الأصول التي انتهت صلاحية ضمانها؟",
  "قائمة الأصول المعطلة في مبنى أ",
];


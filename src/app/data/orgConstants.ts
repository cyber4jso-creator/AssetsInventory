// ─────────────────────────────────────────────
// Organizational structure — stable IDs for mock data
// ─────────────────────────────────────────────

export interface OrgSector {
  id: string;
  name: string;
}

export interface OrgDepartment {
  id: string;
  name: string;
  sectorId: string;
}

export const ORG_SECTORS: OrgSector[] = [
  { id: "SEC-TECH", name: "قطاع التقنية والعمليات" },
  { id: "SEC-CORP", name: "قطاع الإدارة والمالية" },
];

export const ORG_DEPARTMENTS: OrgDepartment[] = [
  { id: "DEPT-IT",    name: "تقنية المعلومات",     sectorId: "SEC-TECH" },
  { id: "DEPT-HR",    name: "الموارد البشرية",     sectorId: "SEC-TECH" },
  { id: "DEPT-ARCH",  name: "السجلات والأرشيف",    sectorId: "SEC-TECH" },
  { id: "DEPT-FIN",   name: "المالية",              sectorId: "SEC-CORP" },
  { id: "DEPT-ADMIN", name: "الإدارة",              sectorId: "SEC-CORP" },
  { id: "DEPT-EXEC",  name: "الإدارة العليا",       sectorId: "SEC-CORP" },
  { id: "DEPT-LOG",   name: "الخدمات اللوجستية",   sectorId: "SEC-CORP" },
];

export function getDepartmentById(id: string): OrgDepartment | undefined {
  return ORG_DEPARTMENTS.find(d => d.id === id);
}

export function getSectorById(id: string): OrgSector | undefined {
  return ORG_SECTORS.find(s => s.id === id);
}

export function getDepartmentsBySector(sectorId: string): OrgDepartment[] {
  return ORG_DEPARTMENTS.filter(d => d.sectorId === sectorId);
}

import { CheckCircle, XCircle } from "lucide-react";
import { Card } from "../../components/shared";
import { ROLE_PERMISSIONS, ROLE_LABELS, PERMISSION_LABELS } from "../../auth";
import type { Role, Permission } from "../../auth";

// ─────────────────────────────────────────────
// Roles & Permissions — مصفوفة حية من إعداد RBAC المركزي
// ─────────────────────────────────────────────

const ROLES = Object.keys(ROLE_PERMISSIONS) as Role[];
const PERMISSIONS = Object.keys(PERMISSION_LABELS) as Permission[];

export function RolesScreen() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2B2B]">الأدوار والصلاحيات</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">مصفوفة الصلاحيات الفعلية المطبّقة في النظام لكل دور</p>
        </div>
      </div>
      <Card p={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                <th className="text-right text-xs text-[#6B7280] font-medium px-5 py-3 min-w-44">الصلاحية</th>
                {ROLES.map(r => (
                  <th key={r} className="text-center text-xs text-[#6B7280] font-medium px-4 py-3 min-w-32">{ROLE_LABELS[r]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map(p => (
                <tr key={p} className="border-b border-[#F7F6F3] hover:bg-[#FAFAF9] last:border-0">
                  <td className="px-5 py-3.5 text-sm text-[#2B2B2B] font-medium">{PERMISSION_LABELS[p]}</td>
                  {ROLES.map(r => (
                    <td key={r} className="px-4 py-3.5 text-center">
                      {ROLE_PERMISSIONS[r].includes(p)
                        ? <CheckCircle size={16} className="mx-auto text-[#4F7C5A]" />
                        : <XCircle    size={16} className="mx-auto text-[#E5E7EB]" />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

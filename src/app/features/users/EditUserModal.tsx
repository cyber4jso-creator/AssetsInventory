import { useEffect, useMemo, useState } from "react";
import type { Role } from "../../auth";
import { ROLE_LABELS } from "../../auth";
import { Btn, Inp, Modal, Sel } from "../../components/shared";
import {
  ORG_SECTORS,
  getDepartmentById,
  getDepartmentsBySector,
} from "../../data/orgConstants";
import {
  ROLE_IDS,
  type UserRecord,
} from "./contexts/UsersDataContext";

const ROLE_OPTIONS = Object.keys(ROLE_LABELS) as Role[];

interface EditUserModalProps {
  open: boolean;
  user: UserRecord | null;
  onOpenChange: (open: boolean) => void;
}

function getRoleFromId(roleId: number | null): Role | "" {
  if (roleId === null) return "";

  const match = Object.entries(ROLE_IDS).find(
    ([, currentRoleId]) => currentRoleId === roleId,
  );

  return (match?.[0] as Role | undefined) ?? "";
}

export function EditUserModal({
  open,
  user,
  onOpenChange,
}: EditUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [sectorId, setSectorId] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    if (!open || !user) return;

    const currentDepartment = getDepartmentById(user.departmentId);

    setFullName(user.name);
    setEmail(user.email);
    setRole(getRoleFromId(user.roleId));
    setSectorId(currentDepartment?.sectorId ?? "");
    setDepartmentId(user.departmentId);
  }, [open, user]);

  const departmentOptions = useMemo(
    () => (sectorId ? getDepartmentsBySector(sectorId) : []),
    [sectorId],
  );

  const hasLegacyDepartment =
    Boolean(user?.departmentId) &&
    !getDepartmentById(user?.departmentId ?? "");

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="تعديل المستخدم"
      description="تحديث بيانات المستخدم وصلاحياته التنظيمية"
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[#D0A165]/40 bg-[#FDF6ED] px-3 py-2">
          <p className="text-xs text-[#6B5A38]">
            تعديل بيانات المستخدم غير متاح حاليًا حتى يتم توفير واجهة التحديث في الخادم.
          </p>
        </div>

        <div>
          <Inp
            label="الاسم الكامل"
            required
            value={fullName}
          />
        </div>

        <div>
          <Inp
            label="البريد الإلكتروني"
            required
            type="email"
            value={email}
          />
        </div>

        <div>
          <Sel
            label="الدور"
            required
            placeholder="اختر الدور"
            options={ROLE_OPTIONS.map(
              (roleOption) => ROLE_LABELS[roleOption],
            )}
            value={role ? ROLE_LABELS[role] : undefined}
          />
        </div>

        {hasLegacyDepartment && (
          <div className="rounded-lg border border-[#D0A165]/40 bg-[#D0A165]/10 px-3 py-2">
            <p className="text-xs text-[#6B5A38]">
              القسم الحالي محفوظ بقيمة قديمة:{" "}
              <strong>{user?.departmentId}</strong>.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Sel
              label="القطاع"
              placeholder="اختر القطاع"
              options={ORG_SECTORS.map((sector) => sector.name)}
              value={
                ORG_SECTORS.find(
                  (sector) => sector.id === sectorId,
                )?.name
              }
            />
          </div>

          <div>
            <Sel
              label="القسم"
              required
              placeholder={
                sectorId
                  ? "اختر القسم"
                  : "اختر القطاع أولاً"
              }
              options={departmentOptions.map(
                (department) => department.name,
              )}
              value={
                departmentOptions.find(
                  (department) =>
                    department.id === departmentId,
                )?.name
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Btn variant="primary" disabled>
            حفظ التعديلات
          </Btn>

          <Btn
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

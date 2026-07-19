import { useEffect, useState } from "react";
import type { Role } from "../../auth";
import { ROLE_LABELS } from "../../auth";
import { Modal, Btn, Inp, Sel, toast } from "../../components/shared";
import { ORG_SECTORS, getDepartmentsBySector } from "../../data/orgConstants";
import { useUsersData } from "./contexts/UsersDataContext";

const ROLE_OPTIONS = Object.keys(ROLE_LABELS) as Role[];
const STATUS_OPTIONS: { value: "active" | "inactive"; label: string }[] = [
  { value: "active",   label: "نشط" },
  { value: "inactive", label: "غير نشط" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AddUserModal({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { isDuplicateEmail, addUser } = useUsersData();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [sectorId, setSectorId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFirstName(""); setEmail(""); setRole(""); setSectorId(""); setDepartmentId("");
      setStatus("active"); setErrors({});
    }
  }, [open]);

  const departmentOptions = sectorId ? getDepartmentsBySector(sectorId) : [];

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!firstName.trim()) nextErrors.firstName = "أدخل الاسم الأول";
    if (!email.trim()) nextErrors.email = "أدخل البريد الإلكتروني";
    else if (!EMAIL_RE.test(email.trim())) nextErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    else if (isDuplicateEmail(email)) nextErrors.email = "هذا البريد الإلكتروني مستخدم بالفعل";
    if (!role) nextErrors.role = "اختر الدور";
    if (!sectorId) nextErrors.sectorId = "اختر القطاع";
    if (!departmentId) nextErrors.departmentId = "اختر القسم";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("تعذّر إضافة المستخدم", "يرجى تصحيح الحقول المطلوبة");
      return;
    }

    try {
      await addUser({
        firstName: firstName.trim(),
        email: email.trim(),
        role: role as Role,
        departmentId,
        status,
      });
    
      toast.success(
        "تمت إضافة المستخدم بنجاح",
        `${firstName} — ${ROLE_LABELS[role as Role]}`,
      );
    
      onOpenChange(false);
    } catch (error) {
      console.error("Create user error:", error);
    
      toast.error(
        "تعذرت إضافة المستخدم",
        "تحققي من البيانات واتصال الخادم",
      );
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="إضافة مستخدم" description="أدخل بيانات المستخدم الجديد">
      <div className="space-y-4">
        <div>
          <Inp label="الاسم الأول" required placeholder="مثال: أحمد" value={firstName} onChange={setFirstName} />
          {errors.firstName && <p className="text-xs text-[#C44D4D] mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <Inp label="البريد الإلكتروني" required type="email" placeholder="user@org.sa" value={email} onChange={setEmail} />
          {errors.email && <p className="text-xs text-[#C44D4D] mt-1">{errors.email}</p>}
        </div>

        <div>
          <Sel
            label="الدور" required placeholder="اختر الدور"
            options={ROLE_OPTIONS.map(r => ROLE_LABELS[r])}
            value={role ? ROLE_LABELS[role] : undefined}
            onChange={label => setRole(ROLE_OPTIONS.find(r => ROLE_LABELS[r] === label) ?? "")}
          />
          {errors.role && <p className="text-xs text-[#C44D4D] mt-1">{errors.role}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Sel
              label="القطاع" required placeholder="اختر القطاع"
              options={ORG_SECTORS.map(s => s.name)}
              value={ORG_SECTORS.find(s => s.id === sectorId)?.name}
              onChange={name => {
                setSectorId(ORG_SECTORS.find(s => s.name === name)?.id ?? "");
                setDepartmentId("");
              }}
            />
            {errors.sectorId && <p className="text-xs text-[#C44D4D] mt-1">{errors.sectorId}</p>}
          </div>
          <div>
            <Sel
              label="القسم" required placeholder={sectorId ? "اختر القسم" : "اختر القطاع أولاً"}
              options={departmentOptions.map(d => d.name)}
              value={departmentOptions.find(d => d.id === departmentId)?.name}
              onChange={name => setDepartmentId(departmentOptions.find(d => d.name === name)?.id ?? "")}
            />
            {errors.departmentId && <p className="text-xs text-[#C44D4D] mt-1">{errors.departmentId}</p>}
          </div>
        </div>

        <Sel
          label="الحالة" required
          options={STATUS_OPTIONS.map(s => s.label)}
          value={STATUS_OPTIONS.find(s => s.value === status)?.label}
          onChange={label => setStatus(STATUS_OPTIONS.find(s => s.label === label)?.value ?? "active")}
        />

        <div className="flex items-center gap-3 pt-2">
          <Btn variant="primary" onClick={handleSubmit}>إضافة المستخدم</Btn>
          <Btn variant="secondary" onClick={() => onOpenChange(false)}>إلغاء</Btn>
        </div>
      </div>
    </Modal>
  );
}

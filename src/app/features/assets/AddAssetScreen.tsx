import { useEffect, useState } from "react";
import { ChevronRight, CheckCircle, Upload } from "lucide-react";
import type { Asset, NavigateFn } from "../../types";
import { BUSINESS_CRITICALITY_OPTIONS } from "../../data/mock";
import { ORG_DEPARTMENTS, getDepartmentById } from "../../data/orgConstants";
import { Btn, Card, Inp, Sel, toast } from "../../components/shared";
import { useAssetsData } from "./contexts/AssetsDataContext";
import { useUsersData } from "../users/contexts/UsersDataContext";

const CATEGORY_OPTIONS = [
  "نظام",
  "تطبيق",
  "شبكة",
  "دائرة",
  "ترخيص",
] as const;
const BUILDING_OPTIONS = ["مبنى أ","مبنى ب","مبنى ج","مبنى د","خارج الموقع"];

function splitLocation(location?: string): { building: string; room: string } {
  if (!location) return { building: "", room: "" };
  const [building, ...rest] = location.split(" - ");
  return { building: BUILDING_OPTIONS.includes(building) ? building : "", room: rest.join(" - ") || (BUILDING_OPTIONS.includes(building) ? "" : location) };
}

function buildFormFromAsset(asset: Asset | undefined) {
  const { building, room } = splitLocation(asset?.location);
  return {
    name: asset?.name ?? "",
    serial: asset?.serial ?? "",
    model: asset?.model ?? "",
    category: asset?.category ?? "",
    criticality: asset?.businessCriticality ?? "",
    manufacturer: asset?.manufacturer ?? "",
    departmentId: asset?.departmentId ?? "",
    building,
    room,
    assignedUserId: asset?.assignedUserId ?? "",
    purchaseDate: asset?.purchaseDate ?? "",
    value: asset?.value != null ? String(asset.value) : "",
    warrantyExpiration: asset?.warrantyExpiration ?? "",
  };
}

// ─────────────────────────────────────────────
// Add / Edit Asset
// ─────────────────────────────────────────────

export function AddAssetScreen({ onNavigate, assetId }: { onNavigate: NavigateFn; assetId?: string | null }) {
  const [section, setSection] = useState("basic");
  const { assets, addAsset, updateAsset } = useAssetsData();
  const { users: apiUsers } = useUsersData();
  const asset = assetId ? assets.find(a => a.id === assetId) : undefined;
  const [form, setForm] = useState(() => buildFormFromAsset(asset));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(buildFormFromAsset(asset));
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId]);

  const set = (key: keyof typeof form) => (value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const steps = [
    { id: "basic",     label: "البيانات الأساسية", num: "01" },
    { id: "location",  label: "الموقع والتعيين",   num: "02" },
    { id: "financial", label: "البيانات المالية",  num: "03" },
    { id: "notes",     label: "ملاحظات ومرفقات",   num: "04" },
  ];

  const handleSave = async () => {
    if (saving) return;

    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "أدخل اسم الأصل";
    if (!form.category) nextErrors.category = "اختر فئة الأصل";
    if (!form.criticality) nextErrors.criticality = "اختر Business Criticality";
    if (!form.departmentId) nextErrors.departmentId = "اختر القسم المسؤول";
    if (!form.building) nextErrors.building = "اختر المبنى";
    if (!form.room.trim()) nextErrors.room = "أدخل الطابق / الغرفة";
    if (!form.purchaseDate) nextErrors.purchaseDate = "أدخل تاريخ الشراء";
    if (!form.value.trim() || Number.isNaN(Number(form.value))) nextErrors.value = "أدخل قيمة شراء صحيحة";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSection("basic");
      toast.error("تعذّر الحفظ", "يرجى تصحيح الحقول المطلوبة في جميع الأقسام");
      return;
    }

    const input = {
      name: form.name.trim(),
      serial: form.serial.trim(),
      model: form.model.trim(),
      category: form.category as (typeof CATEGORY_OPTIONS)[number],
      businessCriticality: form.criticality as (typeof BUSINESS_CRITICALITY_OPTIONS)[number],
      manufacturer: form.manufacturer.trim(),
      departmentId: form.departmentId,
      location: `${form.building} - ${form.room.trim()}`,
      assignedUserId: form.assignedUserId || null,
      purchaseDate: form.purchaseDate,
      warrantyExpiration: form.warrantyExpiration,
      value: Number(form.value),
    };

    setSaving(true);

    try {
      if (asset) {
        updateAsset(asset.id, input);
        toast.success("تم حفظ التعديلات بنجاح", asset.name);
      } else {
        const createdAssetId = await addAsset(input);
        toast.success("تمت إضافة الأصل بنجاح", createdAssetId);
      }
      onNavigate("assets");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "حدث خطأ غير متوقع أثناء حفظ الأصل";

      toast.error("تعذّر الحفظ", message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
        <button onClick={() => onNavigate("assets")} className="hover:text-[#2A3172] transition-colors">قائمة الأصول</button>
        <ChevronRight size={14} className="rotate-180" />
        <span className="text-[#2B2B2B] font-medium">{asset ? "تعديل الأصل" : "إضافة أصل جديد"}</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[#2B2B2B]">{asset ? `تعديل: ${asset.name}` : "إضافة أصل جديد"}</h1>
        <p className="text-sm text-[#6B7280] mt-0.5">
          {asset ? `تحديث بيانات الأصل ${asset.id}` : "أدخل بيانات الأصل في الحقول أدناه"}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {steps.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${section === s.id ? "bg-[#2A3172] text-white font-medium" : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#2A3172] hover:text-[#2A3172]"}`}>
            <span className="font-mono text-xs opacity-60">{s.num}</span>
            {s.label}
          </button>
        ))}
      </div>

      <Card>
        {section === "basic" && (
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-5">البيانات الأساسية للأصل</h3>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <Inp label="اسم الأصل" placeholder="مثال: حاسوب مكتبي Dell OptiPlex" required value={form.name} onChange={set("name")} />
                {errors.name && <p className="text-xs text-[#C44D4D] mt-1">{errors.name}</p>}
              </div>
              <Inp label="الرقم التسلسلي"  placeholder="SN-XXXX-0000" value={form.serial} onChange={set("serial")} />
              <Inp label="رقم الموديل"     placeholder="رقم الموديل أو الطراز" value={form.model} onChange={set("model")} />
              <div>
                <Sel label="فئة الأصل" required options={[...CATEGORY_OPTIONS]} placeholder="اختر الفئة" value={form.category} onChange={set("category")} />
                {errors.category && <p className="text-xs text-[#C44D4D] mt-1">{errors.category}</p>}
              </div>
              <div>
                <Sel label="Business Criticality" required options={[...BUSINESS_CRITICALITY_OPTIONS]} placeholder="Select criticality" value={form.criticality} onChange={set("criticality")} />
                {errors.criticality && <p className="text-xs text-[#C44D4D] mt-1">{errors.criticality}</p>}
              </div>
              <Inp label="الشركة المصنّعة" placeholder="مثال: Dell, HP, Canon" value={form.manufacturer} onChange={set("manufacturer")} />
            </div>
          </div>
        )}

        {section === "location" && (
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-5">الموقع والتعيين</h3>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <Sel
                  label="القسم المسؤول" required placeholder="اختر القسم"
                  options={ORG_DEPARTMENTS.map(d => d.name)}
                  value={getDepartmentById(form.departmentId)?.name}
                  onChange={name => set("departmentId")(ORG_DEPARTMENTS.find(d => d.name === name)?.id ?? "")}
                />
                {errors.departmentId && <p className="text-xs text-[#C44D4D] mt-1">{errors.departmentId}</p>}
              </div>
              <div>
                <Sel label="المبنى" required options={BUILDING_OPTIONS} placeholder="اختر المبنى" value={form.building} onChange={set("building")} />
                {errors.building && <p className="text-xs text-[#C44D4D] mt-1">{errors.building}</p>}
              </div>
              <div>
                <Inp label="الطابق / الغرفة" placeholder="مثال: الطابق 2، غرفة 201" required value={form.room} onChange={set("room")} />
                {errors.room && <p className="text-xs text-[#C44D4D] mt-1">{errors.room}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#2B2B2B]">المسؤول المباشر</label>
                <select
                  value={form.assignedUserId}
                  onChange={e => set("assignedUserId")(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#2B2B2B] text-sm
                    focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165] transition-all appearance-none cursor-pointer"
                >
                  <option value="">غير مسند</option>
                  {apiUsers.filter(u => u.status === "active").map(u => (
                    <option key={u.apiId} value={u.apiId}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {section === "financial" && (
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-5">البيانات المالية</h3>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <Inp label="تاريخ الشراء"               type="date" required value={form.purchaseDate} onChange={set("purchaseDate")} />
                {errors.purchaseDate && <p className="text-xs text-[#C44D4D] mt-1">{errors.purchaseDate}</p>}
              </div>
              <div>
                <Inp label="قيمة الشراء (ريال سعودي)"  type="number" placeholder="0.00" required value={form.value} onChange={set("value")} />
                {errors.value && <p className="text-xs text-[#C44D4D] mt-1">{errors.value}</p>}
              </div>
              <Sel label="سنوات الإهلاك" options={["3 سنوات","5 سنوات","7 سنوات","10 سنوات","لا ينطبق"]} placeholder="اختر" />
              <Inp label="رقم فاتورة الشراء"          placeholder="رقم الفاتورة" />
              <Inp label="تاريخ انتهاء الضمان"        type="date" value={form.warrantyExpiration} onChange={set("warrantyExpiration")} />
              <Sel label="مصدر التمويل" options={["الميزانية التشغيلية","مشروع رأسمالي","هبة","تبرع","أخرى"]} placeholder="اختر" />
            </div>
          </div>
        )}

        {section === "notes" && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-[#2B2B2B]">ملاحظات ومرفقات</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#2B2B2B]">ملاحظات إضافية</label>
              <textarea rows={4} placeholder="أضف أي ملاحظات أو معلومات إضافية حول هذا الأصل..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#2B2B2B] text-sm
                  placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165] resize-none transition-all" />
            </div>
            <button
              type="button"
              onClick={() => toast.deferred("رفع مرفقات الأصل")}
              className="w-full border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center
              hover:border-[#2A3172] hover:bg-[#F7F6F3] transition-all cursor-pointer">
              <Upload size={22} className="mx-auto text-[#9CA3AF] mb-2" />
              <p className="text-sm text-[#6B7280]">رفع المستندات المرفقة (فاتورة، ضمان، صور)</p>
              <p className="text-xs text-[#6B7280] mt-1">PDF, DOCX, JPG — الحجم الأقصى 20MB لكل ملف</p>
            </button>
          </div>
        )}
      </Card>

      <div className="flex items-center gap-3">
        <Btn
          variant="primary"
          icon={<CheckCircle size={15} />}
          disabled={saving}
          onClick={() => void handleSave()}
        >
          {saving ? "جارٍ الحفظ..." : asset ? "حفظ التعديلات" : "حفظ الأصل"}
        </Btn>
        <Btn variant="secondary" onClick={() => onNavigate("assets")}>إلغاء</Btn>
      </div>
    </div>
  );
}

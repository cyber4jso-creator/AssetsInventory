import { useState } from "react";
import { ChevronRight, CheckCircle, Upload } from "lucide-react";
import type { NavigateFn } from "../../types";
import { ASSETS, BUSINESS_CRITICALITY_OPTIONS } from "../../data/mock";
import { Btn, Card, Inp, Sel } from "../../components/shared";

// ─────────────────────────────────────────────
// Add / Edit Asset
// ─────────────────────────────────────────────

export function AddAssetScreen({ onNavigate, assetId }: { onNavigate: NavigateFn; assetId?: string | null }) {
  const [section, setSection] = useState("basic");
  const asset = assetId ? ASSETS.find(a => a.id === assetId) : undefined;
  const steps = [
    { id: "basic",     label: "البيانات الأساسية", num: "01" },
    { id: "location",  label: "الموقع والتعيين",   num: "02" },
    { id: "financial", label: "البيانات المالية",  num: "03" },
    { id: "notes",     label: "ملاحظات ومرفقات",   num: "04" },
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-[#8B7F72]">
        <button onClick={() => onNavigate("assets")} className="hover:text-[#556B2F] transition-colors">قائمة الأصول</button>
        <ChevronRight size={14} className="rotate-180" />
        <span className="text-[#3E3124] font-medium">{asset ? "تعديل الأصل" : "إضافة أصل جديد"}</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[#3E3124]">{asset ? `تعديل: ${asset.name}` : "إضافة أصل جديد"}</h1>
        <p className="text-sm text-[#8B7F72] mt-0.5">
          {asset ? `تحديث بيانات الأصل ${asset.id}` : "أدخل بيانات الأصل في الحقول أدناه"}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {steps.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${section === s.id ? "bg-[#556B2F] text-white font-medium" : "bg-white border border-[#D8D3C8] text-[#8B7F72] hover:border-[#556B2F] hover:text-[#556B2F]"}`}>
            <span className="font-mono text-xs opacity-60">{s.num}</span>
            {s.label}
          </button>
        ))}
      </div>

      <Card>
        {section === "basic" && (
          <div>
            <h3 className="text-sm font-semibold text-[#3E3124] mb-5">البيانات الأساسية للأصل</h3>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2"><Inp label="اسم الأصل" placeholder="مثال: حاسوب مكتبي Dell OptiPlex" required /></div>
              <Inp label="الرقم التسلسلي"  placeholder="SN-XXXX-0000" />
              <Inp label="رقم الموديل"     placeholder="رقم الموديل أو الطراز" />
              <Sel label="فئة الأصل" required options={["أجهزة حاسوب","أجهزة طباعة","أجهزة عرض","أثاث مكتبي","مركبات","أجهزة خوادم","أجهزة تكييف","أجهزة مسح"]} placeholder="اختر الفئة" />
              <Sel label="Business Criticality" required options={[...BUSINESS_CRITICALITY_OPTIONS]} placeholder="Select criticality" />
              <Inp label="الشركة المصنّعة" placeholder="مثال: Dell, HP, Canon" />
              <Inp label="رقم الأصل المحلي" placeholder="يُنشأ تلقائياً إن تُرك فارغاً" />
            </div>
          </div>
        )}

        {section === "location" && (
          <div>
            <h3 className="text-sm font-semibold text-[#3E3124] mb-5">الموقع والتعيين</h3>
            <div className="grid grid-cols-2 gap-5">
              <Sel label="القسم المسؤول" required options={["تقنية المعلومات","المالية","الإدارة","الإدارة العليا","الموارد البشرية","الخدمات اللوجستية","السجلات والأرشيف"]} placeholder="اختر القسم" />
              <Sel label="المبنى"        required options={["مبنى أ","مبنى ب","مبنى ج","مبنى د","خارج الموقع"]} placeholder="اختر المبنى" />
              <Inp label="الطابق / الغرفة" placeholder="مثال: الطابق 2، غرفة 201" required />
              <Inp label="المسؤول المباشر" placeholder="اسم الموظف المسؤول" />
            </div>
          </div>
        )}

        {section === "financial" && (
          <div>
            <h3 className="text-sm font-semibold text-[#3E3124] mb-5">البيانات المالية</h3>
            <div className="grid grid-cols-2 gap-5">
              <Inp label="تاريخ الشراء"               type="date" required />
              <Inp label="قيمة الشراء (ريال سعودي)"  type="number" placeholder="0.00" required />
              <Sel label="سنوات الإهلاك" options={["3 سنوات","5 سنوات","7 سنوات","10 سنوات","لا ينطبق"]} placeholder="اختر" />
              <Inp label="رقم فاتورة الشراء"          placeholder="رقم الفاتورة" />
              <Inp label="تاريخ انتهاء الضمان"        type="date" />
              <Sel label="مصدر التمويل" options={["الميزانية التشغيلية","مشروع رأسمالي","هبة","تبرع","أخرى"]} placeholder="اختر" />
            </div>
          </div>
        )}

        {section === "notes" && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-[#3E3124]">ملاحظات ومرفقات</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#3E3124]">ملاحظات إضافية</label>
              <textarea rows={4} placeholder="أضف أي ملاحظات أو معلومات إضافية حول هذا الأصل..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D3C8] bg-white text-[#3E3124] text-sm
                  placeholder:text-[#A09580] focus:outline-none focus:ring-2 focus:ring-[#556B2F]/25 focus:border-[#556B2F] resize-none transition-all" />
            </div>
            <div className="border-2 border-dashed border-[#D8D3C8] rounded-xl p-8 text-center
              hover:border-[#556B2F] hover:bg-[#F7F4EE] transition-all cursor-pointer">
              <Upload size={22} className="mx-auto text-[#C4B9A8] mb-2" />
              <p className="text-sm text-[#8B7F72]">رفع المستندات المرفقة (فاتورة، ضمان، صور)</p>
              <p className="text-xs text-[#A09580] mt-1">PDF, DOCX, JPG — الحجم الأقصى 20MB لكل ملف</p>
            </div>
          </div>
        )}
      </Card>

      <div className="flex items-center gap-3">
        <Btn variant="primary"    icon={<CheckCircle size={15} />}>{asset ? "حفظ التعديلات" : "حفظ الأصل"}</Btn>
        <Btn variant="secondary"  onClick={() => onNavigate("assets")}>إلغاء</Btn>
      </div>
    </div>
  );
}

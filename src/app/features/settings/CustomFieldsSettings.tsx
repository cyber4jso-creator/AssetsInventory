import { useState } from "react";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";
import type { CustomFieldDefinition, CustomFieldType } from "../assets/types/fieldConfig";
import { CUSTOM_FIELD_TYPE_LABELS } from "../assets/types/fieldConfig";
import { useAssetFieldConfig } from "../assets/contexts/AssetFieldConfigContext";
import { Btn, Card, Inp } from "../../components/shared";

// ─────────────────────────────────────────────
// Settings — Custom Fields (Super Admin)
// ─────────────────────────────────────────────

const FIELD_TYPES = Object.keys(CUSTOM_FIELD_TYPE_LABELS) as CustomFieldType[];

const EMPTY_FORM = {
  label: "",
  type: "text" as CustomFieldType,
  required: false,
  visible: true,
  searchable: false,
  filterable: false,
  options: "",
};

export function CustomFieldsSettings() {
  const { customFields, addCustomField, updateCustomField, removeCustomField } = useAssetFieldConfig();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (field: CustomFieldDefinition) => {
    setForm({
      label: field.label,
      type: field.type,
      required: field.required,
      visible: field.visible,
      searchable: field.searchable,
      filterable: field.filterable,
      options: field.options?.join(", ") ?? "",
    });
    setEditingId(field.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.label.trim()) return;
    const payload = {
      label: form.label.trim(),
      type: form.type,
      required: form.required,
      visible: form.visible,
      searchable: form.searchable,
      filterable: form.filterable,
      options: form.type === "dropdown"
        ? form.options.split(",").map(o => o.trim()).filter(Boolean)
        : undefined,
    };
    if (editingId) {
      updateCustomField(editingId, payload);
    } else {
      addCustomField(payload);
    }
    resetForm();
  };

  const FlagToggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)}
        className="w-3.5 h-3.5 rounded border-[#E5E7EB] text-[#2A3172] focus:ring-[#D0A165]/30" />
      <span className="text-xs text-[#2B2B2B]">{label}</span>
    </label>
  );

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B]">الحقول المخصصة</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              أنشئ حقولاً إضافية لتوسيع بيانات الأصول. الحقول المرئية تظهر كأعمدة في جدول الأصول.
            </p>
          </div>
          {!showForm && (
            <Btn variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setShowForm(true)}>
              حقل جديد
            </Btn>
          )}
        </div>

        {customFields.length === 0 && !showForm && (
          <p className="text-sm text-[#6B7280] text-center py-8">لا توجد حقول مخصصة بعد</p>
        )}

        {customFields.length > 0 && (
          <div className="space-y-2 mb-4">
            {customFields.map(field => (
              <div key={field.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#E5E7EB] hover:bg-[#FAFAF9]">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2B2B2B]">{field.label}</p>
                  <p className="text-[10px] text-[#6B7280] mt-0.5">
                    {CUSTOM_FIELD_TYPE_LABELS[field.type]}
                    {field.required && " · مطلوب"}
                    {field.visible && " · مرئي"}
                    {field.searchable && " · قابل للبحث"}
                    {field.filterable && " · قابل للتصفية"}
                  </p>
                </div>
                <button onClick={() => startEdit(field)}
                  className="p-1.5 text-[#6B7280] hover:text-[#2A3172] hover:bg-[#EEF0F8] rounded-md transition-colors cursor-pointer">
                  <Pencil size={14} />
                </button>
                <button onClick={() => removeCustomField(field.id)}
                  className="p-1.5 text-[#6B7280] hover:text-[#C44D4D] hover:bg-[#FAEDED] rounded-md transition-colors cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-4 bg-[#FAFAF9]">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[#2B2B2B]">
                {editingId ? "تعديل الحقل" : "حقل جديد"}
              </h4>
              <button onClick={resetForm} className="p-1 text-[#6B7280] hover:text-[#2B2B2B] cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <Inp label="التسمية" placeholder="مثال: رقم العقد" value={form.label}
              onChange={v => setForm(f => ({ ...f, label: v }))} required />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#2B2B2B]">نوع الحقل</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as CustomFieldType }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#2B2B2B] text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165] appearance-none cursor-pointer">
                {FIELD_TYPES.map(t => (
                  <option key={t} value={t}>{CUSTOM_FIELD_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>

            {form.type === "dropdown" && (
              <Inp label="الخيارات (مفصولة بفاصلة)" placeholder="خيار 1, خيار 2, خيار 3"
                value={form.options} onChange={v => setForm(f => ({ ...f, options: v }))} />
            )}

            <div className="grid grid-cols-2 gap-3">
              <FlagToggle label="مطلوب" value={form.required} onChange={v => setForm(f => ({ ...f, required: v }))} />
              <FlagToggle label="مرئي" value={form.visible} onChange={v => setForm(f => ({ ...f, visible: v }))} />
              <FlagToggle label="قابل للبحث" value={form.searchable} onChange={v => setForm(f => ({ ...f, searchable: v }))} />
              <FlagToggle label="قابل للتصفية" value={form.filterable} onChange={v => setForm(f => ({ ...f, filterable: v }))} />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Btn variant="primary" size="sm" icon={<Check size={13} />} onClick={handleSubmit}>
                {editingId ? "تحديث" : "إضافة"}
              </Btn>
              <Btn variant="secondary" size="sm" onClick={resetForm}>إلغاء</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

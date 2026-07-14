import type { Asset } from "../../../../types";
import { Chip } from "../../../../components/shared";
import {
  getCategoryDetailFields,
  getCategoryDetailTitle,
  getGeneralInfoFields,
  getOwnershipFields,
  getWarrantyFields,
  RELATIONSHIP_PLACEHOLDERS,
} from "../../utils/assetDetailFields";
import { InfoField, InfoFieldGrid, InfoSectionCard } from "./InfoSectionCard";

export function AssetOverviewTab({ asset }: { asset: Asset }) {
  const generalFields = getGeneralInfoFields(asset);
  const categoryFields = getCategoryDetailFields(asset);
  const ownershipFields = getOwnershipFields(asset);
  const warranty = getWarrantyFields(asset);

  return (
    <div className="space-y-4">
      <InfoSectionCard title="المعلومات العامة" subtitle="بيانات مشتركة لجميع أنواع الأصول">
        <InfoFieldGrid>
          {generalFields.map(f => (
            <InfoField key={f.label} label={f.label} value={f.value} mono={f.mono} />
          ))}
          <InfoField label="الحالة">
            <Chip status={asset.status} />
          </InfoField>
        </InfoFieldGrid>
      </InfoSectionCard>

      {categoryFields.length > 0 && (
        <InfoSectionCard
          title={getCategoryDetailTitle(asset)}
          subtitle="حقول خاصة بفئة هذا الأصل فقط"
        >
          <InfoFieldGrid>
            {categoryFields.map(f => (
              <InfoField key={f.label} label={f.label} value={f.value} mono={f.mono} />
            ))}
          </InfoFieldGrid>
        </InfoSectionCard>
      )}

      {ownershipFields.length > 0 && (
        <InfoSectionCard title="الملكية والإسناد" subtitle="الجهة المالكة والمسؤولية التشغيلية">
          <InfoFieldGrid>
            {ownershipFields.map(f => (
              <InfoField key={f.label} label={f.label} value={f.value} mono={f.mono} />
            ))}
          </InfoFieldGrid>
        </InfoSectionCard>
      )}

      <InfoSectionCard title="العلاقات" subtitle="روابط الأصول — جاهز للربط مع Backend">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RELATIONSHIP_PLACEHOLDERS.map(rel => (
            <div
              key={rel.key}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAF9]"
            >
              <span className="text-xs text-[#6B7280]">{rel.label}</span>
              <span className="text-xs text-[#9CA3AF] font-medium">—</span>
            </div>
          ))}
        </div>
      </InfoSectionCard>

      {warranty.fields.length > 0 && (
        <InfoSectionCard title="الضمان" subtitle="معلومات الضمان والتغطية">
          <InfoFieldGrid>
            {warranty.fields.map(f => (
              <InfoField key={f.label} label={f.label} value={f.value} mono={f.mono} />
            ))}
            {warranty.statusLabel && warranty.statusStyle && (
              <InfoField label="الحالة">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap w-fit"
                  style={{ background: warranty.statusStyle.bg, color: warranty.statusStyle.text }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: warranty.statusStyle.dot }}
                  />
                  {warranty.statusLabel}
                </span>
              </InfoField>
            )}
          </InfoFieldGrid>
        </InfoSectionCard>
      )}
    </div>
  );
}

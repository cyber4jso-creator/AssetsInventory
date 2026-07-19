import { useMemo, useState } from "react";
import {
  ChevronRight, QrCode, ArrowLeftRight, Edit, MapPin, Building2, User,
  Download, Archive, Trash2, Cpu, Wrench,
} from "lucide-react";
import type { NavigateFn, Screen } from "../../types";
import { ASSET_HISTORY, ASSET_ATTACHMENTS, AUDIT_LOGS } from "../../data/mock";
import { getAssetCategoryDisplayLabel } from "../../utils/assetMappings";
import { Btn, Card, Chip, CriticalityChip, AccessDenied, ConfirmDialog, toast } from "../../components/shared";
import { useAuth, hasPermission, hasReportsExport } from "../../auth";
import { getVisibleAssetsForUser } from "../../utils/assetScope";
import { getAssetAssigneeName } from "../../utils/userDisplay";
import { exportToCsv } from "../../utils/csvExport";
import { useAssetsData } from "./contexts/AssetsDataContext";
import { AssetOverviewTab } from "./components/asset-detail/AssetOverviewTab";
import { AssetMaintenanceTab } from "./components/asset-detail/AssetMaintenanceTab";
import { AssetTransferHistoryTab } from "./components/asset-detail/AssetTransferHistoryTab";
import { AssetAttachmentsTab } from "./components/asset-detail/AssetAttachmentsTab";
import { AssetAuditLogTab } from "./components/asset-detail/AssetAuditLogTab";
import { AssetDetailSidebar } from "./components/asset-detail/AssetDetailSidebar";
import { NewRequestModal } from "../requests/NewRequestModal";

// ─────────────────────────────────────────────
// Asset Detail — Enterprise Asset Workspace
// ─────────────────────────────────────────────

const TABS = [
  { id: "details",     label: "نظرة عامة"    },
  { id: "maintenance", label: "سجل الصيانة"  },
  { id: "transfer",    label: "سجل النقل"    },
  { id: "attachments", label: "المرفقات"     },
  { id: "audit",       label: "سجل التدقيق"  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AssetDetailScreen({ onNavigate, onOpenAsset, assetId }: {
  onNavigate: NavigateFn;
  onOpenAsset: (assetId: string | null, screen: Screen) => void;
  assetId?: string | null;
}) {
  const [tab, setTab] = useState<TabId>("details");
  const [confirmAction, setConfirmAction] = useState<"archive" | "delete" | null>(null);
  const [showMaintenanceRequest, setShowMaintenanceRequest] = useState(false);
  const { currentUser } = useAuth();
  const { assets, archiveAsset, deleteAsset } = useAssetsData();

  const visibleAssets = useMemo(
    () => getVisibleAssetsForUser(assets, currentUser),
    [assets, currentUser],
  );

  const asset = visibleAssets.find(a => a.id === assetId) ?? visibleAssets[0];

  const historyEvents = useMemo(
    () => ASSET_HISTORY.filter(h => h.assetId === asset?.id),
    [asset?.id],
  );

  const attachments = useMemo(
    () => ASSET_ATTACHMENTS.filter(a => a.assetId === asset?.id),
    [asset?.id],
  );

  const auditEntries = useMemo(
    () => AUDIT_LOGS.filter(l => l.entity === asset?.id),
    [asset?.id],
  );

  const canEdit = hasPermission(currentUser, "assets.edit");
  const canTransfer = hasPermission(currentUser, "assets.transfer");
  const canQr = hasPermission(currentUser, "assets.qr");
  const canExport = hasReportsExport(currentUser);
  const canDelete = hasPermission(currentUser, "assets.delete");
  const canRequestMaintenance = hasPermission(currentUser, "requests.create");

  if (!asset) {
    return <AccessDenied onBack={() => onNavigate("assets")} />;
  }

  const assigneeName = getAssetAssigneeName(asset);

  const exportAsset = () => {
    exportToCsv(
      `asset-${asset.id}`,
      ["الحقل", "القيمة"],
      [
        ["رقم الأصل", asset.id], ["الاسم", asset.name], ["الفئة", getAssetCategoryDisplayLabel(asset)],
        ["القسم", asset.department], ["الموقع", asset.location], ["الحالة", asset.status],
        ["الرقم التسلسلي", asset.serial], ["الموديل", asset.model], ["الشركة المصنّعة", asset.manufacturer],
        ["تاريخ الشراء", asset.purchaseDate], ["انتهاء الضمان", asset.warrantyExpiration], ["القيمة", asset.value],
      ],
    );
    toast.success("تم تصدير بيانات الأصل بنجاح");
  };

  const handleConfirmedAction = () => {
    if (confirmAction === "archive") {
      archiveAsset(asset.id);
      toast.success("تمت أرشفة الأصل بنجاح");
    } else if (confirmAction === "delete") {
      deleteAsset(asset.id);
      toast.success("تم حذف الأصل بنجاح");
      onNavigate("assets");
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-5 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
        <button type="button" onClick={() => onNavigate("assets")} className="hover:text-[#2A3172] transition-colors cursor-pointer">
          قائمة الأصول
        </button>
        <ChevronRight size={14} className="rotate-180" />
        <span className="text-[#2B2B2B] font-medium">تفاصيل الأصل</span>
      </div>

      {/* Header */}
      <Card className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[#EEF0F8] flex items-center justify-center flex-shrink-0">
            <Cpu size={22} className="text-[#2A3172]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-xl font-bold text-[#2B2B2B]">{asset.name}</h1>
              <Chip status={asset.status} />
              <CriticalityChip criticality={asset.businessCriticality} />
            </div>
            <p className="text-sm text-[#6B7280] font-mono">{asset.id} · {getAssetCategoryDisplayLabel(asset)}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-[#6B7280] flex-wrap">
              {asset.location && (
                <span className="flex items-center gap-1"><MapPin size={12} />{asset.location}</span>
              )}
              {asset.department && (
                <span className="flex items-center gap-1"><Building2 size={12} />{asset.department}</span>
              )}
              {assigneeName && (
                <span className="flex items-center gap-1"><User size={12} />{assigneeName}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {canEdit && (
            <Btn variant="primary" size="sm" icon={<Edit size={13} />} onClick={() => onOpenAsset(asset.id, "add-asset")}>
              تعديل
            </Btn>
          )}
          {canTransfer && (
            <Btn variant="secondary" size="sm" icon={<ArrowLeftRight size={13} />} onClick={() => onOpenAsset(asset.id, "transfer")}>
              نقل
            </Btn>
          )}
          {canExport && (
            <Btn variant="secondary" size="sm" icon={<Download size={13} />} onClick={exportAsset}>تصدير</Btn>
          )}
          {canQr && (
            <Btn variant="secondary" size="sm" icon={<QrCode size={13} />} onClick={() => onOpenAsset(asset.id, "qr")}>
              QR
            </Btn>
          )}
          {canRequestMaintenance && (
            <Btn variant="secondary" size="sm" icon={<Wrench size={13} />} onClick={() => setShowMaintenanceRequest(true)}>
              طلب صيانة
            </Btn>
          )}
          {canDelete && (
            <>
              <Btn variant="secondary" size="sm" icon={<Archive size={13} />} onClick={() => setConfirmAction("archive")}>أرشفة</Btn>
              <Btn variant="ghost" size="sm" icon={<Trash2 size={13} />} onClick={() => setConfirmAction("delete")}>حذف</Btn>
            </>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 w-full">
        {/* Main workspace */}
        <div className="xl:col-span-3 space-y-4 min-w-0">
          <div className="flex gap-1 bg-[#F7F6F3] p-1 rounded-xl w-full overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  tab === t.id ? "bg-white text-[#2B2B2B] shadow-sm" : "text-[#6B7280] hover:text-[#2B2B2B]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "details" && <AssetOverviewTab asset={asset} />}
          {tab === "maintenance" && <AssetMaintenanceTab events={historyEvents} />}
          {tab === "transfer" && <AssetTransferHistoryTab events={historyEvents} />}
          {tab === "attachments" && <AssetAttachmentsTab attachments={attachments} />}
          {tab === "audit" && <AssetAuditLogTab entries={auditEntries} />}
        </div>

        {/* Sidebar */}
        <AssetDetailSidebar asset={asset} />
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={open => !open && setConfirmAction(null)}
        title={confirmAction === "delete" ? "حذف الأصل" : "أرشفة الأصل"}
        description={
          confirmAction === "delete"
            ? `هل أنت متأكد من حذف "${asset.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : `سيتم نقل "${asset.name}" إلى الأصول المؤرشفة. يمكنك التراجع عن هذا لاحقاً.`
        }
        confirmLabel={confirmAction === "delete" ? "حذف" : "أرشفة"}
        onConfirm={handleConfirmedAction}
      />

      <NewRequestModal
        open={showMaintenanceRequest}
        onOpenChange={setShowMaintenanceRequest}
        presetAssetId={asset.id}
        presetType="maintenance"
      />
    </div>
  );
}

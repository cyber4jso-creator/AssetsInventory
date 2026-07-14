export type Screen =
  | "dashboard" | "assets" | "asset-detail" | "asset-report" | "add-asset"
  | "transfer" | "qr" | "requests" | "reports"
  | "user-management" | "roles" | "audit-log"
  | "ai-assistant" | "notifications" | "profile" | "settings";

export type AssetStatus = "active" | "maintenance" | "reserved" | "inactive" | "transferred";

export type BusinessCriticality = "Critical" | "High" | "Medium" | "Low";

export interface Asset {
  id: string;
  name: string;
  category: string;
  type: string;
  department: string;
  departmentId: string;
  sectorId: string;
  location: string;
  status: AssetStatus;
  businessCriticality: BusinessCriticality;
  assignedUserId: string | null;
  purchaseDate: string;
  warrantyExpiration: string;
  value: number;
  serial: string;
  model: string;
  manufacturer: string;
  supplier: string;
}

export type AssetHistoryEventType =
  | "created"
  | "assigned"
  | "transferred"
  | "maintenance"
  | "warranty"
  | "status-changed"
  | "disposed";

export interface AssetHistoryEvent {
  id: string;
  assetId: string;
  type: AssetHistoryEventType;
  timestamp: string;
  performedBy: string;
  performedByUserId?: string;
  from?: string;
  to?: string;
  fromDepartment?: string;
  toDepartment?: string;
  department?: string;
  location?: string;
  reason?: string;
  notes?: string;
  result?: string;
  status?: AssetStatus;
}

export type NavigateFn = (screen: Screen) => void;

export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: "warning" | "success" | "info";
}

export interface AssetAttachment {
  id: string;
  assetId: string;
  name: string;
  size: string;
  uploadedAt: string;
  uploadedByUserId: string;
}

export interface AuditLogEntry {
  id: number;
  time: string;
  userId: string | null;
  action: string;
  entity: string;
  details: string;
  type: "create" | "update" | "delete" | "auth";
}

export type RequestType = "transfer" | "maintenance" | "purchase" | "disposal";
export type RequestPriority = "low" | "medium" | "high" | "urgent";
export type RequestStatus = "pending" | "approved" | "rejected" | "completed";

export interface AssetRequest {
  id: string;
  type: RequestType;
  asset: string;
  assetId: string;
  requesterUserId: string;
  reason: string;
  priority: RequestPriority;
  notes?: string;
  from?: string;
  to?: string;
  date: string;
  status: RequestStatus;
}


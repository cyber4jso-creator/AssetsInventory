export type Screen =
  | "dashboard" | "assets" | "asset-detail" | "asset-report" | "add-asset"
  | "transfer" | "qr" | "requests" | "reports"
  | "user-management" | "roles" | "audit-log"
  | "ai-assistant" | "notifications" | "settings";

export type AssetStatus = "active" | "maintenance" | "reserved" | "inactive" | "transferred";

export type BusinessCriticality = "Critical" | "High" | "Medium" | "Low";

export interface Asset {
  id: string;
  name: string;
  category: string;
  type: string;
  department: string;
  location: string;
  status: AssetStatus;
  businessCriticality: BusinessCriticality;
  assignedTo: string;
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


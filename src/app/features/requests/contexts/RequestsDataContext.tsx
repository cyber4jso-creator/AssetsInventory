import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { AssetRequest, RequestPriority, RequestStatus, RequestType } from "../../../types";
import { REQUESTS as INITIAL_REQUESTS } from "../../../data/mock";
import { MOCK_TODAY } from "../../../data/mockReferenceDate";

// ─────────────────────────────────────────────
// Requests data — local mock state for Sprint 2.
// In-memory only, no persistence across refresh.
// Sprint 3 replaces this with scoped API calls.
// ─────────────────────────────────────────────

export interface NewRequestInput {
  type: RequestType;
  assetId: string;
  asset: string;
  reason: string;
  priority: RequestPriority;
  notes?: string;
  requesterUserId: string;
  from?: string;
  to?: string;
}

interface RequestsDataContextValue {
  requests: AssetRequest[];
  addRequest: (input: NewRequestInput) => AssetRequest;
  setRequestStatus: (id: string, status: RequestStatus) => void;
}

const RequestsDataContext = createContext<RequestsDataContextValue | null>(null);

function todayISO(): string {
  return MOCK_TODAY.toISOString().slice(0, 10);
}

function nextRequestId(existing: AssetRequest[]): string {
  const year = MOCK_TODAY.getFullYear();
  const seq = existing.length + 1;
  return `REQ-${year}-${String(seq).padStart(4, "0")}`;
}

export function RequestsDataProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<AssetRequest[]>(INITIAL_REQUESTS);

  const addRequest = useCallback((input: NewRequestInput): AssetRequest => {
    let created!: AssetRequest;
    setRequests(prev => {
      created = {
        id: nextRequestId(prev),
        type: input.type,
        asset: input.asset,
        assetId: input.assetId,
        requesterUserId: input.requesterUserId,
        reason: input.reason,
        priority: input.priority,
        notes: input.notes,
        from: input.from,
        to: input.to,
        date: todayISO(),
        status: "pending",
      };
      return [created, ...prev];
    });
    return created;
  }, []);

  const setRequestStatus = useCallback((id: string, status: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }, []);

  return (
    <RequestsDataContext.Provider value={{ requests, addRequest, setRequestStatus }}>
      {children}
    </RequestsDataContext.Provider>
  );
}

export function useRequestsData() {
  const ctx = useContext(RequestsDataContext);
  if (!ctx) throw new Error("useRequestsData must be used inside RequestsDataProvider");
  return ctx;
}

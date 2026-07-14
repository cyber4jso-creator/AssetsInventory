import { DEMO_USERS, getDemoUserById } from "../data/demoUsers";
import type { Asset, AssetHistoryEvent } from "../types";

export function getUserFirstName(userId: string | null | undefined): string | null {
  if (!userId) return null;
  return getDemoUserById(userId)?.firstName ?? null;
}

export function getAssetAssigneeName(asset: Asset): string | null {
  return getUserFirstName(asset.assignedUserId);
}

export function resolvePerformerLabel(event: AssetHistoryEvent): string {
  if (event.performedByUserId) {
    return getUserFirstName(event.performedByUserId) ?? event.performedBy;
  }
  return event.performedBy;
}

export function getUsersInDepartment(departmentId: string) {
  return DEMO_USERS.filter(u => u.departmentId === departmentId);
}

export function getUsersInSector(sectorId: string) {
  return DEMO_USERS.filter(u => u.sectorId === sectorId);
}

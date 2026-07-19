import { getDemoUserById } from "../data/demoUsers";
import type { Asset, AssetHistoryEvent } from "../types";

export type UserNameLookup = ReadonlyMap<string, string>;

export function buildUserNameLookup(
  users: ReadonlyArray<{ apiId: string; name: string }>,
): UserNameLookup {
  const lookup = new Map<string, string>();

  for (const user of users) {
    lookup.set(user.apiId, user.name);
  }

  return lookup;
}

export function getUserDisplayName(
  userId: string | null | undefined,
  lookup?: UserNameLookup,
): string | null {
  if (!userId) return null;

  const apiName = lookup?.get(userId);
  if (apiName) return apiName;

  return getDemoUserById(userId)?.firstName ?? null;
}

export function getUserFirstName(userId: string | null | undefined): string | null {
  if (!userId) return null;
  return getDemoUserById(userId)?.firstName ?? null;
}

export function getAssetAssigneeName(
  asset: Asset,
  lookup?: UserNameLookup,
): string | null {
  return getUserDisplayName(asset.assignedUserId, lookup);
}

export function resolvePerformerLabel(
  event: AssetHistoryEvent,
  lookup?: UserNameLookup,
): string {
  if (event.performedByUserId) {
    return getUserDisplayName(event.performedByUserId, lookup) ?? event.performedBy;
  }
  return event.performedBy;
}

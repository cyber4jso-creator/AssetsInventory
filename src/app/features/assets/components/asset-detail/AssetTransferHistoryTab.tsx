import type { AssetHistoryEvent } from "../../../../types";
import { AssetMovementHistoryTable } from "./AssetMovementHistoryTable";

export function AssetTransferHistoryTab({ events }: { events: AssetHistoryEvent[] }) {
  return <AssetMovementHistoryTable events={events} />;
}

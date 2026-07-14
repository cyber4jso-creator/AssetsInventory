import type { AssetHistoryEvent } from "../../../../types";
import { AssetHistoryTimeline } from "../../AssetHistoryTimeline";
import { AssetMovementHistoryTable } from "./AssetMovementHistoryTable";

export function AssetHistoryTab({ events }: { events: AssetHistoryEvent[] }) {
  return (
    <div className="space-y-4">
      <AssetHistoryTimeline events={events} />
      <AssetMovementHistoryTable events={events} />
    </div>
  );
}

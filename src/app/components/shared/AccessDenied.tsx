import { ShieldOff } from "lucide-react";
import { Card, Btn } from "./primitives";
import { EmptyState } from "./EmptyState";

export function AccessDenied({ onBack }: { onBack: () => void }) {
  return (
    <Card>
      <EmptyState icon={ShieldOff} title="لا تملك صلاحية الوصول إلى هذه الصفحة"
        subtitle="تواصل مع مدير النظام إذا كنت تعتقد أن هذا غير صحيح" />
      <div className="flex justify-center mt-2">
        <Btn variant="secondary" size="sm" onClick={onBack}>العودة إلى لوحة التحكم</Btn>
      </div>
    </Card>
  );
}

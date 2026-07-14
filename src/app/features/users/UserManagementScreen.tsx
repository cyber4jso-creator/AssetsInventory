import { useMemo, useState } from "react";
import { Search, Plus, Edit, Ban, RotateCcw, Inbox } from "lucide-react";
import { Btn, Card, EmptyState, ConfirmDialog, PaginationBar, toast } from "../../components/shared";
import { ROLE_LABELS, useAuth, hasPermission } from "../../auth";
import type { Role } from "../../auth";
import { useUsersData } from "./contexts/UsersDataContext";
import { AddUserModal } from "./AddUserModal";
import { matchesQuery } from "../../utils/search";
import { getTotalPages, paginateArray } from "../../utils/paginate";

const PER_PAGE = 10;
const ROLE_FILTER_OPTIONS = Object.keys(ROLE_LABELS) as Role[];

const TABLE_HEADERS = [
  { key: "user", label: "المستخدم" },
  { key: "role", label: "الدور" },
  { key: "department", label: "القسم" },
  { key: "lastLogin", label: "آخر دخول" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "إجراءات" },
] as const;

export function UserManagementScreen() {
  const { currentUser } = useAuth();
  const canManage = hasPermission(currentUser, "users.manage");
  const { users, toggleUserStatus } = useUsersData();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showAddUser, setShowAddUser] = useState(false);
  const [statusTarget, setStatusTarget] = useState<{ id: number; name: string; nextActive: boolean } | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = matchesQuery(search, u.name, u.email, u.department, u.role);
      const matchesRole = !roleFilter || u.role === ROLE_LABELS[roleFilter as Role];
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = getTotalPages(filteredUsers.length, PER_PAGE);
  const paginated = paginateArray(filteredUsers, page, PER_PAGE);

  const confirmStatusChange = () => {
    if (!statusTarget) return;
    toggleUserStatus(statusTarget.id);
    toast.success(statusTarget.nextActive ? "تم تفعيل المستخدم" : "تم تعطيل المستخدم");
    setStatusTarget(null);
  };

  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#2B2B2B]">إدارة المستخدمين</h1>
        {canManage && (
          <Btn variant="primary" icon={<Plus size={15} />} onClick={() => setShowAddUser(true)}>إضافة مستخدم</Btn>
        )}
      </div>
      <Card p={false} className="w-full">
        <div className="p-4 flex items-center gap-3 border-b border-[#E5E7EB] flex-wrap">
          <div className="flex-1 min-w-40 relative">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#6B7280]" aria-hidden />
            <input
              placeholder="بحث عن مستخدم..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              aria-label="بحث عن مستخدم"
              className="w-full pr-9 pl-3 py-2 text-sm rounded-lg border border-[#E5E7EB]
              placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165]"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            aria-label="فلتر الدور"
            className="text-sm px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">كل الأدوار</option>
            {ROLE_FILTER_OPTIONS.map(r => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </div>
        {filteredUsers.length === 0 ? (
          <EmptyState icon={Inbox} title="لا يوجد مستخدمون مطابقون" subtitle="جرّب تعديل كلمة البحث أو الفلتر" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                    {TABLE_HEADERS.map(h => (
                      <th key={h.key} className="text-right text-xs text-[#6B7280] font-medium px-5 py-3">{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((u, i) => (
                    <tr key={u.id} className={`hover:bg-[#FAFAF9] ${i < paginated.length - 1 ? "border-b border-[#F7F6F3]" : ""}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EEF0F8] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-[#2A3172]">{u.name[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#2B2B2B]">{u.name}</p>
                            <p className="text-xs text-[#6B7280]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#6B7280]">{u.role}</td>
                      <td className="px-5 py-3.5 text-[#6B7280]">{u.department}</td>
                      <td className="px-5 py-3.5 text-[#6B7280] text-xs">{u.lastLogin}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.status === "active" ? "bg-[#EDF3EF] text-[#3D6B47]" : "bg-[#E5E7EB] text-[#6B7280]"}`}>
                          {u.status === "active" ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {canManage && (
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => toast.deferred("تعديل بيانات المستخدم")} aria-label="تعديل"
                              className="p-1.5 text-[#6B7280] hover:text-[#2A3172] hover:bg-[#EEF0F8] rounded-md transition-colors cursor-pointer">
                              <Edit size={14} />
                            </button>
                            <button type="button" onClick={() => setStatusTarget({ id: u.id, name: u.name, nextActive: u.status === "inactive" })}
                              aria-label={u.status === "active" ? "تعطيل" : "تفعيل"}
                              className="p-1.5 text-[#6B7280] hover:text-[#C44D4D] hover:bg-[#FAEDED] rounded-md transition-colors cursor-pointer">
                              {u.status === "active" ? <Ban size={14} /> : <RotateCcw size={14} />}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationBar page={page} totalPages={totalPages} totalItems={filteredUsers.length} perPage={PER_PAGE} onPageChange={setPage} />
          </>
        )}
      </Card>

      <AddUserModal open={showAddUser} onOpenChange={setShowAddUser} />

      <ConfirmDialog
        open={statusTarget !== null}
        onOpenChange={open => !open && setStatusTarget(null)}
        title={statusTarget?.nextActive ? "تفعيل المستخدم" : "تعطيل المستخدم"}
        description={`هل تريد ${statusTarget?.nextActive ? "تفعيل" : "تعطيل"} حساب "${statusTarget?.name}"؟`}
        confirmLabel={statusTarget?.nextActive ? "تفعيل" : "تعطيل"}
        variant={statusTarget?.nextActive ? "primary" : "danger"}
        onConfirm={confirmStatusChange}
      />
    </div>
  );
}

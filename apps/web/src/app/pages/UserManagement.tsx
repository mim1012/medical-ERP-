import { useState, useMemo } from "react";
import { useUsers, useUpdateUser, useDeleteUser } from "../../hooks/use-users";
import type { User, UpdateUserDto, UserRole } from "../../hooks/use-users";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { UserForm } from "../components/UserForm";
import {
  Search,
  Edit,
  Trash2,
  Users,
  Shield,
  Info,
} from "lucide-react";

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
};

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-[#F0E6F4] text-[#7B4397]',
  MANAGER: 'bg-[#E8EEF3] text-[#5B8DB8]',
  STAFF: 'bg-[#F4F7FA] text-[#5B6773]',
};

const ROLE_TABS: Array<{ label: string; value: UserRole | '전체' }> = [
  { label: '전체', value: '전체' },
  { label: 'ADMIN', value: 'ADMIN' },
  { label: 'MANAGER', value: 'MANAGER' },
  { label: 'STAFF', value: 'STAFF' },
];

export function UserManagement() {
  const [activeMenu, setActiveMenu] = useState('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | '전체'>('전체');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: users = [], isLoading } = useUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const filtered = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return users.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search);
      const matchesRole = roleFilter === '전체' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const totalCount = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const managerCount = users.filter(u => u.role === 'MANAGER').length;
  const staffCount = users.filter(u => u.role === 'STAFF').length;

  const handleUpdate = (dto: UpdateUserDto) => {
    if (!editingUser) return;
    updateUser.mutate(
      { id: editingUser.id, ...dto },
      { onSuccess: () => setEditingUser(null) }
    );
  };

  const handleDelete = (id: string) => {
    deleteUser.mutate(id, { onSuccess: () => setDeleteConfirmId(null) });
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      <main className="lg:ml-64 pt-16">
        <div className="p-4 lg:p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">사용자 관리</h1>
            <p className="text-[#5B6773]">시스템 사용자 및 역할 관리</p>
          </div>

          {/* Info Notice */}
          <div className="flex items-start gap-3 bg-[#E8EEF3] border border-[#5B8DB8]/20 rounded-lg p-4 mb-6">
            <Info className="w-5 h-5 text-[#5B8DB8] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#163A5F]">
              신규 사용자는 슈퍼어드민이 <code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono">/api/auth/signup</code> API로 직접 등록합니다.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">전체 사용자</p>
                  <p className="text-3xl font-bold text-[#18212B]">{totalCount}</p>
                  <p className="text-xs text-[#5B6773] mt-1">명</p>
                </div>
                <Users className="w-9 h-9 text-[#163A5F] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">ADMIN</p>
                  <p className="text-3xl font-bold text-[#7B4397]">{adminCount}</p>
                  <p className="text-xs text-[#5B6773] mt-1">명</p>
                </div>
                <Shield className="w-9 h-9 text-[#7B4397] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">MANAGER</p>
                  <p className="text-3xl font-bold text-[#5B8DB8]">{managerCount}</p>
                  <p className="text-xs text-[#5B6773] mt-1">명</p>
                </div>
                <Shield className="w-9 h-9 text-[#5B8DB8] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">STAFF</p>
                  <p className="text-3xl font-bold text-[#5B6773]">{staffCount}</p>
                  <p className="text-xs text-[#5B6773] mt-1">명</p>
                </div>
                <Users className="w-9 h-9 text-[#5B6773] opacity-20" />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-[#D7DEE6]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Role Tabs */}
                <div className="flex flex-wrap gap-1">
                  {ROLE_TABS.map(tab => (
                    <button
                      key={tab.value}
                      onClick={() => setRoleFilter(tab.value)}
                      className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                        roleFilter === tab.value
                          ? 'bg-[#163A5F] text-white'
                          : 'text-[#5B6773] hover:bg-[#F4F7FA]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                  <input
                    type="text"
                    placeholder="이름, 이메일 검색..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] w-56"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-[#5B6773]">로딩 중...</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-[#5B6773]">사용자가 없습니다.</div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="lg:hidden p-4 space-y-3">
                    {filtered.map(u => (
                      <div key={u.id} className="border border-[#D7DEE6] rounded-lg p-4 hover:bg-[#F4F7FA] transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm font-bold text-[#18212B] mb-1">{u.name}</p>
                            <p className="text-xs text-[#5B6773]">{u.email}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
                            {ROLE_LABELS[u.role]}
                          </span>
                        </div>
                        <p className="text-xs text-[#5B6773] mb-3">{u.createdAt.slice(0, 10)} 등록</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#163A5F] text-white rounded-md text-sm hover:bg-[#0F2942] transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            수정
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(u.id)}
                            className="px-3 py-2 border border-[#D7DEE6] rounded-md text-[#B94A48] hover:bg-[#FCEBE9] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <table className="w-full hidden lg:table">
                    <thead>
                      <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                        <th className="text-left py-3 px-4 text-sm font-bold text-white min-w-[130px]">이름</th>
                        <th className="text-left py-3 px-4 text-sm font-bold text-white min-w-[220px]">이메일</th>
                        <th className="text-center py-3 px-4 text-sm font-bold text-white min-w-[110px]">역할</th>
                        <th className="text-center py-3 px-4 text-sm font-bold text-white min-w-[110px]">등록일</th>
                        <th className="text-center py-3 px-4 text-sm font-bold text-white min-w-[90px]">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(u => (
                        <tr key={u.id} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                          <td className="py-3 px-4 text-sm font-bold text-[#18212B]">{u.name}</td>
                          <td className="py-3 px-4 text-sm text-[#5B6773]">{u.email}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
                              {ROLE_LABELS[u.role]}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-center text-[#5B6773]">
                            {u.createdAt.slice(0, 10)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setEditingUser(u)}
                                className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                                title="수정"
                              >
                                <Edit className="w-4 h-4 text-[#5B8DB8]" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(u.id)}
                                className="p-1.5 hover:bg-[#FCEBE9] rounded transition-colors"
                                title="삭제"
                              >
                                <Trash2 className="w-4 h-4 text-[#B94A48]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#D7DEE6] bg-[#F4F7FA]">
              <p className="text-sm text-[#5B6773]">전체 {filtered.length}명</p>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <UserForm
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={handleUpdate}
        user={editingUser}
      />

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#18212B] mb-2">사용자 삭제</h3>
            <p className="text-sm text-[#5B6773] mb-6">이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-[#D7DEE6] rounded-md text-[#5B6773] hover:bg-[#F4F7FA] text-sm font-semibold"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-[#B94A48] text-white rounded-md hover:bg-[#9B3D3B] text-sm font-semibold"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

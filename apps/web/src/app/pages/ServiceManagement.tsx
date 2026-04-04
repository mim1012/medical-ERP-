import { useState, useMemo } from "react";
import {
  useService,
  useCreateService,
  useUpdateService,
  type ServiceCase,
  type ServiceStatus,
  type ServiceType,
} from "../../hooks/use-service";
import { useClients } from "../../hooks/use-clients";
import { formatDate, isThisMonth } from "../../lib/format";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { ServiceCaseForm } from "../components/ServiceCaseForm";
import { ServiceDetailPanel } from "../components/ServiceDetailPanel";
import { Plus, Search, Wrench, Clock, CheckCircle2, List, AlertCircle } from "lucide-react";

const TYPE_LABELS: Record<ServiceType, string> = {
  INSTALLATION: '설치',
  REPAIR: '수리',
  MAINTENANCE: '유지보수',
};

const STATUS_LABELS: Record<ServiceStatus, string> = {
  OPEN: '접수',
  IN_PROGRESS: '처리중',
  RESOLVED: '완료',
  CLOSED: '종료',
};

const TYPE_BADGE: Record<ServiceType, string> = {
  INSTALLATION: 'bg-blue-100 text-blue-700',
  REPAIR: 'bg-red-100 text-red-700',
  MAINTENANCE: 'bg-green-100 text-green-700',
};

const STATUS_BADGE: Record<ServiceStatus, string> = {
  OPEN: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-slate-100 text-slate-600',
};

type StatusFilter = 'ALL' | ServiceStatus;
type TypeFilter = 'ALL' | ServiceType;

export function ServiceManagement() {
  const [activeMenu, setActiveMenu] = useState('service');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ServiceCase | null>(null);

  const { data: allCases = [], isLoading, error } = useService();
  const { data: clients = [] } = useClients();
  const createService = useCreateService();
  const updateService = useUpdateService();

  const kpi = useMemo(() => ({
    open: allCases.filter((c) => c.status === 'OPEN').length,
    inProgress: allCases.filter((c) => c.status === 'IN_PROGRESS').length,
    resolvedThisMonth: allCases.filter((c) => c.status === 'RESOLVED' && isThisMonth(c.resolvedAt)).length,
    total: allCases.length,
  }), [allCases]);

  const filtered = useMemo(() => {
    return allCases.filter((c) => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (typeFilter !== 'ALL' && c.type !== typeFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          c.client.name.toLowerCase().includes(q) ||
          (c.description ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allCases, statusFilter, typeFilter, searchTerm]);

  const handleCreateSubmit = (data: { clientId: string; type: ServiceType; description: string; assignee: string }) => {
    createService.mutate(
      { clientId: data.clientId, type: data.type, description: data.description || undefined, assignee: data.assignee || undefined },
      { onSuccess: () => setIsFormOpen(false) }
    );
  };

  const handleUpdateStatus = (id: string, status: ServiceStatus) => {
    updateService.mutate({ id, status }, {
      onSuccess: (updated) => {
        if (selectedCase?.id === id) {
          setSelectedCase(updated);
        }
      },
    });
  };

  const handleUpdateAssignee = (id: string, assignee: string) => {
    updateService.mutate({ id, assignee }, {
      onSuccess: (updated) => {
        if (selectedCase?.id === id) {
          setSelectedCase(updated);
        }
      },
    });
  };

  const statusTabs: { key: StatusFilter; label: string }[] = [
    { key: 'ALL', label: '전체' },
    { key: 'OPEN', label: '접수' },
    { key: 'IN_PROGRESS', label: '처리중' },
    { key: 'RESOLVED', label: '완료' },
    { key: 'CLOSED', label: '종료' },
  ];

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
            <h1 className="text-3xl font-bold text-[#18212B] mb-2">A/S 관리</h1>
            <p className="text-[#5B6773]">서비스 케이스 통합 관리</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">접수</p>
                  <p className="text-3xl font-bold text-gray-700">{kpi.open}</p>
                  <p className="text-xs text-[#5B6773] mt-1">OPEN</p>
                </div>
                <AlertCircle className="w-10 h-10 text-gray-400 opacity-40" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">처리중</p>
                  <p className="text-3xl font-bold text-yellow-600">{kpi.inProgress}</p>
                  <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    진행중
                  </p>
                </div>
                <Clock className="w-10 h-10 text-yellow-400 opacity-40" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">이번달 완료</p>
                  <p className="text-3xl font-bold text-[#2E7D5B]">{kpi.resolvedThisMonth}</p>
                  <p className="text-xs text-[#2E7D5B] mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    완료
                  </p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-[#2E7D5B] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5B6773] mb-1">전체 케이스</p>
                  <p className="text-3xl font-bold text-[#163A5F]">{kpi.total}</p>
                  <p className="text-xs text-[#5B6773] mt-1">건</p>
                </div>
                <List className="w-10 h-10 text-[#163A5F] opacity-20" />
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Status Tabs */}
            <div className="flex border-b border-[#D7DEE6] overflow-x-auto">
              {statusTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === tab.key
                      ? 'text-[#163A5F] border-b-2 border-[#163A5F]'
                      : 'text-[#5B6773] hover:bg-[#F4F7FA]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-[#D7DEE6] bg-[#F4F7FA]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                    <input
                      type="text"
                      placeholder="거래처명, 내용 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] w-60"
                    />
                  </div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                    className="px-3 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                  >
                    <option value="ALL">전체 유형</option>
                    <option value="INSTALLATION">설치</option>
                    <option value="REPAIR">수리</option>
                    <option value="MAINTENANCE">유지보수</option>
                  </select>
                </div>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  A/S 접수
                </button>
              </div>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-[#5B6773]">
                <Wrench className="w-5 h-5 animate-spin mr-2" />
                불러오는 중...
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-[#B94A48]">
                <AlertCircle className="w-5 h-5 mr-2" />
                데이터를 불러오지 못했습니다.
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-[#5B6773]">
                <Wrench className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">케이스가 없습니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#163A5F]">
                      <th className="text-left py-3 px-4 text-xs font-bold text-white">케이스 ID</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white">거래처</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white">유형</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white">상태</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white">담당자</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white">접수일</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white">완료일</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-white">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id} className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors">
                        <td className="py-3 px-4 text-sm font-mono text-[#163A5F]">{c.id.slice(0, 8)}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-[#18212B]">{c.client.name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${TYPE_BADGE[c.type]}`}>
                            {TYPE_LABELS[c.type]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[c.status]}`}>
                            {STATUS_LABELS[c.status]}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#5B6773]">{c.assignee ?? '미배정'}</td>
                        <td className="py-3 px-4 text-sm text-[#5B6773]">{formatDate(c.createdAt)}</td>
                        <td className="py-3 px-4 text-sm text-[#5B6773]">{c.resolvedAt ? formatDate(c.resolvedAt) : '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedCase(c)}
                            className="px-3 py-1.5 text-xs font-semibold text-[#163A5F] border border-[#D7DEE6] rounded-md hover:bg-[#E8EEF3] transition-colors"
                          >
                            보기
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer count */}
            <div className="px-6 py-3 border-t border-[#D7DEE6] bg-[#F4F7FA]">
              <p className="text-sm text-[#5B6773]">전체 {filtered.length}건</p>
            </div>
          </div>
        </div>
      </main>

      <ServiceCaseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateSubmit}
        clients={clients}
        isSubmitting={createService.isPending}
      />

      <ServiceDetailPanel
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        serviceCase={selectedCase}
        onUpdateStatus={handleUpdateStatus}
        onUpdateAssignee={handleUpdateAssignee}
        isUpdating={updateService.isPending}
      />
    </div>
  );
}

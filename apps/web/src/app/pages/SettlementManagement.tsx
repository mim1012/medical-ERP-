import { useState } from "react";
import {
  useSettlement,
  useCreateSettlement,
  useUpdateSettlement,
  type Settlement,
  type SettlementType,
  type SettlementStatus,
} from "../../hooks/use-settlement";
import { useClients } from "../../hooks/use-clients";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { SettlementDetailPanel } from "../components/SettlementDetailPanel";
import {
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Calendar,
  Eye,
  CheckCircle2,
  X,
} from "lucide-react";

type TypeTab = "ALL" | SettlementType;
type StatusFilter = "ALL" | SettlementStatus;

const formatAmount = (amount: string) =>
  `₩${parseFloat(amount).toLocaleString("ko-KR")}`;

const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString("ko-KR") : "-";

const TYPE_LABELS: Record<SettlementType, string> = {
  RECEIVABLE: "매출채권",
  PAYABLE: "매입채무",
};

const STATUS_LABELS: Record<SettlementStatus, string> = {
  PENDING: "미수",
  PARTIAL: "일부수금",
  COMPLETED: "완료",
  OVERDUE: "연체",
};

const TYPE_BADGE: Record<SettlementType, string> = {
  RECEIVABLE: "bg-blue-100 text-blue-700",
  PAYABLE: "bg-red-100 text-red-700",
};

const STATUS_BADGE: Record<SettlementStatus, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  PARTIAL: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
};

interface CreateForm {
  clientId: string;
  type: SettlementType;
  amount: string;
  dueDate: string;
  notes: string;
}

const EMPTY_FORM: CreateForm = {
  clientId: "",
  type: "RECEIVABLE",
  amount: "",
  dueDate: "",
  notes: "",
};

export function SettlementManagement() {
  const [activeMenu, setActiveMenu] = useState("settlement");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [typeTab, setTypeTab] = useState<TypeTab>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(EMPTY_FORM);
  const [selectedSettlement, setSelectedSettlement] =
    useState<Settlement | null>(null);

  const { data: settlements = [], isLoading } = useSettlement(
    typeTab !== "ALL" ? { type: typeTab } : undefined
  );
  const { data: clients = [] } = useClients();
  const createSettlement = useCreateSettlement();
  const updateSettlement = useUpdateSettlement();

  // KPI calculations
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalReceivable = settlements
    .filter((s) => s.type === "RECEIVABLE")
    .reduce((sum, s) => sum + parseFloat(s.amount), 0);

  const totalPayable = settlements
    .filter((s) => s.type === "PAYABLE")
    .reduce((sum, s) => sum + parseFloat(s.amount), 0);

  const overdueCount = settlements.filter(
    (s) => s.status === "OVERDUE"
  ).length;

  const pendingThisMonth = settlements.filter((s) => {
    if (s.status !== "PENDING" || !s.dueDate) return false;
    const d = new Date(s.dueDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  // Filtered list
  const filtered = settlements.filter((s) => {
    const matchesStatus =
      statusFilter === "ALL" || s.status === statusFilter;
    const matchesSearch = s.client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreate = () => {
    if (!createForm.clientId || !createForm.amount) return;
    createSettlement.mutate(
      {
        clientId: createForm.clientId,
        type: createForm.type,
        amount: parseFloat(createForm.amount),
        dueDate: createForm.dueDate || undefined,
        notes: createForm.notes || undefined,
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          setCreateForm(EMPTY_FORM);
        },
      }
    );
  };

  const handleMarkComplete = (settlement: Settlement) => {
    updateSettlement.mutate({
      id: settlement.id,
      status: "COMPLETED",
      settledAt: new Date().toISOString(),
    });
  };

  const TYPE_TABS: { key: TypeTab; label: string }[] = [
    { key: "ALL", label: "전체" },
    { key: "RECEIVABLE", label: "매출채권" },
    { key: "PAYABLE", label: "매입채무" },
  ];

  const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
    { key: "ALL", label: "전체" },
    { key: "PENDING", label: "미수" },
    { key: "PARTIAL", label: "일부수금" },
    { key: "COMPLETED", label: "완료" },
    { key: "OVERDUE", label: "연체" },
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#18212B] mb-2">
                정산 관리
              </h1>
              <p className="text-[#5B6773]">매출채권 및 매입채무 관리</p>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#163A5F] text-white rounded-md hover:bg-[#0F2942] transition-colors text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              정산 등록
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#5B6773] mb-1">
                    총 매출채권
                  </p>
                  <p className="text-2xl font-bold text-[#163A5F] mb-1">
                    ₩{totalReceivable.toLocaleString("ko-KR")}
                  </p>
                  <p className="text-xs text-[#5B6773]">전체 RECEIVABLE</p>
                </div>
                <DollarSign className="w-10 h-10 text-[#163A5F] opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#5B6773] mb-1">
                    총 매입채무
                  </p>
                  <p className="text-2xl font-bold text-red-600 mb-1">
                    ₩{totalPayable.toLocaleString("ko-KR")}
                  </p>
                  <p className="text-xs text-[#5B6773]">전체 PAYABLE</p>
                </div>
                <TrendingUp className="w-10 h-10 text-red-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#5B6773] mb-1">
                    연체 건수
                  </p>
                  <p className="text-2xl font-bold text-[#B94A48] mb-1">
                    {overdueCount}건
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-[#B94A48]" />
                    <p className="text-xs text-[#B94A48]">OVERDUE</p>
                  </div>
                </div>
                <AlertCircle className="w-10 h-10 text-[#B94A48] opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#D7DEE6] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#5B6773] mb-1">
                    이번달 미수
                  </p>
                  <p className="text-2xl font-bold text-[#C58A2B] mb-1">
                    {pendingThisMonth}건
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-[#C58A2B]" />
                    <p className="text-xs text-[#C58A2B]">당월 만기 PENDING</p>
                  </div>
                </div>
                <Calendar className="w-10 h-10 text-[#C58A2B] opacity-20" />
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Type Tabs */}
            <div className="flex border-b border-[#D7DEE6]">
              {TYPE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTypeTab(tab.key)}
                  className={`px-6 py-3 text-sm font-semibold transition-colors ${
                    typeTab === tab.key
                      ? "border-b-2 border-[#163A5F] text-[#163A5F]"
                      : "text-[#5B6773] hover:text-[#18212B]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-[#D7DEE6] bg-[#F4F7FA] flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                <input
                  type="text"
                  placeholder="거래처명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#D7DEE6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      statusFilter === f.key
                        ? "bg-[#163A5F] text-white"
                        : "bg-white border border-[#D7DEE6] text-[#5B6773] hover:bg-[#E8EEF3]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="py-16 text-center text-[#5B6773] text-sm">
                  불러오는 중...
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-[#5B6773] text-sm">
                  정산 내역이 없습니다
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                      <th className="text-left py-3 px-4 text-xs font-bold text-white">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white">
                        거래처명
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-white">
                        유형
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-white">
                        금액
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-white">
                        상태
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-white">
                        만기일
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-white">
                        정산일
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-white">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr
                        key={s.id}
                        className={`border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors ${
                          s.status === "OVERDUE" ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-xs font-mono text-[#5B6773]">
                          {s.id.slice(0, 8)}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-[#18212B]">
                          {s.client.name}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${TYPE_BADGE[s.type]}`}
                          >
                            {TYPE_LABELS[s.type]}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-bold text-[#18212B]">
                          {formatAmount(s.amount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${STATUS_BADGE[s.status]}`}
                          >
                            {STATUS_LABELS[s.status]}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-[#5B6773]">
                          {formatDate(s.dueDate)}
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-[#5B6773]">
                          {formatDate(s.settledAt)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedSettlement(s)}
                              className="p-1 hover:bg-[#E8EEF3] rounded transition-colors"
                              title="상세보기"
                            >
                              <Eye className="w-4 h-4 text-[#5B6773]" />
                            </button>
                            {s.status !== "COMPLETED" && (
                              <button
                                onClick={() => handleMarkComplete(s)}
                                className="p-1 hover:bg-green-100 rounded transition-colors"
                                title="완료 처리"
                              >
                                <CheckCircle2 className="w-4 h-4 text-[#2E7D5B]" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
              <p className="text-sm text-[#5B6773]">전체 {filtered.length}건</p>
            </div>
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {isCreateOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsCreateOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F] rounded-t-lg">
                <h2 className="text-lg font-bold text-white">정산 등록</h2>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-1">
                    거래처 *
                  </label>
                  <select
                    value={createForm.clientId}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, clientId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                  >
                    <option value="">거래처 선택</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-1">
                    유형 *
                  </label>
                  <select
                    value={createForm.type}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        type: e.target.value as SettlementType,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                  >
                    <option value="RECEIVABLE">매출채권 (RECEIVABLE)</option>
                    <option value="PAYABLE">매입채무 (PAYABLE)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-1">
                    금액 *
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={createForm.amount}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-1">
                    만기일
                  </label>
                  <input
                    type="date"
                    value={createForm.dueDate}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#18212B] mb-1">
                    메모
                  </label>
                  <textarea
                    placeholder="메모 입력..."
                    value={createForm.notes}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8] resize-none"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[#D7DEE6] flex justify-end gap-3">
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-[#D7DEE6] rounded-md text-sm text-[#5B6773] hover:bg-[#F4F7FA] transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleCreate}
                  disabled={createSettlement.isPending}
                  className="px-4 py-2 bg-[#163A5F] text-white rounded-md text-sm font-semibold hover:bg-[#0F2942] transition-colors disabled:opacity-50"
                >
                  {createSettlement.isPending ? "등록 중..." : "등록"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detail Panel */}
      <SettlementDetailPanel
        isOpen={!!selectedSettlement}
        settlement={selectedSettlement}
        onClose={() => setSelectedSettlement(null)}
        onMarkComplete={handleMarkComplete}
      />
    </div>
  );
}

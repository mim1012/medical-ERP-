import { useState } from "react";
import {
  useShipping,
  useCreateShipment,
  useUpdateShipmentStatus,
  useDeleteShipment,
} from "../../hooks/use-shipping";
import { isThisMonth } from "../../lib/format";
import type { Shipment, ShipmentStatus } from "../../hooks/use-shipping";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { ShipmentForm } from "../components/ShipmentForm";
import { ShipmentDetailPanel } from "../components/ShipmentDetailPanel";
import {
  Plus,
  Search,
  Truck,
  Clock,
  CheckCircle2,
  Package,
  Trash2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

type TabStatus = 'ALL' | ShipmentStatus;

const TAB_LIST: { label: string; value: TabStatus }[] = [
  { label: '전체', value: 'ALL' },
  { label: '승인대기', value: 'REQUESTED' },
  { label: '승인완료', value: 'APPROVED' },
  { label: '출고완료', value: 'SHIPPED' },
  { label: '배송완료', value: 'DELIVERED' },
  { label: '취소', value: 'CANCELLED' },
];

const STATUS_BADGE: Record<ShipmentStatus, { label: string; className: string }> = {
  REQUESTED: { label: '승인대기', className: 'bg-gray-100 text-gray-700' },
  APPROVED: { label: '승인완료', className: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: '출고완료', className: 'bg-yellow-100 text-yellow-700' },
  DELIVERED: { label: '배송완료', className: 'bg-green-100 text-green-700' },
  CANCELLED: { label: '취소', className: 'bg-red-100 text-red-700' },
};

function formatCurrency(amount: number) {
  return `₩${new Intl.NumberFormat('ko-KR').format(amount)}`;
}

function getShipmentTotal(shipment: Shipment) {
  return shipment.items.reduce((sum, item) => sum + parseFloat(item.unitPrice) * item.quantity, 0);
}

export function ShippingManagement() {
  const [activeMenu, setActiveMenu] = useState('shipping');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);

  const { data: shipments = [], isLoading, error } = useShipping();
  const createShipment = useCreateShipment();
  const updateStatus = useUpdateShipmentStatus();
  const deleteShipment = useDeleteShipment();

  // KPI calculations
  const requestedCount = shipments.filter((s) => s.status === 'REQUESTED').length;
  const shippedCount = shipments.filter((s) => s.status === 'SHIPPED').length;
  const deliveredThisMonth = shipments.filter(
    (s) => s.status === 'DELIVERED' && isThisMonth(s.deliveredAt)
  ).length;
  const totalThisMonth = shipments.filter((s) => isThisMonth(s.createdAt)).length;

  // Filtering
  const filtered = shipments.filter((s) => {
    const matchesTab = activeTab === 'ALL' || s.status === activeTab;
    const matchesSearch = s.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleStatusUpdate = (id: string, status: ShipmentStatus) => {
    setStockError(null);
    updateStatus.mutate(
      { id, status },
      {
        onError: (err: unknown) => {
          if (err instanceof Error) {
            setStockError(err.message);
          } else {
            setStockError('상태 변경에 실패했습니다.');
          }
        },
        onSuccess: (updated) => {
          if (selectedShipment?.id === id) {
            setSelectedShipment(updated);
          }
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('이 출고 건을 삭제하시겠습니까?')) return;
    deleteShipment.mutate(id, {
      onSuccess: () => {
        if (selectedShipment?.id === id) setSelectedShipment(null);
      },
    });
  };

  const handleCreateSubmit = (dto: Parameters<typeof createShipment.mutate>[0]) => {
    createShipment.mutate(dto, {
      onSuccess: () => setIsFormOpen(false),
    });
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
        {/* Page Title */}
        <div className="bg-white border-b border-[#D7DEE6] px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#18212B] mb-1">출고/판매 관리</h1>
              <p className="text-[#5B6773]">출고 현황 및 상태 관리</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#163A5F] text-white rounded-lg hover:bg-[#0F2942] transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              신규 출고 등록
            </button>
          </div>
        </div>

        <div className="px-4 lg:px-8 py-6 space-y-6">
          {/* Stock error alert */}
          {stockError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">출고 처리 실패</p>
                <p className="text-sm text-red-600 mt-1">{stockError}</p>
              </div>
              <button
                onClick={() => setStockError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                &times;
              </button>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#5B6773]">승인 대기</p>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-[#18212B]">{requestedCount}</p>
              <p className="text-xs text-[#5B6773] mt-1">건</p>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#5B6773]">배송 중</p>
                <Truck className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{shippedCount}</p>
              <p className="text-xs text-[#5B6773] mt-1">건</p>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#5B6773]">이달 배송완료</p>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-600">{deliveredThisMonth}</p>
              <p className="text-xs text-[#5B6773] mt-1">건</p>
            </div>
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#5B6773]">이달 전체</p>
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{totalThisMonth}</p>
              <p className="text-xs text-[#5B6773] mt-1">건</p>
            </div>
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-[#D7DEE6]">
              {TAB_LIST.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex-shrink-0 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab.value
                      ? 'border-[#163A5F] text-[#163A5F]'
                      : 'border-transparent text-[#5B6773] hover:text-[#18212B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                <input
                  type="text"
                  placeholder="거래처명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                />
              </div>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="p-12 text-center text-[#5B6773]">로딩 중...</div>
            ) : error ? (
              <div className="p-12 text-center text-red-500">데이터를 불러올 수 없습니다.</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-[#5B6773]">
                <Package className="w-12 h-12 text-[#D7DEE6] mx-auto mb-3" />
                <p>출고 내역이 없습니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F4F7FA] border-b border-[#D7DEE6]">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#5B6773]">출고번호</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#5B6773]">거래처</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-[#5B6773]">품목</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-[#5B6773]">합계</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-[#5B6773]">상태</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-[#5B6773]">등록일</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-[#5B6773]">처리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((shipment) => {
                      const badge = STATUS_BADGE[shipment.status];
                      const total = getShipmentTotal(shipment);
                      return (
                        <tr
                          key={shipment.id}
                          className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors cursor-pointer"
                          onClick={() => setSelectedShipment(shipment)}
                        >
                          <td className="py-3 px-4">
                            <span className="text-sm font-mono text-[#5B6773]">
                              #{shipment.id.slice(0, 8)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm font-semibold text-[#18212B]">{shipment.client.name}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-sm text-[#5B6773]">{shipment.items.length}개 품목</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-sm font-bold text-[#163A5F]">{formatCurrency(total)}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-sm text-[#5B6773]">
                              {new Date(shipment.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                          </td>
                          <td
                            className="py-3 px-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              {shipment.status === 'REQUESTED' && (
                                <button
                                  onClick={() => handleStatusUpdate(shipment.id, 'APPROVED')}
                                  disabled={updateStatus.isPending}
                                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60"
                                >
                                  승인
                                </button>
                              )}
                              {shipment.status === 'APPROVED' && (
                                <button
                                  onClick={() => handleStatusUpdate(shipment.id, 'SHIPPED')}
                                  disabled={updateStatus.isPending}
                                  className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors font-semibold disabled:opacity-60"
                                >
                                  출고처리
                                </button>
                              )}
                              {shipment.status === 'SHIPPED' && (
                                <button
                                  onClick={() => handleStatusUpdate(shipment.id, 'DELIVERED')}
                                  disabled={updateStatus.isPending}
                                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold disabled:opacity-60"
                                >
                                  배송완료
                                </button>
                              )}
                              {shipment.status === 'REQUESTED' && (
                                <button
                                  onClick={() => handleDelete(shipment.id)}
                                  disabled={deleteShipment.isPending}
                                  className="p-1 hover:bg-red-50 rounded transition-colors disabled:opacity-60"
                                >
                                  <Trash2 className="w-4 h-4 text-[#B94A48]" />
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedShipment(shipment)}
                                className="p-1 hover:bg-[#E8EEF3] rounded transition-colors"
                              >
                                <ChevronRight className="w-4 h-4 text-[#5B6773]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create modal */}
      <ShipmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateSubmit}
        isSubmitting={createShipment.isPending}
      />

      {/* Detail panel */}
      <ShipmentDetailPanel
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        onStatusUpdate={handleStatusUpdate}
        isUpdating={updateStatus.isPending}
      />
    </div>
  );
}

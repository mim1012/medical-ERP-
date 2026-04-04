import { useState } from "react";
import { useInventory, useAdjustInventory, type InventoryItem } from "../../hooks/use-inventory";
import { formatDate } from "../../lib/format";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { InventoryDetailPanel } from "../components/InventoryDetailPanel";
import {
  Search,
  Package,
  AlertTriangle,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

type StatusFilter = "전체" | "정상" | "재고부족" | "품절";

function getStatus(item: InventoryItem): "정상" | "재고부족" | "품절" {
  if (item.quantity === 0) return "품절";
  if (item.quantity <= item.safetyStock) return "재고부족";
  return "정상";
}

function isRecentlyUpdated(iso: string): boolean {
  const updated = new Date(iso).getTime();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return updated >= sevenDaysAgo;
}

interface AdjustModalProps {
  item: InventoryItem;
  onClose: () => void;
  onSubmit: (delta: number) => void;
  isPending: boolean;
}

function AdjustModal({ item, onClose, onSubmit, isPending }: AdjustModalProps) {
  const [delta, setDelta] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(delta, 10);
    if (isNaN(qty) || qty === 0) return;
    onSubmit(qty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-6 z-10">
        <h2 className="text-lg font-bold text-[#18212B] mb-1">재고 조정</h2>
        <p className="text-sm text-[#5B6773] mb-4">{item.product.name}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#18212B] mb-1.5">
              조정 수량 <span className="text-[#5B6773] font-normal">(양수=입고, 음수=출고)</span>
            </label>
            <input
              type="number"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              placeholder="예: 10 또는 -5"
              className="w-full px-3 py-2 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
              required
            />
            <p className="text-xs text-[#5B6773] mt-1">현재 수량: {item.quantity}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#D7DEE6] rounded-md text-sm text-[#5B6773] hover:bg-[#F4F7FA] transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-[#163A5F] text-white rounded-md text-sm font-semibold hover:bg-[#0F2942] transition-colors disabled:opacity-50"
            >
              {isPending ? "처리중..." : "확인"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function InventoryManagement() {
  const [activeMenu, setActiveMenu] = useState("inventory");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("전체");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<InventoryItem | null>(null);

  const { data: items = [], isLoading, error } = useInventory();
  const adjustInventory = useAdjustInventory();

  const totalCount = items.length;
  const lowStockCount = items.filter((i) => i.quantity <= i.safetyStock && i.quantity > 0).length;
  const outOfStockCount = items.filter((i) => i.quantity === 0).length;
  const recentCount = items.filter((i) => isRecentlyUpdated(i.updatedAt)).length;

  const filtered = items.filter((item) => {
    const name = item.product.name.toLowerCase();
    const category = (item.product.category ?? "").toLowerCase();
    const brand = (item.product.brand ?? "").toLowerCase();
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || name.includes(q) || category.includes(q) || brand.includes(q);

    const status = getStatus(item);
    const matchesStatus =
      statusFilter === "전체" ||
      (statusFilter === "정상" && status === "정상") ||
      (statusFilter === "재고부족" && status === "재고부족") ||
      (statusFilter === "품절" && status === "품절");

    return matchesSearch && matchesStatus;
  });

  const statusTabs: StatusFilter[] = ["전체", "정상", "재고부족", "품절"];

  const statusBadgeClass = (status: "정상" | "재고부족" | "품절") => {
    if (status === "정상") return "bg-[#E6F4EA] text-[#2E7D5B] border border-[#2E7D5B]";
    if (status === "재고부족") return "bg-[#FEF9E7] text-[#C58A2B] border border-[#C58A2B]";
    return "bg-[#FEF2F2] text-[#B94A48] border border-[#B94A48]";
  };

  const handleAdjustSubmit = (delta: number) => {
    if (!adjustTarget) return;
    adjustInventory.mutate(
      { id: adjustTarget.id, quantity: delta },
      { onSuccess: () => setAdjustTarget(null) }
    );
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
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#18212B] mb-2">재고 관리</h1>
            <p className="text-sm lg:text-base text-[#5B6773]">재고 현황 조회 및 수량 조정</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-white rounded-lg border border-[#D7DEE6] p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-[#5B8DB8]" />
                <p className="text-xs lg:text-sm text-[#5B6773]">전체 재고</p>
              </div>
              <p className="text-xl lg:text-3xl font-bold text-[#18212B]">{totalCount}</p>
              <p className="text-[10px] lg:text-xs text-[#5B6773] mt-1">품목</p>
            </div>

            <div className="bg-white rounded-lg border border-[#D7DEE6] p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#C58A2B]" />
                <p className="text-xs lg:text-sm text-[#5B6773]">재고 부족</p>
              </div>
              <p className="text-xl lg:text-3xl font-bold text-[#C58A2B]">{lowStockCount}</p>
              <p className="text-[10px] lg:text-xs text-[#C58A2B] mt-1">안전재고 이하</p>
            </div>

            <div className="bg-white rounded-lg border border-[#D7DEE6] p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#B94A48]" />
                <p className="text-xs lg:text-sm text-[#5B6773]">품절</p>
              </div>
              <p className="text-xl lg:text-3xl font-bold text-[#B94A48]">{outOfStockCount}</p>
              <p className="text-[10px] lg:text-xs text-[#B94A48] mt-1">수량 0</p>
            </div>

            <div className="bg-white rounded-lg border border-[#D7DEE6] p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-[#2E7D5B]" />
                <p className="text-xs lg:text-sm text-[#5B6773]">최근 업데이트</p>
              </div>
              <p className="text-xl lg:text-3xl font-bold text-[#2E7D5B]">{recentCount}</p>
              <p className="text-[10px] lg:text-xs text-[#5B6773] mt-1">7일 이내</p>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-[#D7DEE6] shadow-sm">
            {/* Search + Filter */}
            <div className="px-4 lg:px-6 py-4 border-b border-[#D7DEE6]">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6773]" />
                  <input
                    type="text"
                    placeholder="품목명, 카테고리, 브랜드 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-[#D7DEE6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DB8]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#5B6773]" />
                  <div className="flex gap-1">
                    {statusTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setStatusFilter(tab)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                          statusFilter === tab
                            ? "bg-[#163A5F] text-white"
                            : "border border-[#D7DEE6] text-[#5B6773] hover:bg-[#F4F7FA]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading / Error */}
            {isLoading && (
              <div className="p-8">
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-[#F4F7FA] rounded animate-pulse" />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="p-8 text-center text-[#B94A48]">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">데이터를 불러오는 중 오류가 발생했습니다.</p>
              </div>
            )}

            {/* Desktop Table */}
            {!isLoading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full hidden lg:table">
                  <thead>
                    <tr className="border-b-2 border-[#D7DEE6] bg-[#163A5F]">
                      <th className="text-left py-3 px-4 text-xs font-bold text-white min-w-[180px]">품목명</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white min-w-[100px]">카테고리</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white min-w-[100px]">브랜드</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-white min-w-[120px]">LOT No</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-white min-w-[80px]">수량</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-white min-w-[90px]">안전재고</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-white min-w-[90px]">상태</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-white min-w-[100px]">최종 업데이트</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-white min-w-[90px]">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => {
                      const status = getStatus(item);
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-[#D7DEE6] hover:bg-[#F4F7FA] transition-colors"
                        >
                          <td className="py-3 px-4 text-xs font-semibold text-[#18212B]">
                            {item.product.name}
                          </td>
                          <td className="py-3 px-4 text-xs text-[#5B6773]">
                            {item.product.category ?? "-"}
                          </td>
                          <td className="py-3 px-4 text-xs text-[#5B6773]">
                            {item.product.brand ?? "-"}
                          </td>
                          <td className="py-3 px-4 text-xs font-mono text-[#5B6773]">
                            {item.lotNumber ?? "-"}
                          </td>
                          <td className="py-3 px-4 text-xs text-right font-semibold text-[#18212B]">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-xs text-right text-[#5B6773]">
                            {item.safetyStock}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadgeClass(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-center text-[#5B6773]">
                            {formatDate(item.updatedAt)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setSelectedItem(item)}
                                className="p-1.5 hover:bg-[#E8EEF3] rounded transition-colors"
                                title="상세보기"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#5B6773]" />
                              </button>
                              <button
                                onClick={() => setAdjustTarget(item)}
                                className="px-2 py-1 text-[10px] font-semibold bg-[#F4F7FA] border border-[#D7DEE6] rounded hover:bg-[#E8EEF3] transition-colors text-[#5B6773]"
                              >
                                조정
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-sm text-[#5B6773]">
                          검색 결과가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Mobile Cards */}
                <div className="lg:hidden p-4 space-y-3">
                  {filtered.map((item) => {
                    const status = getStatus(item);
                    return (
                      <div
                        key={item.id}
                        className="border border-[#D7DEE6] rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#18212B] mb-1">{item.product.name}</p>
                            <p className="text-xs text-[#5B6773]">{item.product.category ?? "-"} / {item.product.brand ?? "-"}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadgeClass(status)}`}>
                            {status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                          <div>
                            <p className="text-[10px] text-[#5B6773]">수량</p>
                            <p className="text-sm font-bold text-[#18212B]">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#5B6773]">안전재고</p>
                            <p className="text-sm font-bold text-[#5B6773]">{item.safetyStock}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#5B6773]">LOT</p>
                            <p className="text-xs font-mono text-[#5B6773]">{item.lotNumber ?? "-"}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-[#D7DEE6] rounded text-xs text-[#5B6773] hover:bg-[#F4F7FA]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            상세보기
                          </button>
                          <button
                            onClick={() => setAdjustTarget(item)}
                            className="flex-1 py-1.5 border border-[#D7DEE6] rounded text-xs text-[#5B6773] hover:bg-[#F4F7FA]"
                          >
                            조정
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {filtered.length === 0 && (
                    <p className="text-center text-sm text-[#5B6773] py-8">검색 결과가 없습니다.</p>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-4 lg:px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
              <p className="text-sm text-[#5B6773]">전체 {filtered.length}개 재고 항목</p>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Panel */}
      <InventoryDetailPanel
        isOpen={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAdjust={(item) => {
          setSelectedItem(null);
          setAdjustTarget(item);
        }}
      />

      {/* Adjust Modal */}
      {adjustTarget && (
        <AdjustModal
          item={adjustTarget}
          onClose={() => setAdjustTarget(null)}
          onSubmit={handleAdjustSubmit}
          isPending={adjustInventory.isPending}
        />
      )}
    </div>
  );
}

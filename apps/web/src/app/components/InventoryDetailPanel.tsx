import { X, Package, Hash, SlidersHorizontal } from "lucide-react";
import type { InventoryItem } from "../../hooks/use-inventory";
import { formatDate } from "../../lib/format";

interface InventoryDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onAdjust: (item: InventoryItem) => void;
}

function getStatus(item: InventoryItem): "정상" | "재고부족" | "품절" {
  if (item.quantity === 0) return "품절";
  if (item.quantity <= item.safetyStock) return "재고부족";
  return "정상";
}

function statusBadgeClass(status: "정상" | "재고부족" | "품절"): string {
  if (status === "정상") return "bg-[#E6F4EA] text-[#2E7D5B] border border-[#2E7D5B]";
  if (status === "재고부족") return "bg-[#FEF9E7] text-[#C58A2B] border border-[#C58A2B]";
  return "bg-[#FEF2F2] text-[#B94A48] border border-[#B94A48]";
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-[#5B6773] mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-[#18212B]">{value ?? "-"}</p>
    </div>
  );
}

export function InventoryDetailPanel({ isOpen, onClose, item, onAdjust }: InventoryDetailPanelProps) {
  if (!isOpen || !item) return null;

  const status = getStatus(item);
  const p = item.product;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div>
            <h2 className="text-xl font-bold text-white">재고 상세</h2>
            <p className="text-sm text-[#5B8DB8] mt-0.5">{p.name}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status + quantity */}
          <div className="bg-[#F4F7FA] rounded-lg p-4 border border-[#D7DEE6]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#163A5F]" />
                <span className="text-sm font-bold text-[#18212B]">재고 현황</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadgeClass(status)}`}>
                {status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-[#D7DEE6]">
                <p className="text-xs text-[#5B6773] mb-1">현재 수량</p>
                <p className="text-2xl font-bold text-[#18212B]">{item.quantity}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-[#D7DEE6]">
                <p className="text-xs text-[#5B6773] mb-1">안전재고</p>
                <p className="text-2xl font-bold text-[#5B6773]">{item.safetyStock}</p>
              </div>
            </div>
          </div>

          {/* Inventory info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-[#163A5F]" />
              <h3 className="text-sm font-bold text-[#18212B]">재고 정보</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="LOT 번호" value={item.lotNumber} />
              <Field label="최종 업데이트" value={formatDate(item.updatedAt)} />
            </div>
          </div>

          {/* Product info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-[#163A5F]" />
              <h3 className="text-sm font-bold text-[#18212B]">제품 정보</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="제품명" value={p.name} />
              <Field label="카테고리" value={p.category} />
              <Field label="브랜드" value={p.brand} />
              <Field label="모델" value={p.model} />
              <Field label="허가번호" value={p.licenseNumber} />
              <Field
                label="단가"
                value={
                  p.unitPrice != null
                    ? `${p.unitPrice.toLocaleString("ko-KR")}원`
                    : undefined
                }
              />
            </div>
            {p.description && (
              <div className="mt-4">
                <p className="text-xs text-[#5B6773] mb-0.5">설명</p>
                <p className="text-sm text-[#18212B] leading-relaxed">{p.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <button
            onClick={() => onAdjust(item)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#163A5F] text-white rounded-md text-sm font-semibold hover:bg-[#0F2942] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            재고 조정
          </button>
        </div>
      </div>
    </>
  );
}

import { X, Package, Calendar, Warehouse, Hash, AlertTriangle, TrendingUp } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface InventoryItem {
  productCode: string;
  productName: string;
  modelName: string;
  lotNumber: string;
  serialNumber: string;
  receivedDate: string;
  manufactureDate: string;
  expiryDate: string;
  warehouse: string;
  currentQty: number;
  reservedQty: number;
  availableQty: number;
  status: string;
  daysUntilExpiry: number;
}

interface InventoryDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[] | null;
  title: string;
}

export function InventoryDetailPanel({ isOpen, onClose, items, title }: InventoryDetailPanelProps) {
  if (!isOpen || !items) return null;

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-[#5B8DB8] mt-1">총 {items.length}개</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={`${item.productCode}-${item.lotNumber}-${index}`}
                className="border border-[#D7DEE6] rounded-lg p-5 hover:bg-[#F4F7FA] transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-[#163A5F]" />
                      <h3 className="text-lg font-bold text-[#18212B]">{item.productName}</h3>
                    </div>
                    <p className="text-sm text-[#5B6773] font-mono">{item.productCode}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#D7DEE6]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">모델명</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{item.modelName}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Warehouse className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">창고</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{item.warehouse}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">로트번호</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6 font-mono">{item.lotNumber}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">시리얼번호</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6 font-mono">{item.serialNumber}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">입고일</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{item.receivedDate}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">제조일</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{item.manufactureDate}</p>
                  </div>
                </div>

                {/* Expiry Info */}
                {item.expiryDate !== '-' && (
                  <div className={`rounded-lg p-4 mb-4 border ${item.daysUntilExpiry < 60 ? 'bg-[#FEF2F2] border-[#B94A48]' : 'bg-[#F4F7FA] border-[#D7DEE6]'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {item.daysUntilExpiry < 60 && <AlertTriangle className="w-4 h-4 text-[#B94A48]" />}
                      <p className="text-xs text-[#5B6773] font-semibold">유효기한 정보</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#5B6773] mb-1">만료일</p>
                        <p className="text-sm font-bold text-[#18212B]">{item.expiryDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#5B6773] mb-1">남은 기간</p>
                        <p className={`text-lg font-bold ${item.daysUntilExpiry < 60 ? 'text-[#B94A48]' : 'text-[#2E7D5B]'}`}>
                          {item.daysUntilExpiry}일
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity Info */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#F4F7FA] rounded-lg p-3 border border-[#D7DEE6]">
                    <p className="text-xs text-[#5B6773] mb-1">현재수량</p>
                    <p className="text-lg font-bold text-[#18212B]">{formatNumber(item.currentQty)}</p>
                  </div>
                  <div className="bg-[#FEF9E7] rounded-lg p-3 border border-[#C58A2B]">
                    <p className="text-xs text-[#5B6773] mb-1">예약수량</p>
                    <p className="text-lg font-bold text-[#C58A2B]">{formatNumber(item.reservedQty)}</p>
                  </div>
                  <div className="bg-[#E6F4EA] rounded-lg p-3 border border-[#2E7D5B]">
                    <p className="text-xs text-[#5B6773] mb-1">가용수량</p>
                    <p className="text-lg font-bold text-[#2E7D5B]">{formatNumber(item.availableQty)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#5B6773] mb-1">총 현재수량</p>
              <p className="text-lg font-bold text-[#18212B]">
                {formatNumber(items.reduce((sum, item) => sum + item.currentQty, 0))}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5B6773] mb-1">총 예약수량</p>
              <p className="text-lg font-bold text-[#C58A2B]">
                {formatNumber(items.reduce((sum, item) => sum + item.reservedQty, 0))}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5B6773] mb-1">총 가용수량</p>
              <p className="text-lg font-bold text-[#2E7D5B]">
                {formatNumber(items.reduce((sum, item) => sum + item.availableQty, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

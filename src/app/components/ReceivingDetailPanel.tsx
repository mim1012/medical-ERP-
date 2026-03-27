import { X, PackageCheck, Calendar, Building2, User, DollarSign, Package } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface PurchaseOrder {
  poNumber: string;
  orderDate: string;
  supplier: string;
  manager: string;
  expectedDate: string;
  totalAmount: number;
  items: number;
  status: string;
  receivedQty: number;
  totalQty: number;
}

interface ReceivingDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  orders: PurchaseOrder[] | null;
  title: string;
}

export function ReceivingDetailPanel({ isOpen, onClose, orders, title }: ReceivingDetailPanelProps) {
  if (!isOpen || !orders) return null;

  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString('ko-KR')}`;
  };

  const getProgressPercentage = (received: number, total: number) => {
    return total > 0 ? Math.round((received / total) * 100) : 0;
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
            <p className="text-sm text-[#5B8DB8] mt-1">총 {orders.length}건</p>
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
            {orders.map((order) => (
              <div 
                key={order.poNumber}
                className="border border-[#D7DEE6] rounded-lg p-5 hover:bg-[#F4F7FA] transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <PackageCheck className="w-5 h-5 text-[#163A5F]" />
                      <h3 className="text-lg font-bold text-[#18212B]">{order.poNumber}</h3>
                    </div>
                    <p className="text-sm text-[#5B6773]">발주일: {order.orderDate}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#D7DEE6]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">공급업체</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{order.supplier}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">담당자</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{order.manager}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">입고예정일</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{order.expectedDate}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">품목 수</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{order.items}개</p>
                  </div>
                </div>

                {/* Progress Bar */}
                {order.totalQty > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#5B6773]">입고 진행률</span>
                      <span className="text-sm font-bold text-[#163A5F]">
                        {order.receivedQty} / {order.totalQty} ({getProgressPercentage(order.receivedQty, order.totalQty)}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#E8EEF3] rounded-full h-2.5">
                      <div 
                        className="bg-[#2E7D5B] h-2.5 rounded-full transition-all"
                        style={{ width: `${getProgressPercentage(order.receivedQty, order.totalQty)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Amount Display */}
                <div className="bg-[#E8F4F8] rounded-lg p-4 border border-[#5B8DB8]">
                  <p className="text-xs text-[#5B6773] mb-2">발주 금액</p>
                  <p className="text-2xl font-bold text-[#163A5F]">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#18212B]">
              총 발주 금액
            </p>
            <p className="text-xl font-bold text-[#163A5F]">
              {formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

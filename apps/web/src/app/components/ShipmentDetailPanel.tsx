import { X, Truck, Calendar, Building2, Package, DollarSign, User, FileText } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface Shipment {
  shipmentNumber: string;
  shipmentDate: string;
  client: string;
  itemsCount: number;
  totalAmount: number;
  shipmentStatus: string;
  invoiceStatus: string;
  salesRep: string;
}

interface ShipmentDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  shipments: Shipment[] | null;
  title: string;
}

export function ShipmentDetailPanel({ isOpen, onClose, shipments, title }: ShipmentDetailPanelProps) {
  if (!isOpen || !shipments) return null;

  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString('ko-KR')}`;
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
            <p className="text-sm text-[#5B8DB8] mt-1">총 {shipments.length}건</p>
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
            {shipments.map((shipment) => (
              <div 
                key={shipment.shipmentNumber}
                className="border border-[#D7DEE6] rounded-lg p-5 hover:bg-[#F4F7FA] transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-[#163A5F]" />
                      <h3 className="text-lg font-bold text-[#18212B]">{shipment.shipmentNumber}</h3>
                    </div>
                    <p className="text-sm text-[#5B6773]">{shipment.shipmentDate}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={shipment.shipmentStatus} />
                    <StatusBadge status={shipment.invoiceStatus} />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#D7DEE6]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">거래처</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{shipment.client}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">담당자</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{shipment.salesRep}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">품목 수</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{shipment.itemsCount}개</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">총 금액</p>
                    </div>
                    <p className="text-sm font-bold text-[#163A5F] ml-6">{formatCurrency(shipment.totalAmount)}</p>
                  </div>
                </div>

                {/* Amount Display */}
                <div className="bg-[#E8F4F8] rounded-lg p-4 border border-[#5B8DB8]">
                  <p className="text-xs text-[#5B6773] mb-2">출고 금액</p>
                  <p className="text-2xl font-bold text-[#163A5F]">{formatCurrency(shipment.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#18212B]">
              총 출고 금액
            </p>
            <p className="text-xl font-bold text-[#163A5F]">
              {formatCurrency(shipments.reduce((sum, shipment) => sum + shipment.totalAmount, 0))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

import { X, Truck, Calendar, Building2, Package, MapPin, Phone } from "lucide-react";
import type { Shipment, ShipmentStatus } from "../../hooks/use-shipping";

interface ShipmentDetailPanelProps {
  shipment: Shipment | null;
  onClose: () => void;
  onStatusUpdate: (id: string, status: ShipmentStatus) => void;
  isUpdating?: boolean;
}

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  REQUESTED: '승인대기',
  APPROVED: '승인완료',
  SHIPPED: '출고완료',
  DELIVERED: '배송완료',
  CANCELLED: '취소',
};

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  REQUESTED: 'bg-gray-100 text-gray-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-yellow-100 text-yellow-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const CLIENT_TYPE_LABELS: Record<string, string> = {
  HOSPITAL: '병원',
  CLINIC: '의원',
  PHARMACY: '약국',
  OTHER: '기타',
};

export function ShipmentDetailPanel({ shipment, onClose, onStatusUpdate, isUpdating }: ShipmentDetailPanelProps) {
  if (!shipment) return null;

  const formatCurrency = (amount: number) =>
    `₩${new Intl.NumberFormat('ko-KR').format(amount)}`;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const totalAmount = shipment.items.reduce(
    (sum, item) => sum + parseFloat(item.unitPrice) * item.quantity,
    0
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div>
            <h2 className="text-xl font-bold text-white">출고 상세</h2>
            <p className="text-sm text-[#5B8DB8] mt-1">#{shipment.id.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[shipment.status]}`}>
              {STATUS_LABELS[shipment.status]}
            </span>
            <div className="flex gap-2">
              {shipment.status === 'REQUESTED' && (
                <button
                  onClick={() => onStatusUpdate(shipment.id, 'APPROVED')}
                  disabled={isUpdating}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60"
                >
                  승인
                </button>
              )}
              {shipment.status === 'APPROVED' && (
                <button
                  onClick={() => onStatusUpdate(shipment.id, 'SHIPPED')}
                  disabled={isUpdating}
                  className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors font-semibold disabled:opacity-60"
                >
                  출고처리
                </button>
              )}
              {shipment.status === 'SHIPPED' && (
                <button
                  onClick={() => onStatusUpdate(shipment.id, 'DELIVERED')}
                  disabled={isUpdating}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors font-semibold disabled:opacity-60"
                >
                  배송완료
                </button>
              )}
            </div>
          </div>

          {/* Client info */}
          <div className="border border-[#D7DEE6] rounded-lg p-4">
            <h3 className="text-sm font-bold text-[#18212B] mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#163A5F]" />
              거래처 정보
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-[#5B6773]">거래처명</p>
                <p className="text-sm font-semibold text-[#18212B]">{shipment.client.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#5B6773]">유형</p>
                <p className="text-sm font-semibold text-[#18212B]">
                  {CLIENT_TYPE_LABELS[shipment.client.type] ?? shipment.client.type}
                </p>
              </div>
              {shipment.client.phone && (
                <div className="flex items-start gap-1">
                  <Phone className="w-3 h-3 text-[#5B6773] mt-0.5" />
                  <div>
                    <p className="text-xs text-[#5B6773]">연락처</p>
                    <p className="text-sm font-semibold text-[#18212B]">{shipment.client.phone}</p>
                  </div>
                </div>
              )}
              {shipment.client.address && (
                <div className="flex items-start gap-1">
                  <MapPin className="w-3 h-3 text-[#5B6773] mt-0.5" />
                  <div>
                    <p className="text-xs text-[#5B6773]">주소</p>
                    <p className="text-sm font-semibold text-[#18212B]">{shipment.client.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="border border-[#D7DEE6] rounded-lg p-4">
            <h3 className="text-sm font-bold text-[#18212B] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#163A5F]" />
              일정 정보
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-[#5B6773]">등록일</p>
                <p className="text-sm font-semibold text-[#18212B]">{formatDate(shipment.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-[#5B6773]">출고일</p>
                <p className="text-sm font-semibold text-[#18212B]">{formatDate(shipment.shippedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-[#5B6773]">배송완료일</p>
                <p className="text-sm font-semibold text-[#18212B]">{formatDate(shipment.deliveredAt)}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="border border-[#D7DEE6] rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-[#F4F7FA] border-b border-[#D7DEE6]">
              <h3 className="text-sm font-bold text-[#18212B] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#163A5F]" />
                출고 품목 ({shipment.items.length}개)
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D7DEE6]">
                  <th className="text-left py-2 px-4 text-xs font-semibold text-[#5B6773]">품목명</th>
                  <th className="text-center py-2 px-4 text-xs font-semibold text-[#5B6773]">수량</th>
                  <th className="text-right py-2 px-4 text-xs font-semibold text-[#5B6773]">단가</th>
                  <th className="text-right py-2 px-4 text-xs font-semibold text-[#5B6773]">소계</th>
                </tr>
              </thead>
              <tbody>
                {shipment.items.map((item) => {
                  const price = parseFloat(item.unitPrice);
                  return (
                    <tr key={item.id} className="border-b border-[#D7DEE6] last:border-0">
                      <td className="py-2 px-4 text-sm text-[#18212B]">{item.product.name}</td>
                      <td className="py-2 px-4 text-sm text-center text-[#18212B]">{item.quantity}</td>
                      <td className="py-2 px-4 text-sm text-right text-[#18212B]">{formatCurrency(price)}</td>
                      <td className="py-2 px-4 text-sm text-right font-semibold text-[#163A5F]">
                        {formatCurrency(price * item.quantity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Notes */}
          {shipment.notes && (
            <div className="border border-[#D7DEE6] rounded-lg p-4">
              <p className="text-xs text-[#5B6773] mb-1">메모</p>
              <p className="text-sm text-[#18212B]">{shipment.notes}</p>
            </div>
          )}
        </div>

        {/* Footer total */}
        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#163A5F]" />
              <span className="text-sm font-semibold text-[#18212B]">총 출고금액</span>
            </div>
            <span className="text-xl font-bold text-[#163A5F]">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

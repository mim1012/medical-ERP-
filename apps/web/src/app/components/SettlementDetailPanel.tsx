import { X, Building2, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Settlement } from "../../hooks/use-settlement";

interface SettlementDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: Settlement | null;
  onMarkComplete: (settlement: Settlement) => void;
}

const TYPE_LABELS = { RECEIVABLE: "매출채권", PAYABLE: "매입채무" } as const;
const STATUS_LABELS = {
  PENDING: "미수",
  PARTIAL: "일부수금",
  COMPLETED: "완료",
  OVERDUE: "연체",
} as const;
const TYPE_BADGE = {
  RECEIVABLE: "bg-blue-100 text-blue-700",
  PAYABLE: "bg-red-100 text-red-700",
} as const;
const STATUS_BADGE = {
  PENDING: "bg-gray-100 text-gray-700",
  PARTIAL: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
} as const;

const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString("ko-KR") : "-";

export function SettlementDetailPanel({
  isOpen,
  onClose,
  settlement,
  onMarkComplete,
}: SettlementDetailPanelProps) {
  if (!isOpen || !settlement) return null;

  const amount = parseFloat(settlement.amount);
  const formattedAmount = `₩${amount.toLocaleString("ko-KR")}`;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div>
            <h2 className="text-xl font-bold text-white">정산 상세</h2>
            <p className="text-sm text-[#5B8DB8] mt-1">
              {settlement.id.slice(0, 8)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Client Info */}
          <div className="bg-[#F4F7FA] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-[#5B6773]" />
              <p className="text-sm font-bold text-[#18212B]">
                {settlement.client.name}
              </p>
            </div>
            {settlement.client.phone && (
              <p className="text-xs text-[#5B6773] ml-6">
                {settlement.client.phone}
              </p>
            )}
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#5B6773] mb-1">유형</p>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-semibold ${TYPE_BADGE[settlement.type]}`}
              >
                {TYPE_LABELS[settlement.type]}
              </span>
            </div>
            <div>
              <p className="text-xs text-[#5B6773] mb-1">상태</p>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-semibold ${STATUS_BADGE[settlement.status]}`}
              >
                {STATUS_LABELS[settlement.status]}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="border border-[#D7DEE6] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#163A5F]" />
              <p className="text-xs text-[#5B6773]">금액</p>
            </div>
            <p className="text-2xl font-bold text-[#163A5F]">
              {formattedAmount}
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#5B6773] mb-1">만기일</p>
              <p className="text-sm font-semibold text-[#18212B]">
                {formatDate(settlement.dueDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5B6773] mb-1">정산일</p>
              <p className="text-sm font-semibold text-[#18212B]">
                {formatDate(settlement.settledAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5B6773] mb-1">등록일</p>
              <p className="text-sm font-semibold text-[#18212B]">
                {formatDate(settlement.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5B6773] mb-1">수정일</p>
              <p className="text-sm font-semibold text-[#18212B]">
                {formatDate(settlement.updatedAt)}
              </p>
            </div>
          </div>

          {/* Notes */}
          {settlement.notes && (
            <div>
              <p className="text-xs text-[#5B6773] mb-1">메모</p>
              <p className="text-sm text-[#18212B] bg-[#F4F7FA] rounded-lg p-3">
                {settlement.notes}
              </p>
            </div>
          )}

          {/* Overdue warning */}
          {settlement.status === "OVERDUE" && (
            <div className="bg-[#FCEBE9] rounded-lg p-4 border border-[#B94A48] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#B94A48] flex-shrink-0" />
              <p className="text-sm font-semibold text-[#B94A48]">
                연체 상태입니다. 즉시 수금 조치가 필요합니다.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          {settlement.status !== "COMPLETED" ? (
            <button
              onClick={() => onMarkComplete(settlement)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2E7D5B] text-white rounded-md hover:bg-[#245E45] transition-colors font-semibold"
            >
              <CheckCircle2 className="w-5 h-5" />
              완료 처리 (정산일: 오늘)
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-3 text-[#2E7D5B]">
              <CheckCircle2 className="w-5 h-5" />
              <p className="font-semibold">정산 완료</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

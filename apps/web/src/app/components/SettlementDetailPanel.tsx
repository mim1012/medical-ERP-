import { X, DollarSign, Building2, Calendar, CreditCard, FileText, AlertCircle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface Settlement {
  settlementNumber: string;
  clientName: string;
  period: string;
  supplyAmount: number;
  taxAmount: number;
  totalAmount: number;
  receivedAmount: number;
  unpaidAmount: number;
  status: string;
  daysOverdue?: number;
}

interface SettlementDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settlements: Settlement[] | null;
  title: string;
}

export function SettlementDetailPanel({ isOpen, onClose, settlements, title }: SettlementDetailPanelProps) {
  if (!isOpen || !settlements) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const totalSum = settlements.reduce((sum, s) => sum + s.totalAmount, 0);
  const receivedSum = settlements.reduce((sum, s) => sum + s.receivedAmount, 0);
  const unpaidSum = settlements.reduce((sum, s) => sum + s.unpaidAmount, 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-3xl bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D7DEE6] bg-[#163A5F]">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-[#5B8DB8] mt-1">총 {settlements.length}건</p>
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
            {settlements.map((settlement) => (
              <div 
                key={settlement.settlementNumber}
                className="border border-[#D7DEE6] rounded-lg p-5 hover:bg-[#F4F7FA] transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-[#163A5F]" />
                      <h3 className="text-lg font-bold text-[#18212B]">{settlement.settlementNumber}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#5B6773]">{settlement.period}</span>
                      {settlement.daysOverdue && settlement.daysOverdue > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-[#FCEBE9] text-[#B94A48] rounded font-bold">
                          {settlement.daysOverdue}일 연체
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={settlement.status} />
                </div>

                {/* Client Info */}
                <div className="bg-[#F4F7FA] rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#5B6773]" />
                    <p className="text-sm font-bold text-[#18212B]">{settlement.clientName}</p>
                  </div>
                </div>

                {/* Amount Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#D7DEE6]">
                  <div>
                    <p className="text-xs text-[#5B6773] mb-1">공급가액</p>
                    <p className="text-base font-bold text-[#18212B]">
                      ₩{formatCurrency(settlement.supplyAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#5B6773] mb-1">부가세</p>
                    <p className="text-base font-bold text-[#18212B]">
                      ₩{formatCurrency(settlement.taxAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#5B6773] mb-1">청구금액</p>
                    <p className="text-lg font-bold text-[#163A5F]">
                      ₩{formatCurrency(settlement.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#5B6773] mb-1">수금금액</p>
                    <p className="text-lg font-bold text-[#2E7D5B]">
                      ₩{formatCurrency(settlement.receivedAmount)}
                    </p>
                  </div>
                </div>

                {/* Unpaid Amount */}
                {settlement.unpaidAmount > 0 && (
                  <div className="bg-[#FCEBE9] rounded-lg p-4 border border-[#B94A48]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-[#B94A48]" />
                        <p className="text-xs text-[#5B6773]">미수금</p>
                      </div>
                      <p className="text-xl font-bold text-[#B94A48]">
                        ₩{formatCurrency(settlement.unpaidAmount)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#5B6773]">총 청구금액</p>
              <p className="text-lg font-bold text-[#163A5F]">₩{formatCurrency(totalSum)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#5B6773]">총 수금금액</p>
              <p className="text-lg font-bold text-[#2E7D5B]">₩{formatCurrency(receivedSum)}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#D7DEE6]">
              <p className="text-base font-bold text-[#18212B]">총 미수금</p>
              <p className="text-2xl font-bold text-[#B94A48]">₩{formatCurrency(unpaidSum)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

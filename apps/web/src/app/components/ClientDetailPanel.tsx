import { X, Building2, Phone, MapPin, DollarSign, Calendar, User, FileText, TrendingUp } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface Client {
  code: string;
  name: string;
  type: string;
  representative: string;
  contactPerson: string;
  phone: string;
  region: string;
  unpaidBalance: number;
  lastTransaction: string;
  status: string;
  registrationDate: string;
}

interface ClientDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[] | null;
  title: string;
}

export function ClientDetailPanel({ isOpen, onClose, clients, title }: ClientDetailPanelProps) {
  if (!isOpen || !clients) return null;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR');
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
            <p className="text-sm text-[#5B8DB8] mt-1">총 {clients.length}개</p>
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
            {clients.map((client) => (
              <div 
                key={client.code}
                className="border border-[#D7DEE6] rounded-lg p-5 hover:bg-[#F4F7FA] transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-[#163A5F]" />
                      <h3 className="text-lg font-bold text-[#18212B]">{client.name}</h3>
                    </div>
                    <p className="text-sm text-[#5B6773] font-mono">{client.code}</p>
                  </div>
                  <StatusBadge status={client.status} />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#D7DEE6]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">구분</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{client.type}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">지역</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{client.region}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">대표자</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{client.representative}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">담당자</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{client.contactPerson}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">연락처</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{client.phone}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">등록일</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{client.registrationDate}</p>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F4F7FA] rounded-lg p-4 border border-[#D7DEE6]">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-[#B94A48]" />
                      <p className="text-xs text-[#5B6773]">미수금</p>
                    </div>
                    <p className={`text-lg font-bold ${client.unpaidBalance > 0 ? 'text-[#B94A48]' : 'text-[#2E7D5B]'}`}>
                      {formatCurrency(client.unpaidBalance)}원
                    </p>
                  </div>
                  <div className="bg-[#F4F7FA] rounded-lg p-4 border border-[#D7DEE6]">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#5B8DB8]" />
                      <p className="text-xs text-[#5B6773]">최근거래일</p>
                    </div>
                    <p className="text-sm font-bold text-[#18212B]">
                      {client.lastTransaction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#18212B]">
              총 미수금액
            </p>
            <p className="text-xl font-bold text-[#B94A48]">
              {formatCurrency(clients.reduce((sum, client) => sum + client.unpaidBalance, 0))}원
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

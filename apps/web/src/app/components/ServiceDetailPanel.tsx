import { X, Wrench, Calendar, Building2, Package, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface ServiceCase {
  caseNumber: string;
  caseDate: string;
  hospitalName: string;
  equipmentName: string;
  serialNumber: string;
  symptoms: string;
  priority: string;
  status: string;
  engineer: string;
}

interface ServiceDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cases: ServiceCase[] | null;
  title: string;
}

export function ServiceDetailPanel({ isOpen, onClose, cases, title }: ServiceDetailPanelProps) {
  if (!isOpen || !cases) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '긴급': return 'text-[#B94A48]';
      case '높음': return 'text-[#C58A2B]';
      case '보통': return 'text-[#5B8DB8]';
      case '낮음': return 'text-[#5B6773]';
      default: return 'text-[#5B6773]';
    }
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
            <p className="text-sm text-[#5B8DB8] mt-1">총 {cases.length}건</p>
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
            {cases.map((serviceCase) => (
              <div 
                key={serviceCase.caseNumber}
                className="border border-[#D7DEE6] rounded-lg p-5 hover:bg-[#F4F7FA] transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="w-5 h-5 text-[#163A5F]" />
                      <h3 className="text-lg font-bold text-[#18212B]">{serviceCase.caseNumber}</h3>
                    </div>
                    <p className="text-sm text-[#5B6773]">{serviceCase.caseDate}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={serviceCase.status} />
                    <span className={`text-xs font-bold ${getPriorityColor(serviceCase.priority)}`}>
                      {serviceCase.priority} 우선순위
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#D7DEE6]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">병원명</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{serviceCase.hospitalName}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">담당 엔지니어</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{serviceCase.engineer}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">장비명</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18212B] ml-6">{serviceCase.equipmentName}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-[#5B6773]" />
                      <p className="text-xs text-[#5B6773]">시리얼번호</p>
                    </div>
                    <p className="text-sm font-semibold text-[#5B8DB8] ml-6">{serviceCase.serialNumber}</p>
                  </div>
                </div>

                {/* Symptoms */}
                <div className="bg-[#FFF4E5] rounded-lg p-4 border border-[#C58A2B]">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-[#C58A2B] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#5B6773] mb-1">증상</p>
                      <p className="text-sm font-semibold text-[#18212B]">{serviceCase.symptoms}</p>
                    </div>
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
              총 A/S 건수
            </p>
            <p className="text-xl font-bold text-[#163A5F]">
              {cases.length}건
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

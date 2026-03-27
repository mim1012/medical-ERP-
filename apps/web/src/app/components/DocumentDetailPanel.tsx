import { X, FileText, Calendar, Package, Building2, AlertTriangle, CheckCircle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface Document {
  documentName: string;
  documentType: string;
  relatedProduct: string;
  relatedClient: string;
  version: string;
  uploadDate: string;
  expiryDate: string;
  status: string;
  daysUntilExpiry?: number;
}

interface DocumentDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[] | null;
  title: string;
}

export function DocumentDetailPanel({ isOpen, onClose, documents, title }: DocumentDetailPanelProps) {
  if (!isOpen || !documents) return null;

  const getExpiryStatus = (days: number) => {
    if (days <= 0) return { label: '만료됨', color: 'text-[#B94A48] bg-[#FCEBE9]' };
    if (days <= 30) return { label: `${days}일 남음`, color: 'text-[#B94A48] bg-[#FCEBE9]' };
    if (days <= 90) return { label: `${days}일 남음`, color: 'text-[#C58A2B] bg-[#FFF4E5]' };
    return { label: '유효', color: 'text-[#2E7D5B] bg-[#E6F4EA]' };
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
            <p className="text-sm text-[#5B8DB8] mt-1">총 {documents.length}건</p>
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
            {documents.map((doc, index) => {
              const expiryStatus = doc.daysUntilExpiry ? getExpiryStatus(doc.daysUntilExpiry) : null;
              
              return (
                <div 
                  key={index}
                  className="border border-[#D7DEE6] rounded-lg p-5 hover:bg-[#F4F7FA] transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-[#163A5F]" />
                        <h3 className="text-lg font-bold text-[#18212B]">{doc.documentName}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-[#E8EEF3] text-[#163A5F] rounded">
                          {doc.documentType}
                        </span>
                        <span className="text-xs text-[#5B6773]">v{doc.version}</span>
                      </div>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#D7DEE6]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-[#5B6773]" />
                        <p className="text-xs text-[#5B6773]">관련 품목</p>
                      </div>
                      <p className="text-sm font-semibold text-[#18212B] ml-6">{doc.relatedProduct}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-[#5B6773]" />
                        <p className="text-xs text-[#5B6773]">관련 거래처</p>
                      </div>
                      <p className="text-sm font-semibold text-[#18212B] ml-6">{doc.relatedClient}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-[#5B6773]" />
                        <p className="text-xs text-[#5B6773]">업로드일</p>
                      </div>
                      <p className="text-sm text-[#5B6773] ml-6">{doc.uploadDate}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-[#5B6773]" />
                        <p className="text-xs text-[#5B6773]">만료일</p>
                      </div>
                      <p className="text-sm font-semibold text-[#18212B] ml-6">{doc.expiryDate}</p>
                    </div>
                  </div>

                  {/* Expiry Status */}
                  {expiryStatus && doc.daysUntilExpiry !== 9999 && (
                    <div className={`rounded-lg p-4 ${expiryStatus.color}`}>
                      <div className="flex items-center gap-2">
                        {doc.daysUntilExpiry && doc.daysUntilExpiry <= 90 ? (
                          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-xs mb-1">만료 상태</p>
                          <p className="text-sm font-bold">{expiryStatus.label}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-4 border-t border-[#D7DEE6] bg-[#F4F7FA]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#18212B]">
              총 문서 수
            </p>
            <p className="text-xl font-bold text-[#163A5F]">
              {documents.length}건
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
